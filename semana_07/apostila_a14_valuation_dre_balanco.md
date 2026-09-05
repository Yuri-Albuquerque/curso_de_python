# Apostila Aula 14 — Valuation e DRE: da Demonstração ao Valor da Empresa
> Curso Python para Economistas — OIKOS/UEG · Semana 7

## 1. Por que isso importa (intuição econômica)

Toda consultoria, fusão, captação ou avaliação de acionista passa pelo mesmo ritual:
transformar **contabilidade** (DRE e Balanço) em **caixa** (fluxo de caixa livre) e, em
seguida, transformar caixa futuro em **valor presente**. O economista que só sabe ler os
relatórios prontos trabalha com o que a empresa decidiu mostrar; o que monta a demonstração
em um DataFrame pergunta às tabelas o que quiser — estrutura de custos, alavancagem,
qualidade do lucro, sensibilidade do valor às hipóteses.

O caso da aula é propositalmente uma **PME**: *Granol & Cia Ltda.*, esmagadora de soja no
polo granoleiro de Goiânia, ~R$ 12 milhões de receita líquida anual. Por que não uma
corporation de bolsa? Porque a PME é o cliente real da Empresa Júnior: contas simples o
suficiente para caber em três DataFrames, mas com todos os componentes do valuation
profissional — WACC, valor terminal, dívida líquida, sensibilidade. Quem entender a Granol,
entende o valuation de qualquer empresa.

O segundo motivo da aula é disciplinar a intuição: **lucro não é caixa**. A Granol pode
ter lucro contábil crescente e ainda assim passar sede de caixa, porque a soja estocada e
o prazo dado aos clientes consomem dinheiro antes de devolvê-lo. O FCFF existe exatamente
para corrigir isso — e a decomposição de DuPont existe para explicar *de onde vem* o ROE:
margem, giro ou alavancagem? Cada resposta implica uma estratégia comercial, operacional
ou financeira completamente diferente.

## 2. Teoria essencial

### 2.1 DRE e Balanço como tabelas

A **DRE** é uma subtração em cascata; cada linha deriva das anteriores:

$$
\begin{aligned}
\text{Receita líquida} &= \text{Receita bruta} - \text{deduções}\\
\text{Lucro bruto} &= \text{Receita líquida} - \text{CMV}\\
\text{EBITDA} &= \text{Lucro bruto} - \text{despesas adm/vendas}\\
\text{EBIT} &= \text{EBITDA} - \text{D\&A}\\
\text{LAIR} &= \text{EBIT} + \text{resultado financeiro}\\
\text{Lucro líquido} &= \text{LAIR} \times (1 - t), \qquad t = 34\% \text{ (IRPJ+CSLL)}
\end{aligned}
$$

O **Balanço** é a fotografia em um instante: Ativo (aplicações de recursos) = Passivo
(Origem: dívidas) + PL (dos sócios). Em DataFrame, a identidade vira verificação vetorial:
`ativo.sum(axis=1) - passivo.sum(axis=1)` deve dar zero em todos os anos — nossa prova dos
nove contábil.

### 2.2 Análise vertical e horizontal

**Vertical** responde "quanto pesa cada conta?" — tudo como fração da receita líquida do
mesmo ano:

$$
v_{i,t} = \frac{x_{i,t}}{\text{Receita líq}_{t}}
$$

Revela a **estrutura de custos**: CMV de 62% diz que a matéria-prima (a própria soja)
domina a margem — e que o resultado da Granol é, na prática, uma aposta no spread entre
grão comprado e óleo/farelo vendido.

**Horizontal** responde "quanto cresceu?" — variação relativa ano a ano:

$$
h_{i,t} = \frac{x_{i,t} - x_{i,t-1}}{x_{i,t-1}} \times 100
$$

Em pandas, `.pct_change()` faz exatamente isso por linha. O interesse está em comparar as
taxas **entre linhas**: lucro crescendo mais que receita é **alavancagem operacional**
(custos fixos diluídos); crescendo menos, deterioração de margem.

### 2.3 Liquidez e endividamento

$$
\text{Liquidez corrente} = \frac{\text{Ativo circulante}}{\text{Passivo circulante}},
\qquad
\text{Dívida/EBITDA} = \frac{\text{Dívida total}}{\text{EBITDA}}
$$

