# Semana 9 — Séries Temporais e Commodities do Agro

> Curso Python para Economistas — OIKOS/UEG · Empresa Júnior · Ciências Econômicas

## Visão geral da semana

Nas Semanas 1–8 a tabela do analista era uma fotografia. Esta semana ela ganha
o eixo que faltava: **o tempo**. Preço sem data não diz nada — "quanto subiu
desde o contrato?", "qual a média do trimestre?", "o dia 4 de abril foi
normal?". A Aula 17 transforma tabelas em **séries temporais** (DatetimeIndex,
`pct_change`, `rolling`, `resample`, `bdate_range`) usando as três séries que
guiam o agro e as finanças goianas: Selic diária, câmbio PTAX e soja CBOT.

A Aula 18 usa essas máquinas para responder a pergunta do cliente do OIKOS:
**"quanto sobra por saca?"**. Conversões de unidade e moeda (bushel → saca,
libra → arroba, dólar → real), preço futuro teórico pelo cost-of-carry
($F = S\,e^{(r+c-y)T}$, com a Selic de 13,9% a.a. como custo de esperar),
base do mercado físico de Rio Verde (frete, qualidade, sazonalidade) e o
hedge do produtor: $S_t + (F_0 - F_t)$ — a receita travada.

O fio condutor é o mesmo da aula anterior: o produtor de **Rio Verde e Jataí**
que planta em outubro, colhe em fevereiro e vende em duas moedas, duas unidades
e um mercado internacional que nunca dorme.

## Aulas

| Aula | Tema | Notebook | Apostila | Dados |
|---|---|---|---|---|
| 17 | DatetimeIndex, `to_datetime` (BCB/Yahoo), `shift`/`pct_change`, `rolling` 21/252, `resample` ME/YE, `bdate_range` | `a17_series_temporais_financeiras.ipynb` | `apostila_a17_series_temporais_financeiras.md` | `selic_diaria_aa.csv`, `usdbrl_diario.csv`, `soja_cbot_usd_bushel.csv` |
| 18 | Conversões agro (R$/sc, R$/@), futuro teórico $F \approx S(1{+}rT)$, base, hedge do produtor | `a18_commodities_agro_futuros.ipynb` | `apostila_a18_commodities_agro_futuros.md` | `soja_cbot_usd_bushel.csv`, `milho_cbot_usd_bushel.csv`, `boi_gordo_cme_usd_lbs.csv`, `usdbrl_diario.csv` |

## Como rodar os notebooks

1. Abra o terminal na pasta desta semana (`semana_09/`) e rode `jupyter lab`.
2. Confirme o kernel: **Python (oikos_py)** — menu *Kernel → Change Kernel*.
3. Execute as células **de cima a baixo** com `Shift+Enter`. Nada exige internet:
   as séries vêm dos CSVs locais (`../data/csv/`), offline-first.
4. A A17 tem **uma** célula opcional de coleta ao vivo (yfinance, câmbio BRL=X),
   envolvida em `try/except`: sem internet ela avisa e segue com o CSV local.
5. Exercícios: tente antes de abrir a solução (as células `# SOLUÇÃO N` seguem
   logo após cada `# EXERCÍCIO N`).

## Dados usados na semana

- `../data/csv/selic_diaria_aa.csv` — Selic diária (% a.a.), BCB-SGS 1178,
  02/01/2017 → 04/09/2026; leitura `pd.read_csv(sep=';', decimal=',')` +
  `pd.to_datetime(format='%d/%m/%Y', dayfirst=True)`. Selic média de 2025 ≈ 14,33% a.a.
- `../data/csv/usdbrl_diario.csv` — câmbio PTAX diário (R$/US$), BCB-SGS 1,
  mesmo período e leitura; fechamento em 04/set/2026 ≈ R$ 5,13.
- `../data/csv/soja_cbot_usd_bushel.csv` — futuro soja CBOT (ZS=F), US$/bushel
  (cotação em centavos: dividir por 100), datas ISO `YYYY-MM-DD`.
  Fechamento ≈ US$ 12,94/bu → ≈ R$ 146,2/saca de 60 kg.
- `../data/csv/milho_cbot_usd_bushel.csv` — futuro milho CBOT (ZC=F), idem
  (1 bu = 25,401 kg) → ≈ R$ 62,0/saca.
- `../data/csv/boi_gordo_cme_usd_lbs.csv` — futuro boi gordo CME (LE=F), US$/lb
  (1 arroba = 33,069 lb) → ≈ R$ 361/@.
- Spot de Rio Verde usado na base/hedge é **fictício** (R$ 138/sc) — o objetivo
  didático é o cálculo da base e do hedge, não a cotação oficial da praça.

## Checklist da semana

- [ ] A17 rodou de cima a baixo sem erro (incluindo a célula opcional yfinance com fallback).
- [ ] A18 rodou de cima a baixo sem erro (conversões, $F$ teórico, base, hedge).
- [ ] Você sabe explicar por que `format='%d/%m/%Y'` + `dayfirst=True` são
      obrigatórios no dado do BCB — e o que acontece sem eles.
- [ ] Você consegue converter US$/bu → R$/sc e US$/lb → R$/@ sem olhar a apostila.
- [ ] Você sabe dizer o que a base negativa revela (frete/qualidade) e o que o
      hedge trava (a receita em ~$F_0$) — e o que ele **não** elimina (risco de base).
- [ ] Os 8 exercícios (4 por aula) feitos sem consultar o gabarito da apostila.

## Referências da semana (KB)

- `kb/01_mckinney_python_for_data_analysis/12_chapter-10-time-series.md`
  — McKinney, Cap. 10 *Time Series*: DatetimeIndex, indexação por data,
  `shift`/`pct_change`, `rolling`, `resample` (Aulas 17 e 18).
- `kb/01_mckinney_python_for_data_analysis/13_chapter-11-financial-and-economic-data-applications.md`
  — McKinney, Cap. 11: retornos, janelas e agregações financeiras (Aula 17).
- `kb/03_jansen_ml_for_algorithmic_trading/15_chapter-9-time-series-models-for-volatility-forecasts-and-st.md`
  — Jansen, Cap. 9: volatilidade realizada e médias móveis como sinais (Aula 17).
- `kb/03_jansen_ml_for_algorithmic_trading/07_chapter-1-machine-learning-for-trading-from-idea-to-executio.md`
  — Jansen, Cap. 1: mercados, futuros e a lógica do hedge (Aula 18).
- `kb/03_jansen_ml_for_algorithmic_trading/08_chapter-2-market-and-fundamental-data-sources-and-techniques.md`
  — Jansen, Cap. 2: fontes de dados de mercado (futuros, unidades, calendários) (Aulas 17–18).