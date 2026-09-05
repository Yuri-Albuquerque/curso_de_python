# Semana 5 — pandas I: Series, DataFrame, E/S de dados · agrupamento e junções

> Curso Python para Economistas — OIKOS/UEG · Empresa Júnior · Ciências Econômicas

## Visão geral da semana

A Semana 4 fechou o NumPy: matrizes rápidas, broadcasting, máscaras. A Semana 5
coloca em cima dessa fundação a ferramenta de trabalho do economista: o **pandas**.
A mudança de mentalidade tem duas partes — **linhas e colunas com etiqueta** (índice
explícito, colunas rotuladas) e **operações descritas, não programadas** ("média por
grupo", "junte pelo household_id") em vez de laços.

A Aula 09 constrói os dois objetos centrais (`Series`, `DataFrame`), treina as duas
portas de seleção (`loc`/`iloc`) e faz o ritual de leitura de dados reais: CSV
brasileiro do Banco Central (`sep=';'`, `decimal=','`), Excel com openpyxl, acentos
com `encoding`, dados faltantes com `isna`/`dropna`/`ffill`/`bfill` (pandas 3.x).

A Aula 10 usa o que foi montado para responder uma pergunta de verdade: **a Lei de
Engel nos microdados da POF 2017-18** — a fração do orçamento gasta em alimentação
cai conforme a renda sobe? No caminho: filtros vetoriais, colunas derivadas,
`groupby` com named aggregation, `pivot_table` e `merge` (inner/left/outer).

## Aulas

| Aula | Tema | Notebook | Apostila | Dados |
|---|---|---|---|---|
| 09 | Series, DataFrame, loc/iloc, read_csv/read_excel, dados faltantes | `a09_pandas_series_dataframe.ipynb` | `apostila_a09_pandas_series_dataframe.md` | `ipca_mensal.csv`, `usdbrl_diario.csv` (BCB) + Excel/CSV gerados na aula |
| 10 | Filtros, colunas derivadas, groupby, pivot_table, merge | `a10_pandas_groupby_merge.ipynb` | `apostila_a10_pandas_groupby_merge.md` | POF 2017-18: `pof_morador.csv`, `pof_domicilio.csv`, `pof_despesa_categoria.csv` |

## Como rodar os notebooks

1. Abra o terminal na pasta desta semana (`semana_05/`) e rode `jupyter lab`.
2. Confirme o kernel: **Python (oikos_py)** — menu *Kernel → Change Kernel*.
3. Execute as células **de cima a baixo** com `Shift+Enter`. Nada exige internet:
   todos os CSVs já estão em `../data/csv/` (offline-first).
4. Os notebooks escrevem arquivos na pasta da semana (`mini_relatorio_a09.xlsx`,
   `regioes_a09.csv`) — é o ciclo de exportação/importação da Aula 09; podem ser
   apagados depois.
5. Exercícios: tente antes de abrir a solução (as células `# SOLUÇÃO N` seguem
   logo após cada `# EXERCÍCIO N`).

## Dados usados na semana

- `../data/csv/ipca_mensal.csv` — IPCA mensal %, BCB-SGS 433, 1980→2026
  (`pd.read_csv(sep=';', decimal=',')` + `pd.to_datetime(dayfirst=True)`).
  IPCA acumulado 12 meses (até jul/2026) ≈ **4,4%**.
- `../data/csv/usdbrl_diario.csv` — câmbio R$/US$ diário, BCB-SGS 1, 2017→2026;
  2.429 observações, última cotação ≈ R$ 5,13 (04/09/2026).
- `../data/csv/pof_morador.csv` — renda per capita e escolaridade do responsável
  (POF 2017-18, IBGE); `pof_domicilio.csv` — UF e situação (urbano/rural);
  `pof_despesa_categoria.csv` — despesa anualizada por categoria.
  ⚠ `pof_morador` tem 2.344 `household_id` repetidos (duas pessoas de referência
  no mesmo domicílio): a aula trata com `drop_duplicates` **antes** do merge.
  Estatísticas não-ponderadas (amostra didática). Goiás = UF **52**; DF = 53.
- Números de referência (set/2026): Selic ≈ 13,9% a.a.; câmbio ≈ R$ 5,12/US$;
  salário mínimo R$ 1.518 (2026); IPCA 12m ≈ 4,4%.

## Checklist da semana

- [ ] A09 rodou de cima a baixo sem erro (CSV do BCB, ciclo Excel, ffill/bfill).
- [ ] A10 rodou de cima a baixo sem erro (POF carregada, merge diagnosticado,
      Engel por quartil em Goiás).
- [ ] Você sabe explicar a diferença entre `loc` e `iloc` — e por que a fatia do
      `loc` é inclusiva e a do `iloc` não.
- [ ] Você consegue ler um CSV brasileiro (`;` + vírgula decimal) sem erro de tipo.
- [ ] Você consegue diagnosticar um merge: quantas linhas entraram, quantas saíram,
      quem desapareceu.
- [ ] Os 9 exercícios (4 + 5) feitos sem consultar o gabarito da apostila.

## Referências da semana (KB)

- `kb/02_vanderplas_python_data_science_handbook/06_chapter-3-data-manipulation-with-pandas.md`
  — VanderPlas, Cap. 3: objetos do pandas, indexação, agregação e agrupamento, merge.
- `kb/01_mckinney_python_for_data_analysis/07_chapter-5-getting-started-with-pandas.md`
  — McKinney, Cap. 5: Series, DataFrame, indexação.
- `kb/01_mckinney_python_for_data_analysis/08_chapter-6-data-loading-storage-and-file-formats.md`
  — McKinney, Cap. 6: read_csv (sep, decimal, encoding) e formatos de arquivo.
- `kb/01_mckinney_python_for_data_analysis/09_chapter-7-data-wrangling-clean-transform-merge-reshape.md`
  — McKinney, Cap. 7 (Aula 10): merge, drop_duplicates, pivoteamento.
- `kb/01_mckinney_python_for_data_analysis/11_chapter-9-data-aggregation-and-group-operations.md`
  — McKinney, Cap. 9 (Aula 10): groupby em profundidade.