- **LC**: "para cada R$ 1 que vence no curto prazo, quantos R$ tenho disponíveis?" Abaixo
  de 1,00 é sinal amarelo; na Granol, LC de **1,78 → 1,96** é confortável.
- **Liquidez seca** exclui estoque — mais honesta quando o ativo é soja que precisa ser
  vendida (e cujo preço pode cair antes disso): (AC − estoques)/PC.
- **Dívida/EBITDA** é a métrica de covenant bancário: quantos anos de geração operacional
  seriam necessários para quitar a dívida. Na Granol: **1,59× → 1,09×** — alavancagem
  decrescente, espaço para financiar crescimento.

### 2.4 Margens, ROE e a decomposição de DuPont

Margens: bruta ($\frac{LB}{RL}$), EBITDA ($\frac{EBITDA}{RL}$) e líquida ($\frac{LL}{RL}$)
— respectivamente eficiência de produção, geração operacional de caixa e o que sobra de
cada real vendido.

O **ROE** engana quando lido sozinho: um ROE alto pode vir de margem boa **ou** de
alavancagem perigosa. A decomposição de **DuPont** separa as três fontes:

$$
ROE = \underbrace{\frac{LL}{RL}}_{\text{margem}} \times
\frac{RL}{\text{Ativo}}_{\text{giro}} \times
\frac{\text{Ativo}}{PL}_{\text{alavancagem}}
$$

Na Granol (2024): margem 7,1% × giro 1,22 × alavancagem 1,71 = **ROE 14,8%** — um ROE
"de qualidade": vem mais do giro (vende bem o ativo) do que de dívida.

O **ROIC** troca lucro contábil por **NOPAT** e PL por **capital investido**:

$$
ROIC = \frac{EBIT \times (1-t)}{\text{Dívida} + PL} \approx 12\text{-}13\%
$$

Como o denominador inclui a dívida, o ROIC é **neutro à estrutura de capital** — permite
comparar a Granol financiada em banco com um concorrente capitalizado pelos sócios. Regra
de leitura: se ROIC > WACC, a operação cria valor; se <, destrói.

### 2.5 FCFF e a ponte para o caixa

$$
FCFF = EBIT \times (1 - t) + D\&A - Capex - \Delta NCG
$$

Termo a termo, com a intuição do granoleiro:

- **EBIT×(1−t)**: o resultado operacional *como se a empresa não tivesse dívida* — o
  imposto é recalculado em cima do EBIT para neutralizar o escudo fiscal da dívida (que
  aparece, em contrapartida, no WACC). É o NOPAT.
- **+ D&A**: despesa contábil que não sai de caixa no período (a prensa foi paga no passado).
- **− Capex**: reinvestimento para manter e crescer. Capex < D&A sugere empresa "ordenhando"
  ativos; na Granol, Capex ≈ 1,15× D&A — cresce de verdade.
- **− ΔNCG**: a **Necessidade de Capital de Giro** = clientes + estoques − fornecedores.
  Soja estocada e 30 dias de prazo ao cliente são caixa preso no giro; fornecedor que
  financia devolve parte. Cada real **a mais** de NCG é real que não vira FCFF.

### 2.6 WACC, valor terminal e o valuation

O valor da empresa é a soma dos FCFF futuros descontados. A taxa — **WACC** (custo médio
ponderado de capital) — mistura o custo do dinheiro dos sócios ($k_E$) e do banco ($k_D$):

$$
k_E = r_f + \beta \cdot ERP, \qquad
WACC = w_E \cdot k_E + w_D \cdot k_D (1-t)
$$

Números da aula (set/2026): $r_f$ = Selic **13,9%** (a proxy de ativo sem risco no Brasil),
ERP = **6,0%**, $\beta$ = **0,9** → $k_E$ = **19,3%**. Dívida a **12%** pré-impostos
(escudo de 34% → 7,9% líquida). Estrutura **75% equity / 25% dívida** → **WACC ≈ 16,5%**.
Alta? Sim — é o custo de capital real de uma PME brasileira, onde a Selic de dois dígitos
empurra todas as taxas para cima.

Para além do horizonte explícito (3 anos), o **valor terminal de Gordon**:

$$
TV = \frac{FCFF_{T+1}}{WACC - g} = \frac{FCFF_T (1+g)}{WACC - g}, \qquad g < WACC
$$

com $g$ = crescimento perpetuo prudente (**3%**, abaixo do crescimento nominal projetado).
O terminal vale a pena de atenção: na Granol, ele concentra **~70% do valor** — motivo pelo
qual a tabela de sensibilidade não é enfeite, é obrigação.

