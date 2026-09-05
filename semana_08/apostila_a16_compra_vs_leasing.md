# Apostila Aula 16 — Comprar vs Leasing: o VPL do lado do custo
> Curso Python para Economistas — OIKOS/UEG · Semana 8

## 1. Por que isso importa (intuição econômica)

A decisão **comprar × financiar × alugar** é o pão e a manteiga da consultoria de
pequenas empresas — e o cemitério das decisões amadoras. O diretor da transportadora
de grãos de Morrinhos recebe três propostas para o mesmo caminhão-caçamba de R$ 1,2
milhão e ouve de cada vendedor: "a minha é a mais barata". Um compara parcela
(R$ 25.837,68 do financiamento vs R$ 35.000 do leasing), outro compara total nominal
(R$ 1,48 mi do financiamento vs R$ 1,2 mi à vista), outro fala de "custo zero de
entrada". Nenhuma dessas comparações responde à pergunta certa: **qual caminho deixa a
empresa com mais caixa em valor de hoje, depois de impostos?**

A resposta exige as duas aulas anteriores juntas: o VPL da Aula 15 aplicado ao lado
do **custo**, e o escudo fiscal — o desconto que o IRPJ+CSLL de 34% dá sobre todo gasto
dedutível. Depreciação, juros do financiamento e parcela de leasing são custos que
reduzem lucro tributável; cada real gasto dedutível devolve R$ 0,34 de imposto. Como
os três caminhos dedutibilizam **valores e datas diferentes**, os escudos têm valores
presentes diferentes — e é isso, não a "taxa do banco", que decide a disputa.

Há um segundo conceito que a aula consagra: quando os caminhos entregam **o mesmo
serviço** (um caminhão rodando), as receitas cancelam dos dois lados e a decisão vira
**minimizar o VPL de custo**. E quando os prazos são diferentes entre si, anualizamos
pelo **CAE** — custo anual equivalente — que converte cada VPL em uma "aluguel anual"
comparável. Dominar esses dois movimentos (custo em VPL; horizonte em CAE) é o que
permite a um economista júnior da OIKOS defender uma recomendação diante de um
comitê que só olha parcela.

## 2. Teoria essencial

### 2.1 VPL de custos: a régua invertida

Quando os serviços são idênticos, comparamos só os desembolsos pós-imposto:

$$VPL\_custo = \sum_{t} \frac{Desembolso_t - Escudo_t}{(1+i)^t}$$

- $i$ = **WACC** = 13,9% a.a. (a mesma régua da Aula 15: Selic set/2026 13,9%, rf ≈ 11,9%,
  prêmio do agro 4,5 p.p., dívida pós-IR 9,9%);
- $Escudo_t$ = gasto dedutível × 34% (IRPJ + CSLL combinados);
- **critério**: menor VPL de custo vence.

⚠️ Um detalhe que separa o profissional do amador: **todas as parcelas se descontam no
WACC**, não na taxa do contrato. A taxa de 14% a.a. do financiamento é o preço do dinheiro
*para o banco* cobrar; a régua da empresa é o que o capital dela custa (WACC). Descontar
parcela à taxa de contrato mistura duas coisas diferentes e distorce o ranking.

### 2.2 Os escudos fiscais de cada caminho

| caminho | desembolsos | o que escuda (34%) |
|---|---|---|
| A — compra à vista | R$ 1,2 mi no ano 0 | depreciação linear R$ 120.000/ano, anos 1-10 |
| B — financiamento | entrada R$ 240.000 + 48 parcelas @14% a.a. | depreciação (anos 1-10) **+ só a parte de juros** de cada parcela |
| C — leasing operacional | 36 × R$ 35.000 + opção R$ 700 mil no mês 36 | parcela **integral** (ano 1-3) + depreciação do ano 4 ao 10 |

Três assimetrias que fazem toda a diferença:

1. **A compra escuda pouco e tarde**: só a depreciação, R$ 40.800/ano por 10 anos;
2. **O financiamento escuda no começo** (juros concentrados nos primeiros anos, quando
   o saldo é alto) e ainda tem a depreciação — é o caminho com mais escudo em valor de hoje;
3. **O leasing escuda a parcela inteira**, mas enquanto o ativo é do arrendador a
   locatária **não deprecia** — o escudo da depreciação só existe depois de exercer a opção.

