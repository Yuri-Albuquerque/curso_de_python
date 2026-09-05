#!/usr/bin/env python3
"""download_bcb.py — Baixa séries do BCB-SGS (API aberta) para data/csv/.

Séries usadas no curso Python para Economistas (OIKOS/UEG):
  433  : IPCA mensal (% variation)              [aulas 9, 11, 12]
  1178 : Selic diária anualizada (% a.a.)       [aulas 11, 17]
  1    : USD/BRL comercial (cotação)            [aulas 2, 11]
  13522: CEPEA/ESALQ soja R$/sc 60kg            [aulas 11, 18]
  2364 : CEPEA/ESALQ milho R$/sc                [aulas 18]
  2430 : Boi gordo indicador CEPEA/B3 (R$/@)    [aulas 18]
  2757 : Oats? não usada — mantida fora.

Fonte: https://api.bcb.gov.br/dados/serie/bcdata.sgs.{code}/dados?formato=csv
Sem autenticação; dados diários/mensais oficiais do Banco Central do Brasil.
"""

import io
import time
import urllib.request
from pathlib import Path

SERIES = {
    433: ("ipca_mensal.csv", "IPCA - variação % mensal (Brasil)"),
    1178: ("selic_diaria_aa.csv", "Selic diária anualizada % a.a."),
    1: ("usdbrl_diario.csv", "USD/BRL comercial - cotação R$"),
    13522: ("soja_cepea_rs_sc.csv", "Soja CEPEA/ESALQ R$/sc 60kg (Paraná)"),
    2364: ("milho_cepea_rs_sc.csv", "Milho CEPEA/ESALQ R$/sc (Paraná)"),
    2430: ("boi_gordo_cepea_rs_arroba.csv", "Boi gordo CEPEA/B3 R$/arroba (SP)"),
}

BASE = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.{code}/dados?formato=csv"
OUT = Path(__file__).resolve().parent / "csv"


def fetch(code: int, tentativa: int = 1) -> str:
    url = BASE.format(code=code)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (curso-oikos)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8-sig")  # BCB manda BOM em alguns endpoints


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for code, (fname, desc) in SERIES.items():
        destino = OUT / fname
        for tent in range(1, 4):
            try:
                txt = fetch(code)
                break
            except Exception as e:
                print(f"  [{code}] tentativa {tent} falhou: {e}")
                time.sleep(2 * tent)
        else:
            print(f"  [{code}] FALHOU definitivamente: {desc}")
            continue
        n_linhas = txt.count("\n")
        destino.write_text(txt, encoding="utf-8")
        print(f"  [{code}] {desc}: {n_linhas:,} linhas -> {destino.name}")
        time.sleep(1)  # gentileza com a API


if __name__ == "__main__":
    main()