**A sequência completa do valuation:**

1. Projetar FCFF 3 anos (receita +9% a.a., margens de 2025 estáveis);
2. $EV = \sum_{t=1}^{3} \frac{FCFF_t}{(1+WACC)^t} + \frac{TV}{(1+WACC)^3}$
   ≈ R$ 2,05 mi + R$ 4,89 mi = **R$ 6,94 mi**;
3. Subtrair a **dívida líquida** (dívida − caixa = R$ 1,15 mi) → **equity ≈ R$ 5,79 mi**.

## 3. Roteiro do notebook

`a14_valuation_dre_balanco.ipynb` — 39 células, kernel `oikos_py`, tudo construído no
notebook (nenhum CSV necessário).

| § | Seção | O que observar |
|---|---|---|
| — | Objetivos | da DRE em DataFrame ao equity de R$ 5,8 mi |
| setup | Célula padrão | trio + `brl()`; sem dados externos |
| 1 | DRE em DataFrame | contas brutas → cascata de linhas derivadas; LL 2023-25: 663 → 793 → 842 (R$ mil) |
| 2 | Vertical/horizontal | CMV em 62% da RL; LL cresce 19,6% em 2024 e 6,2% em 2025 — discutir por quê |
| 3 | Balanço | identidade A = P + PL confirmada (diferença 0,00 nos 3 anos) |
| 4 | Liquidez/endividamento | LC 1,78→1,96; dívida/EBITDA 1,59→1,09 (desalavancagem) |
| 5 | Margens | gráfico de tendência; margem líquida ~6,4-7,1% |
| 6 | DuPont e ROIC | margem × giro × alavancagem = ROE direto (prova); ROIC ~12-13% vs WACC 16,5% |
| 7 | FCFF | NCG 1.800 → 2.150; FCFF 2025 ≈ R$ 584 mil — lucro de 842 vira caixa de 584 |
| 8 | Valuation | WACC 16,5%; PV FCFF 2,05 mi + terminal 4,89 mi → EV 6,94 mi; equity 5,79 mi; sensibilidade WACC×g |
| 📝 | Exercícios (4) | margem EBITDA (E1); liquidez seca (E2); DuPont de 2024 (E3); sensibilidade a g (E4) |
| 📌 | Resumo & para casa | checklist de leitura financeira + referências da KB |

Sugestão de ritmo em 50 min: §§1-3 (15 min) → §§4-6 (12) → §7 (8) → §8 (10) → exercícios
(5, revisar E3 juntos).

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| `KeyError: 'ebitda'` | rodou o cálculo de indicadores antes de derivar as linhas da DRE | execute as células em ordem; a DRE derivada nasce na seção 1 |
| Balanço "não fecha" (diferença ≠ 0) | linha digitada errada em ativo ou passivo | confira cada conta; a prova dos nove existe para isso |
| `pct_change()` dá erro ou NaN inesperado | coluna não numérica / primeira linha sem anterior | é o esperado na 1ª linha; `.round(1)` para leitura |
| ROE via DuPont ≠ ROE direto | arredondamento ao exibir com `round()` | compare os valores completos; a identidade é exata |
| WACC "absurdo" (>25%) | esqueceu o `(1-t)` na dívida ou usou Selic como k_E | revise: k_E = rf + β·ERP; k_D entra líquida de imposto |
| `wacc - g` → divisão gigante ou negativa | g ≥ WACC no terminal de Gordon | g deve ficar bem abaixo do WACC (use 2-4%) |
| ΔNCG de 2023 = NaN | `diff()` não tem ano anterior | projetar a partir do último ano real (notebook usa `fillna` na projeção) |
| Valor do equity negativo | dívida líquida maior que EV | situação real de sobre-endividamento; confira sinal do caixa |

## 5. Glossário