### 2.3 Fator de anuidade e CAE

O **fator de anuidade** converte "R$ 1 por ano por $n$ anos" em valor presente:

$$AF(i, n) = \frac{1-(1+i)^{-n}}{i}$$

É a fórmula da parcela Price (Aula 15) lida de trás para frente: a mesma engrenagem
que calcula prestação também vale pacotes de escudos fiscais. O caminho contrário —
converter um VPL em "valor anual" — usa o **fator de recuperação de capital**:

$$CRF(i, n) = \frac{i}{1-(1+i)^{-n}} = \frac{1}{AF(i,n)} \qquad CAE = VPL \times CRF$$

O **CAE** (custo anual equivalente) responde: quanto custa essa decisão por ano, em
valor constante? É a forma justa de comparar alternativas com horizontes diferentes —
36 meses de leasing vs 48 de financiamento vs à vista de uma vez. No caso da aula,
estramos o leasing a 10 anos via opção de compra, então VPL direto já é justo; o CAE
fica como ferramenta para os casos em que os prazos divergem.

### 2.4 Os três cenários, fechados

**A — compra à vista**: $VPL_A = 1{.}200.000 - 40.800 \times AF(13{,}9\%, 10)$ →
o escudo total vale R$ 213.650,69 em valor de hoje → **VPL de custo = R$ 986.349,31**.

**B — financiamento**: entrada R$ 240 mil + PV de 48 parcelas a R$ 25.837,68 descontadas
**no WACC mensal** ($i_m = (1{,}139)^{1/12}-1 = 1{,}0905\%$) + escudo dos juros anuais
(anos 1-4) + escudo da depreciação (anos 1-10):

$$VPL_B = 240.000 + 25.837{,}68 \cdot AF(1{,}0905\%, 48) - PV(esc_juros) - PV(esc_dep)$$
→ **VPL de custo = R$ 913.371,25**.

**C — leasing**: PV de 36 parcelas + PV da opção (mês 36) − escudo integral das parcelas
− depreciação dos anos 4-10 → **VPL de custo = R$ 1.089.185,54**.

### 2.5 Por que financiar vence — a lógica do custo da dívida pós-imposto

A 14% a.a. de contrato, o juro **pós-imposto** é $14\% \times (1-0{,}34) = 9{,}24\%$ a.a. —
**abaixo do WACC de 13,9%**. Quando a dívida custa menos que o capital próprio, alavancar
é mais barato que usar caixa próprio: o banco empresta barato, o imposto paga parte dos
juros, e o caixa da empresa continua investido no negócio. A compra à vista, por outro
lado, queima caixa que rendia WACC. É a mesma lógica do VPL: dinheiros em datas e
estados diferentes não são iguais.

**Break-even da taxa de contrato**: a taxa em que o financiamento empata com a compra
à vista. No caso: **≈ 21% a.a.** (pós-IR ≈ 13,9% — quando a dívida pós-imposto custa
exatamente o WACC, tanto faz). Abaixo de 21%, financia; acima, compra à vista. Essa é
a régua que o relatório mostra: não "o juro do mês", mas *a que preço do crédito a
decisão inverte*.

### 2.6 Break-even da parcela do leasing

A mesma bisseção da Aula 15, agora sobre a parcela: a que valor mensal o leasing
empata com a compra à vista? No caso: **R$ 29.743,61/mês** (com opção de R$ 700 mil).
O contrato real (R$ 35.000) está R$ 5.256 acima do empate — essa é a "margem de
negociação" que a consultoria leva para a mesa com o arrendador.

## 3. Roteiro do notebook (`a16_compra_vs_leasing.ipynb`)

| Seção | O que faz | O que observar |
|---|---|---|
| Setup | imports + `brl()` | padrão de todas as aulas |
| 1. Três portas para o mesmo caminhão | o caso e as três propostas | parcela ≠ custo; imposto decide |
| 2. O método | VPL de custos + regras fiscais | desconta tudo no WACC |
| 3. Cenário A | compra à vista + AF dos escudos | R$ 986.349,31 (menos que o preço!) |
| 4. Cenário B | entrada + 48× + escudo de juros | separa juros de amortização; R$ 913.371,25 |
| 5. Cenário C | leasing 36× + opção + escudo integral | R$ 1.089.185,54; sem depreciação nos anos 1-3 |
| 6. Comparativo + gráfico | DataFrame-resumo, curvas × WACC, break-even da taxa | B < A < C; break-even ≈ 21% |
| 7. CAE | anualização no horizonte de 10 anos | A 188.359 | B 174.423 | C 207.997 |
| 📝 Exercícios | 4 casos com solução | leasing melhorado, opção cara, banco rival, break-even da parcela |

