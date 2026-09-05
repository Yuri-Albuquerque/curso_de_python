# Semana 6 — Visualização de Dados: Matplotlib e Seaborn

> Curso Python para Economistas — OIKOS/UEG · Empresa Júnior · Ciências Econômicas

## Visão geral da semana

Nas Semanas 1–5 você produziu tabelas, números e agregações. Esta semana transforma
números em **argumento visual** — a habilidade que mais aparece em relatório,
consultoria e apresentação. A mudança de mentalidade: **todo gráfico de relatório
tem uma mensagem, e o título é quem a enuncia**.

A Aula 11 domina a base (Matplotlib pela interface orientada a objetos:
`fig, ax = plt.subplots()`): linhas com as séries do BCB (Selic × IPCA acumulado
em 12 meses — a distância entre as linhas é o juro real), barras com a renda média
por UF da POF (Goiás destacado), customização profissional (títulos-enunciado,
legendas, grids, formatação em R$ com `FuncFormatter` + `brl()`), subplots e
`savefig(dpi=300)`.

A Aula 12 sobe para a camada estatística (seaborn): distribuição da renda per
capita (`histplot`, `kdeplot` — média R$ 1.687 vs mediana R$ 1.155, assimetria
positiva), boxplots da renda por escolaridade e por urbano/rural, dispersão
renda × gastos com reta de tendência (Lei de Engel: participação da alimentação
cai de ~68% no tercil pobre para ~60% no tercil rico) e heatmap de correlações
entre categorias de gasto.

## Aulas

| Aula | Tema | Notebook | Apostila | Dados |
|---|---|---|---|---|
| 11 | Matplotlib OO: linhas, barras, customização, subplots, savefig | `a11_matplotlib_fundamentos.ipynb` | `apostila_a11_matplotlib_fundamentos.md` | `selic_diaria_aa.csv`, `ipca_mensal.csv`, `pof_morador.csv`, `pof_domicilio.csv` |
| 12 | Seaborn: distribuições, boxplot, scatter + regressão, heatmap, facetas | `a12_seaborn_estatistica.ipynb` | `apostila_a12_seaborn_estatistica.md` | `pof_morador.csv`, `pof_domicilio.csv`, `pof_despesa_categoria.csv` |

## Como rodar os notebooks

1. Abra o terminal na pasta desta semana (`semana_06/`) e rode `jupyter lab`.
2. Confirme o kernel: **Python (oikos_py)** — menu *Kernel → Change Kernel*.
3. Execute as células **de cima a baixo** com `Shift+Enter`. Nada exige internet:
   todos os dados vêm de CSVs locais (`../data/csv/`), offline-first.
4. Exercícios: tente antes de abrir a solução (as células `# SOLUÇÃO N` seguem logo
   após cada `# EXERCÍCIO N`).
5. A Aula 11 exporta um PNG de exemplo (`fig_selic_2022_2026.png`) na pasta da
   semana — é a demonstração do `savefig(dpi=300)`.

## Dados usados na semana

- `../data/csv/selic_diaria_aa.csv` — Selic diária (% a.a.), BCB-SGS 1178,
  2017→2026. Leitura: `pd.read_csv(sep=';')` + `pd.to_datetime(format='%d/%m/%Y',
  dayfirst=True)`. Referência: **13,90% a.a. em set/2026**; mínima de 1,90% a.a.
  em ago/2020 (pandemia).
- `../data/csv/ipca_mensal.csv` — IPCA mensal (%), BCB-SGS 433, 1980→2026.
  Leitura: `pd.read_csv(sep=';', decimal=',')`. Referências: acumulado 12m ≈
  **4,44%** (jul/2026); pico de 82,39% em mar/1990 (hiperinflação).
- `../data/csv/pof_morador.csv` + `pof_domicilio.csv` — POF 2017-18 (IBGE),
  pessoa de referência: RENDA_PC (R$/mês per capita), NIVEL_INST (1–7),
  ANOS_EST, UF (Goiás = 52), SITUACAO (1 = urbano, 2 = rural). Estatísticas
  não-ponderadas. Referências: renda per capita média **R$ 1.687** / mediana
  **R$ 1.155**; urbano **R$ 1.814** × rural **R$ 1.253**; GO média **R$ 1.701**
  (11ª entre 27 UFs; DF lidera com R$ 3.300).
- `../data/csv/pof_despesa_categoria.csv` — gasto anualizado (R$, deflacionado)
  por categoria: food, housing, transport, health, other. Correlação renda ×
  alimentação ≈ 0,29; participação da alimentação no total cai de ~68% (tercil
  pobre) para ~60% (tercil rico) — **Lei de Engel**.

## Checklist da semana

- [ ] A11 rodou de cima a baixo sem erro (Selic×IPCA, barras por UF, formatter de reais, subplots, savefig 300 dpi).
- [ ] A12 rodou de cima a baixo sem erro (histplot/kdeplot da RENDA_PC, boxplots, regplot, heatmap, facetas urbano/rural).
- [ ] Você sabe explicar por que `fig, ax = plt.subplots()` e não `plt.plot()` solto, em relatório com vários gráficos.
- [ ] Você sabe dizer por que a média da renda (R$ 1.687) fica acima da mediana (R$ 1.155) — e quando relatar cada uma.
- [ ] Você sabe interpretar um boxplot (Q1, mediana, Q3, outliers 1,5×IQR) e um heatmap de correlação.
- [ ] Os 8 exercícios (4 por aula) feitos sem consultar o gabarito da apostila.

## Referências da semana (KB)

- `kb/02_vanderplas_python_data_science_handbook/07_chapter-4-visualization-with-matplotlib.md`
  — VanderPlas, Cap. 4: anatomia Figure/Axes, line/bar plots, subplots, ticks e
  formatação, estilos, gráficos de densidade e histogramas.
- `kb/01_mckinney_python_for_data_analysis/10_chapter-8-plotting-and-visualization.md`
  — McKinney, Cap. 8 (Aula 11): plotting com Matplotlib e pandas, rótulos,
  legendas, exportação de figuras.