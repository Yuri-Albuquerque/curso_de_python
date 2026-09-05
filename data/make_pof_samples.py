#!/usr/bin/env python3
"""make_pof_samples.py — Gera amostras leves da POF 2017-2018 (IBGE) p/ Aula 13.

Lê os microdados fixed-width em
  ~/Documents/artigos_lidos/bourdieu_agents/artigo_1/data/microdados/
usando colspecs validados no artigo Bourdieu/artigo_1 e produz 3 CSVs em
  cursos_2s_2026/OIKOS/curso_de_python/data/csv/:
  - pof_domicilio.csv      : household_id, UF, SITUACAO(1=urbano,2=rural), PESO
  - pof_morador.csv        : household_id, ANOS_EST, NIVEL_INST, RENDA_PC, hh_size
                             (pessoa de referência V0306=1)
  - pof_despesa_categoria.csv : household_id + gasto anualizado (R$) por categoria
                             (DESPESA_COLETIVA, quadros mapeados, deflacionados)

Categorias (mapeamento QUADRO, herdado do parser do artigo_1):
  food, housing, transport, health, education, recreation, clothing, other
"""

import os
import pandas as pd

POF_DIR = os.path.expanduser(
    "~/Documents/artigos_lidos/bourdieu_agents/artigo_1/data/microdados")
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "csv")


def categorize(q):
    if q in [6, 7]:
        return "food"
    elif q in [8, 9, 10]:
        return "housing"
    elif q == 11:
        return "health"
    elif q == 12:
        return "transport"
    elif q in [21, 22]:
        return "clothing"
    elif q in [26, 27]:
        return "health"
    elif q in [28, 29, 30]:
        return "transport"
    elif q in [31, 32, 33]:
        return "recreation"
    elif q in [34, 35, 36]:
        return "education"
    elif q in [44, 45, 46, 47, 48]:
        return "housing"
    else:
        return "other"


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    # ---- DOMICILIO ----
    # NOTA: linhas deste arquivo têm 79 chars; colspecs de peso (91,105) do artigo_1
    # não se aplicam a ESTA versão do arquivo — peso ficou fora. Exportamos só os
    # campos validados empiricamente: UF, SITUACAO, household_id.
    dom = pd.read_fwf(
        os.path.join(POF_DIR, "DOMICILIO.txt"),
        colspecs=[(0, 2), (6, 7), (7, 16), (16, 18)],
        names=["UF", "SITUACAO", "COD_UPA", "NUM_DOM"],
        header=None, dtype=str)
    dom["household_id"] = dom["COD_UPA"].str.strip() + "_" + dom["NUM_DOM"].str.strip()
    dom["UF"] = pd.to_numeric(dom["UF"], errors="coerce")
    dom["SITUACAO"] = pd.to_numeric(dom["SITUACAO"], errors="coerce")
    dom = dom[["household_id", "UF", "SITUACAO"]].dropna()
    dom = dom.drop_duplicates(subset="household_id")
    print(f"DOMICILIO: {len(dom):,} domicílios")
    dom.to_csv(os.path.join(OUT_DIR, "pof_domicilio.csv"), index=False)

    # ---- MORADOR (pessoa de referência) ----
    mor = pd.read_fwf(
        os.path.join(POF_DIR, "MORADOR.txt"),
        colspecs=[(0, 2), (7, 16), (16, 18), (21, 23), (75, 77), (115, 116), (116, 136)],
        names=["UF", "COD_UPA", "NUM_DOM", "V0306", "ANOS_EST", "NIVEL_INST", "RENDA_PC"],
        header=None, dtype=str)
    mor["household_id"] = mor["COD_UPA"].str.strip() + "_" + mor["NUM_DOM"].str.strip()
    mor["V0306"] = pd.to_numeric(mor["V0306"], errors="coerce")
    mor["ANOS_EST"] = pd.to_numeric(mor["ANOS_EST"], errors="coerce")
    mor["NIVEL_INST"] = pd.to_numeric(mor["NIVEL_INST"], errors="coerce")
    mor["RENDA_PC"] = pd.to_numeric(mor["RENDA_PC"], errors="coerce")
    hh_size = mor.groupby("household_id").size().rename("hh_size")
    ref = mor[mor["V0306"] == 1].merge(hh_size, on="household_id", how="left")
    ref = ref[["household_id", "ANOS_EST", "NIVEL_INST", "RENDA_PC", "hh_size"]].dropna()
    print(f"MORADOR: {len(ref):,} pessoas de referência")
    ref.to_csv(os.path.join(OUT_DIR, "pof_morador.csv"), index=False)

    # ---- DESPESA_COLETIVA -> gasto anual por categoria ----
    co = pd.read_fwf(
        os.path.join(POF_DIR, "DESPESA_COLETIVA.txt"),
        colspecs=[(7, 16), (16, 18), (19, 21), (74, 84), (96, 99)],
        names=["COD_UPA", "NUM_DOM", "QUADRO", "V8000_DEFLA", "FATOR"],
        header=None, dtype=str)
    co["household_id"] = co["COD_UPA"].str.strip() + "_" + co["NUM_DOM"].str.strip()
    co["QUADRO"] = pd.to_numeric(co["QUADRO"], errors="coerce")
    co["V8000_DEFLA"] = pd.to_numeric(co["V8000_DEFLA"], errors="coerce")
    co["FATOR"] = pd.to_numeric(co["FATOR"], errors="coerce")
    co = co.dropna(subset=["QUADRO", "V8000_DEFLA"])
    co["annual"] = co["V8000_DEFLA"] * co["FATOR"]
    co["categoria"] = co["QUADRO"].apply(categorize)
    print(f"DESPESA_COLETIVA: {len(co):,} registros, {co['household_id'].nunique():,} domicílios")

    wide = co.pivot_table(index="household_id", columns="categoria",
                          values="annual", aggfunc="sum", fill_value=0.0)
    wide = wide.reset_index()
    print(f"Despesa por categoria: {wide.shape[0]:,} x {wide.shape[1]} colunas")
    print(f"Colunas: {list(wide.columns)}")
    wide.to_csv(os.path.join(OUT_DIR, "pof_despesa_categoria.csv"), index=False)

    # ---- Sanity check ----
    amostra = wide.merge(ref[["household_id", "RENDA_PC"]], on="household_id", how="inner")
    print(f"\nSanity: {len(amostra):,} domicílios com renda+despesa")
    print(f"  renda_pc média: {amostra['RENDA_PC'].mean():,.0f} | mediana: {amostra['RENDA_PC'].median():,.0f}")
    cols_gasto = [c for c in amostra.columns if c not in ("household_id", "RENDA_PC")]
    print(f"  gasto total anual médio: R$ {amostra[cols_gasto].sum(axis=1).mean():,.0f}")


if __name__ == "__main__":
    main()