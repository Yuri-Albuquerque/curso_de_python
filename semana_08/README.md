# Semana 8 — Engenharia Econômica: VPL, TIR, Amortização e Comprar vs Leasing

> Curso Python para Economistas — OIKOS/UEG · Empresa Júnior · Ciências Econômicas

## Visão geral da semana

A Semana 8 fecha o bloco de **engenharia econômica e orçamento de capital**. A Aula 15
implementa os três pilares do laudo de investimento — VPL, TIR e tabela de amortização —
em Python puro, com a taxa de desconto construída na mão (WACC ~13,9%: Selic set/2026 +
prêmio de risco do agro). A Aula 16 usa o mesmo aparato do lado do **custo**: a
transportadora de grãos que não sabe se compra à vista, financia ou dá lease no
caminhão — e a resposta, como sempre, depende de impostos, do valor do tempo e do
custo do capital, não da parcela.

Metodologia: code-along no JupyterLab (2 aulas de 50 min). O aluno roda cada célula
junto com o instrutor; apostila de leitura antes da aula, notebook durante.

## Aulas

| Aula | Tema | Notebook | Apostila | Dados |
|---|---|---|---|---|
| 15 | VPL, TIR e amortização: engenharia econômica no Python | `a15_vpl_tir_amortizacao.ipynb` | `apostila_a15_vpl_tir_amortizacao.md` | nenhum (fluxos hipotéticos de consultoria) |
| 16 | Comprar vs Leasing: o VPL do lado do custo | `a16_compra_vs_leasing.ipynb` | `apostila_a16_compra_vs_leasing.md` | nenhum (caso de consultoria OIKOS) |

## Antes da Aula 15 — o que revisar

- **Aula 05** (`semana_03/apostila_a05_funcoes_excecoes.md`): `vpl()` e `pmt()` como
  funções — a Aula 15 generaliza o que lá era esboço.
- **Aula 06** (`semana_03/apostila_a06_classes_poo_financas.md`): classe
  `ProjetoInvestimento` com `calcular_vpl()` e payback — aqui, sem classe: funções puras.
- **Aula 14** (`semana_07/`): DRE e balanço — depreciação e impostos já aparecem lá;
  agora viram **escudo fiscal** dentro do fluxo de caixa.

## Como rodar os notebooks

1. Abra o terminal na pasta desta semana (`semana_08/`) e rode `jupyter lab`.
2. Abra o notebook e confirme o kernel: **Python (oikos_py)** — menu *Kernel → Change Kernel*.
3. Execute as células **de cima a baixo** com `Shift+Enter`. Os notebooks da Semana 8
   não exigem internet nem dados externos: tudo é calculado com numpy/pandas/matplotlib.
4. Exercícios: tente antes de abrir a solução (as células `# SOLUÇÃO N` seguem logo
   após cada `# EXERCÍCIO N`); o gabarito comentado está na Seção 7 de cada apostila.

## Os números que decidem a semana

Números de referência usados nos exemplos (set/2026, offline-first, sem download):

| grandeza | valor | onde aparece |
|---|---|---|
| Selic (set/2026) | 13,9% a.a. | taxa-base do WACC (A15 §3, A16 §2) |
| WACC adotado | 13,9% a.a. | taxa de desconto dos dois notebooks |
| custo da dívida pós-IR | 14% × (1−0,34) = 9,24% a.a. | lógica do financiamento vencer (A16) |
| IRPJ + CSLL | 34% | escudo fiscal de depreciação/juros/leasing |
| VPL do confinamento @13,9% | R$ 1.027.111,88 | A15 §2 |
| TIR do confinamento | 22,47% | A15 §4 |
| financiamento silo | R$ 800 mil, 12% a.a., 120× | SAC × Price (A15 §6): Price +R$ 84.235 de juros |
| caminhão-caçamba | R$ 1,2 mi | caso dos 3 cenários (A16) |
| VPL de custo | A 986.349,31 · **B 913.371,25** · C 1.089.185,54 | A16 §6 → recomendação: financiamento |
| break-even do financiamento | ≈ 21% a.a. de contrato (≈ 13,9% pós-IR) | A16 §6 |

## Checklist da semana

- [ ] A15 rodou de cima a baixo sem erro (VPL, bisseção, SAC/Price, gráfico VPL × taxa).
- [ ] Sei explicar por que a taxa do laudo é 13,9% e não "achismo" (Selic + prêmio).
- [ ] Sei por que `taxa_aa/12` está errado e `(1+taxa_aa)**(1/12) - 1` está certo.
- [ ] A16 rodou de cima a baixo sem erro (3 cenários, escudos, break-even, CAE).
- [ ] Sei dizer por que "parcela menor" não é critério de decisão — e o que é.
- [ ] Os 8 exercícios (4 por aula) feitos sem consultar o gabarito da apostila.

## Referências da semana (KB)

- `kb/01_mckinney_python_for_data_analysis/13_chapter-11-financial-and-economic-data-applications.md`
  — McKinney, *Python for Data Analysis* (2012), cap. 11: aplicações financeiras e
  econômicas com pandas (tabelas, resumos, dados econômicos).
- `kb/03_jansen_ml_for_algorithmic_trading/11_chapter-5-portfolio-optimization-and-performance-evaluation.md`
  — Jansen, *ML for Algorithmic Trading* (2ª ed.), cap. 5: taxa livre de risco, retorno
  exigido e métricas de desempenho — a base conceitual do WACC.
- Repasso das semanas 3 e 7: `semana_03/apostila_a05_funcoes_excecoes.md`,
  `semana_03/apostila_a06_classes_poo_financas.md`, `semana_07/apostila_a14_valuation_dre_balanco.md`.