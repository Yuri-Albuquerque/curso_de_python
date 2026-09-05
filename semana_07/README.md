# Semana 7 — Laboratório de Microdados (POF) e Valuation/DRE

> Curso Python para Economistas — OIKOS/UEG · Empresa Júnior · Ciências Econômicas

## Visão geral da semana

A Semana 7 é a semana da **análise aplicada com pandas**: nas duas aulas o DataFrame deixa
de ser exercício e vira ferramenta de trabalho — primeiro sobre **microdados reais do IBGE**
(POF 2017-18), depois sobre **demonstrações financeiras** de uma PME goiana.

A **Aula 13** é um laboratório: três bases da POF (domicílios, moradores e despesas) são
lidas, deduplicadas, combinadas com `merge` pela chave `household_id` e transformadas em
faixas de renda com `pd.cut`. O prêmio da aula é reproduzir a **Lei de Engel** com dados
brasileiros — a participação da alimentação no gasto cai de ~57% (até ½ SM) para ~32%
(acima de 5 SM) — e fechar com escolaridade × renda. Todas as estatísticas são
**não-ponderadas**: a versão didática da base não traz o fator de expansão amostral, e
esse limite é discutido abertamente em aula.

A **Aula 14** monta a DRE e o Balanço da *Granol & Cia Ltda.* (esmagadora de soja, Goiânia,
~R$ 12 mi de receita líquida/ano) em DataFrames, roda análise **vertical** e **horizontal**,
calcula liquidez, endividamento, margens, **ROE via DuPont** e **ROIC**, projeta 3 anos,
deriva o **FCFF** (EBIT×(1−t) + D&A − Capex − ΔNCG) e faz um **valuation** por fluxo
descontado com valor terminal de Gordon — incluindo tabela de sensibilidade WACC × g.
Valuation de referência da aula: **EV ≈ R$ 6,9 mi; equity ≈ R$ 5,8 mi** (WACC ≈ 16,5%).

## Aulas

| Aula | Tema | Notebook | Apostila | Dados |
|---|---|---|---|---|
| 13 | Lab POF: merge de 3 bases, faixas com `pd.cut`, Lei de Engel, Goiás, urbano×rural, escolaridade×renda | `a13_pof_microdados_lab.ipynb` | `apostila_a13_pof_microdados_lab.md` | `pof_domicilio.csv`, `pof_morador.csv`, `pof_despesa_categoria.csv` (IBGE/POF 2017-18) |
| 14 | DRE e Balanço em DataFrames, vertical/horizontal, indicadores, DuPont, ROIC, FCFF e valuation | `a14_valuation_dre_balanco.ipynb` | `apostila_a14_valuation_dre_balanco.md` | sintéticos (calibrados com margens do setor granoleiro) |

## Como rodar os notebooks

1. Abra o terminal na pasta desta semana (`semana_07/`) e rode `jupyter lab`.
2. Confirme o kernel: **Python (oikos_py)** — menu *Kernel → Change Kernel*.
3. Execute as células **de cima a baixo** com `Shift+Enter`. Nada exige internet: a POF vem
   dos CSVs locais (`../data/csv/`), offline-first; a DRE é construída no próprio notebook.
4. Exercícios: tente antes de abrir a solução (as células `# SOLUÇÃO N` seguem logo após
   cada `# EXERCÍCIO N`).
5. A Aula 13 lê bases de ~58 mil linhas — as agregações levam segundos; é o normal em
   microdados.

## Dados usados na semana

- `../data/csv/pof_domicilio.csv` — 57.920 domicílios: `household_id`, `UF` (código IBGE;
  **Goiás = 52**, DF = 53), `SITUACAO` (1 = urbano, 2 = rural).
- `../data/csv/pof_morador.csv` — 58.039 linhas (há domicílios com mais de um respondente):
  `ANOS_EST`, `NIVEL_INST` (1 = sem instrução … 7 = superior completo), `RENDA_PC` (R$/mês
  per capita), `hh_size`. Deduplicamos ficando com a linha de maior renda.
- `../data/csv/pof_despesa_categoria.csv` — 57.799 domicílios com gasto anualizado (R$,
  deflacionado) em `food`, `housing`, `transport`, `health`, `other`.
- Salário mínimo de referência da POF 2017-18: **R$ 954,00** (SM de 2018) — as faixas
  ("até 1/2 SM", "1/2 a 2 SM", "2 a 5 SM", "acima de 5 SM") são per capita.
- DRE/Balanço da Granol & Cia: **sintéticos**, calibrados (CMV ≈ 62% da receita líquida,
  margem EBITDA ≈ 16%, IRPJ+CSLL 34%). Números de referência (set/2026): Selic 13,9% a.a.,
  câmbio ≈ R$ 5,12/US$, SM R$ 1.518 (2026).
- **Limitação**: sem pesos amostrais, todas as estatísticas da POF descrevem a *amostra*,
  não a população. Em trabalho de verdade, use os pesos originais do IBGE.

## Checklist da semana

- [ ] A13 rodou de cima a baixo sem erro (3 merges, `pd.cut`, tabelas de Engel, gráficos).
- [ ] A14 rodou de cima a baixo sem erro (DRE, balanço, indicadores, projeção, valuation).
- [ ] Você sabe explicar, em uma frase, por que a participação da alimentação cai com a
      renda — e por que a da moradia, na nossa base, faz o contrário no topo da distribuição.
- [ ] Você sabe montar o FCFF de cabeça e dizer por que D&A entra somando e Capex subtraindo.
- [ ] Você consegue justificar por que o valuation mudou tanto entre WACC 15% e 18%.
- [ ] Os 8 exercícios (4 por aula) feitos sem consultar o gabarito da apostila.

## Referências da semana (KB)

- Aula 13 — McKinney:
  - `kb/01_mckinney_python_for_data_analysis/07_chapter-5-getting-started-with-pandas.md`
  - `kb/01_mckinney_python_for_data_analysis/08_chapter-6-data-loading-storage-and-file-formats.md`
  - `kb/01_mckinney_python_for_data_analysis/11_chapter-9-data-aggregation-and-group-operations.md`
- Aula 14 — McKinney + Jansen:
  - `kb/01_mckinney_python_for_data_analysis/13_chapter-11-financial-and-economic-data-applications.md`
  - `kb/03_jansen_ml_for_algorithmic_trading/11_chapter-5-portfolio-optimization-and-performance-evaluation.md`