Rodando em casa: `jupyter lab` dentro de `semana_08/`, kernel **Python (oikos_py)**,
execução de cima a baixo. Tudo offline — só `numpy`, `pandas` e `matplotlib`.

## 4. Erros comuns e diagnóstico

| erro | causa provável | correção |
|---|---|---|
| "o financiamento custa R$ 1,48 mi, mais caro!" | comparou total nominal | nominais ignoram tempo e imposto; só VPL decide |
| VPL do financiamento errado (mais caro que à vista) | descontou parcelas a 14% (taxa de contrato) | desconte no **WACC mensal** (1,0905% a.m.) |
| escudo fiscal somido | usou a parcela inteira do financiamento | só a parte de **juros** dedutível; amortização não escuda |
| escudo da depreciação no leasing desde o ano 1 | esqueceu quem é dono do ativo | depreciação só do ano 4 ao 10 (após exercer a opção) |
| `KeyError: 4` em `juros_por_ano.loc[4]` | DataFrame tem anos 1-4 | o financiamento termina no ano 4; anos 5+ têm só depreciação |
| break-even "não converge" | função sem troca de sinal no intervalo | bisseção exige `f(lo)·f(hi) < 0`; amplie o intervalo |
| CAE com CRF do horizonte errado | usou n=48 meses para anualizar custo de 10 anos | CRF sempre no **horizonte-padrão** (10 anos = 120 meses) |
| opção de compra descontada a 13,9% a.m. | confundiu anual com mensal | opção no mês 36: divida por `(1+i_m)**36`, $i_m$ = mensal |
| parcela Price do exercício 3 errada | recalculou sobre R$ 960 mil | sobre o **saldo devedor** do mês 36, não sobre o principal |
| "leasing sempre mais caro" | generalizou o caso | com parcela ≤ R$ 29.743, o leasing vence — teste no Ex. 4 |

## 5. Glossário