| Termo (pt) | Termo (en) | Significado |
|---|---|---|
| DRE | income statement | demonstração do resultado do exercício (fluxo do ano) |
| Balanço patrimonial | balance sheet | fotografia de ativos e dívidas em uma data |
| CMV | COGS (cost of goods sold) | custo do que foi vendido (soja, óleo, farelo) |
| EBITDA | EBITDA | lucro antes de juros, impostos, depreciação e amortização |
| EBIT | operating income | resultado operacional |
| NOPAT | NOPAT | EBIT líquido de impostos (EBIT×(1−t)) |
| Análise vertical | common-size (vertical) | contas como % da receita do período |
| Análise horizontal | horizontal analysis | variação % das contas entre períodos |
| Liquidez corrente | current ratio | AC ÷ PC |
| Liquidez seca | quick ratio | (AC − estoques) ÷ PC |
| DuPont | DuPont decomposition | ROE = margem × giro × alavancagem |
| ROIC | return on invested capital | NOPAT ÷ capital investido (dívida + PL) |
| NCG | working capital requirement | clientes + estoques − fornecedores |
| Capex | capex | investimento em imobilizado |
| FCFF | free cash flow to the firm | caixa livre para todos os capitalistas |
| WACC | weighted average cost of capital | custo médio ponderado das fontes de capital |
| Prêmio de risco | equity risk premium (ERP) | retorno extra exigido acima do ativo sem risco |
| Beta | beta | sensibilidade do retorno da empresa ao mercado |
| Valor terminal | terminal value | valor perpetuo além do horizonte explícito (Gordon) |
| Dívida líquida | net debt | dívida total − caixa |
| Valor da empresa | enterprise value (EV) | VP dos FCFF; equity = EV − dívida líquida |

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/13_chapter-11-financial-and-economic-data-applications.md` —
  McKinney, Cap. 11: dados financeiros e econômicos em pandas — pct_change, agregações por
  período e a mecânica de tabelas que a DRE usa.
- `kb/03_jansen_ml_for_algorithmic_trading/11_chapter-5-portfolio-optimization-and-performance-evaluation.md` —
  Jansen, Cap. 5: retorno, risco e métricas de desempenho — o contexto de taxa de desconto,
  CAPM e comparação de retornos que sustenta o WACC da seção 8.
- Livro-texto de contabilidade gerencial para a base conceitual de DRE/Balanço (qualquer
  edição recente serve — as estruturas são padronizadas por lei societária).

## 7. Gabarito comentado

**E1 — Margem EBITDA 2023-2025.** `dre["ebitda"] / dre["receita_liquida"]`: **16,0% →
16,1% → 16,2%**. Estável com leve subida. Leitura: os custos crescem no mesmo ritmo da
receita — gestão de margem madura, **sem alavancagem operacional agressiva** (não há
custo fixo grande sendo diluído pelo crescimento). É o perfil esperado de esmagamento:
negócio de volume, não de escala tecnológica.

**E2 — Liquidez seca.** `(AC − estoques)/PC`: **1,02 → 1,07 → 1,12**, contra a corrente
de 1,78 → 1,87 → 1,96. A seca é **bem menor** (metade do valor): boa parte do ativo
circulante é **estoque de soja**. Implicação prática: a liquidez da Granol depende de
transformar grão em caixa no prazo — risco de preço da commodity e de inadimplência de
clientes merecem monitoração; banco avaliando crédito olharia a seca, não a corrente.

**E3 — DuPont de 2024.** Margem 7,1% × giro 1,218 × alavancagem 1,713 = **14,8%**, batendo
com o ROE direto (793/5.370 = 14,8%). A maior alavanca é o **giro** (1,22): a Granol
fatura 1,22× seu ativo a cada ano — perfil de trading/esmagamento, ativo girando rápido
com margem fina. A alavancagem (1,71) é moderada e a margem (7,1%) é a típica do setor.
Receita de leitura: ROE decente construído mais em **eficiência de ativo** que em dívida —
o melhor dos mundos quando ROIC (12,7% em 2024) ainda está abaixo do WACC (16,5%),
sinalizando que há trabalho a fazer em margem ou mix de produtos.

**E4 — Sensibilidade ao crescimento perpetuo.** Com g = 2%: TV = 8.251 vs 12.735 (g = 3%);
EV cai de **R$ 6,94 mi para R$ 6,56 mi** — uma queda de **5,5%** por apenas 1 p.p. de g.
E se o WACC subir para 18% (g = 3%), o EV desaba para ~R$ 5,5 mi (−20%). Moral da aula:
quando o terminal concentra ~70% do valor, **g e WACC são as hipóteses que decidem o
resultado** — relatório de valuation sem tabela de sensibilidade é opinião, não análise.

---

*Valores sintéticos calibrados com margens plausíveis do setor de esmagamento; o propósito
é didático — a cadeia DRE → FCFF → WACC → valuation é a mesma de um caso real.*