| termo (pt) | termo (en) | definição curta |
|---|---|---|
| capex | capex | investimento inicial em ativo imobilizado |
| depreciação linear | straight-line depreciation | custo do ativo distribuído igualmente pela vida útil |
| escudo fiscal | tax shield | economia de IRPJ/CSLL sobre custo dedutível (34% aqui) |
| IRPJ/CSLL | corporate income tax | imposto sobre lucro; alíquota combinada 34% |
| dedutibilidade | deductibility | custo que reduz a base de cálculo do imposto |
| leasing operacional | operating lease | aluguel do ativo com opção de compra no fim |
| opção de compra | purchase option | valor residual pactuado para adquirir o ativo ao fim do lease |
| entrada | down payment | parcela do preço paga no ato |
| VPL de custo | cost NPV | valor presente líquido dos desembolsos pós-imposto |
| CAE / custo anual equivalente | EAC | VPL anualizado pelo CRF no horizonte-padrão |
| fator de recuperação de capital | capital recovery factor | $i/(1-(1+i)^{-n})$: converte VP em anuidade |
| WACC | WACC | custo médio ponderado do capital da empresa |
| custo da dívida pós-imposto | after-tax cost of debt | $k_d(1-IR)$: juros dedutíveis barateiam o crédito |
| break-even | break-even | ponto de empate entre duas alternativas |
| fluxo de caixa pós-imposto | after-tax cash flow | caixa depois de impostos e escudos |
| custo de oportunidade | opportunity cost | rendimento que se abre mão ao usar o caixa próprio |

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/13_chapter-11-financial-and-economic-data-applications.md`
  — McKinney, *Python for Data Analysis* (2012), cap. 11: aplicações financeiras e
  econômicas com pandas — o ferramental das tabelas e resumos do notebook.
- `kb/03_jansen_ml_for_algorithmic_trading/11_chapter-5-portfolio-optimization-and-performance-evaluation.md`
  — Jansen, *ML for Algorithmic Trading* (2ª ed.), cap. 5: taxa livre de risco e
  métricas de avaliação — a base conceitual do WACC usado como taxa de desconto.
- Material complementar da disciplina de contabilidade e tributação para o regime de
  dedutibilidade de juros e leasing (Lei nº 6.404/76 e RTT) — a aula usa as regras
  simplificadas da consultoria.

## 7. Gabarito comentado

### Exercício 1 — O leasing que o vendedor "melhora"

Mesmo prazo (36 meses), mesma opção (R$ 700 mil), parcela cortada para R$ 32.000:

```python
pv_parc_ex = 32_000 * af(i_wacc_m, 36)
vpl_C_ex   = pv_parc_ex + pv_opcao_ex - esc_ex - esc_dep_ex
```

**Resposta**: VPL de custo = **R$ 1.030.493,38** — continua em 3º lugar, atrás de B
(R$ 913.371,25) e A (R$ 986.349,31). O corte melhora o leasing em ~R$ 58.692 de VPL
mas não fecha a diferença de ~R$ 44 mil para a compra à vista. **Lição**: "parcela
menor" vence o argumento emocional do comitê, não o VPL — mostre a tabela-resumo.

### Exercício 2 — A opção de compra que assusta

Opção de R$ 800.000 (antes R$ 700.000), parcela R$ 35.000:

```python
pv_opcao_n = 800_000 / (1 + i_wacc_m) ** 36
vpl_C_n    = pv_parcelas_C + pv_opcao_n - esc_leas - pv_esc_dep_C
```

**Resposta**: VPL de custo = **R$ 1.156.860,63** — piora de **R$ 67.675,09** em valor
de hoje. O leasing fica ainda mais distante; e a lição de negociação é clara: no VPL
do leasing, a **opção** pesa quase tanto quanto as parcelas (R$ 473.725,61 → R$ 541.400,70
de PV). Opção cara = arrendador embutindo juros no fim do contrato — negocie a opção,
não só a mensalidade.

### Exercício 3 — O banco rival

Mesma estrutura (entrada 20%, 48×), taxa de contrato **16% a.a.**:

```python
i_16       = (1.16) ** (1/12) - 1          # 1,2445% a.m.
parcela_16 = pmt_price(fin_pv, i_16, 48)   # R$ 26.685,49
# escudos recalculados sobre os novos juros anuais
vpl_B_16   = entrada + parcela_16 * af(i_wacc_m, 48) - esc_j_16 - esc_d_16
```

**Resposta**: VPL de custo = **R$ 934.168,99** (antes R$ 913.371,25 a 14%). O
financiamento **ainda vence** a compra à vista (A = R$ 986.349,31), mas a vantagem
encolhe de R$ 72.978 para **R$ 52.180**. Note o efeito fiscal: juros maiores → escudo
dos juros maior (R$ 99.069 vs R$ 95.271 nominais) — mas as parcelas mais caras pesam
mais que o escudo extra. O break-even está em ~21% a.a.; a 16%, ainda há folga.

### Exercício 4 — O break-even da parcela do leasing

Bisseção sobre a parcela (mesmo esqueleto do break-even da taxa):

```python
def vpl_custo_leas(p_):
    return p_ * af(i_wacc_m, 36) + opcao / (1 + i_wacc_m) ** 36 \
           - 0.34 * p_ * af(i_wacc_m, 36) \
           - sum(0.34 * dep_anual / (1 + t) ** a for a in range(4, 11))

lo_p, hi_p = 20_000, 50_000
for _ in range(200):
    mid_p = (lo_p + hi_p) / 2
    if vpl_custo_leas(mid_p) - vpl_A > 0: hi_p = mid_p
    else: lo_p = mid_p
be_parcela = (lo_p + hi_p) / 2
```

**Resposta**: **R$ 29.743,61/mês** (com opção de R$ 700 mil no mês 36). Abaixo disso,
o leasing vence a compra à vista; o contrato atual (R$ 35.000) está R$ 5.256,39/mês
acima do empate. Na mesa com o arrendador, esse número é o alvo da negociação — se
ele não descer até lá, o cliente assina o financiamento a 14% e o laudo explica por quê.

---

*Próxima semana (17): séries temporais financeiras — IPCA, Selic e câmbio como séries
de dados, não como números estáticos.*