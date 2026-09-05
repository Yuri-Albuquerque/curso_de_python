# Apostila Aula 18 — Commodities do agro: conversões, futuro teórico e hedge

> Curso Python para Economistas — OIKOS/UEG · Semana 9 · Aula 18 (50 min)

## 1. Por que isso importa (intuição econômica)

O produtor de **Rio Verde** ou **Jataí** vende a soja duas vezes. Vende
fisicamente, na praça, em **reais por saca de 60 kg**. E vende no papel, todos
os dias, quando o preço internacional da CBOT (Chicago) é cotado em **dólares
por bushel** — porque é dele que o comprador parte para fazer a oferta. Entre
as duas cotações há duas conversões (unidade e moeda) e três
atritos (frete, qualidade, sazonalidade). Entender essa ponte é o trabalho
cotidiano de quem faz análise agro no Centro-Oeste.

A escala do negócio explica a urgência. Goiás colhe na casa de **dezenas de
milhões de sacas por safra**; Rio Verde e Jataí estão entre os maiores municípios
produtores de soja do país — cada centavo por saca movimenta milhões de reais na
receita do município. Um analista que erra a conversão de bushel para saca erra
a oferta que faz; um produtor que não entende o hedge troca preço por sorte sem
querer.

A aula percorre essa ponte em quatro passos. Primeiro, as **conversões**: bushel
→ saca, libra → arroba, dólar → real, com o câmbio do dia. Segundo, o **preço
futuro teórico**: por que a soja de dezembro não custa o mesmo que a de hoje —
o custo de carregar o produto no tempo. Terceiro, a **base**: a diferença entre
o preço local e o futuro convertido, onde moram frete e qualidade. Quarto, o
**hedge**: como o produtor trava a receita vendendo futuro antes da colheita.

Todos os cálculos são feitos com séries reais (CBOT, CME, PTAX do BCB) usando
as ferramentas da Aula 17: índice de datas, `reindex` com `ffill`, `resample`.
A economia dá o número; a aula anterior deu a máquina.

## 2. Teoria essencial

### 2.1 Conversões de unidade e moeda

As cotações internacionais chegam em unidades que ninguém usa na roça:

| commodity | unidade internacional | unidade local | fator |
|---|---|---|---|
| soja | US$/bushel (1 bu = 27,216 kg) | R$/saca de 60 kg | 60/27,216 = 2,2046 bu/sc |
| milho | US$/bushel (1 bu = 25,401 kg) | R$/saca de 60 kg | 60/25,401 = 2,3622 bu/sc |
| boi gordo | US$/libra (lb) | R$/arroba (15 kg carcaça) | 33,069 lb/@ |

As fórmulas (a moeda entra multiplicando pelo câmbio do dia):

$$P_{\text{sc}} = P_{\text{bu}} \times \frac{60}{27{,}216} \times \text{câmbio}$$

$$P_{@} = P_{\text{lb}} \times 33{,}069 \times \text{câmbio}$$

Exemplo com os números de fechamento da aula (04/set/2026): soja a
US$ 12,94/bu e câmbio a R$ 5,1253 →
$12{,}94 \times 2{,}2046 \times 5{,}1253 \approx R\ \$ 146{,}18$/sc. A mesma
linha, vetorizada, converte 2.514 dias de história de uma vez:

```python
CAMBIO = usd.reindex(soja.index, method="ffill")   # câmbio do último dia útil anterior
soja_rsc = soja / 100 * fator_sc * CAMBIO
```

O `reindex(method="ffill")` resolve um detalhe real: CBOT e PTAX têm calendários
diferentes (feriados americanos vs brasileiros). Preencher o câmbio com o último
valor conhecido evita `NaN` na conversão.

### 2.2 Preço futuro teórico (cost-of-carry)

Por que o futuro de dezembro difere do spot? Porque **carregar a commodity custa**:
quem guarda soja deixa de render Selic ($r$), paga armazenagem e seguro ($c$) e
recebe o aluguel/conveniência do produto ($y$). A arbitragem comprime tudo na
fórmula do *cost-of-carry*:

$$F = S \cdot e^{(r + c - y)\,T}$$

com $S$ = spot, $T$ = prazo em anos. No Brasil, o termo dominante é a Selic:
com $r = 13{,}9\%$ a.a. (set/2026), carregar soja por 3 meses embute ~3,4% de
juro. A versão do notebook (juros simples, sem $c$ e $y$) é suficiente para a
ordem de grandeza:

$$F \approx S\,(1 + rT)$$

Com $S \approx 146{,}18$ R$/sc e $T = 0{,}25$: $F \approx 146{,}18 \times
(1 + 0{,}139 \times 0{,}25) \approx 151{,}26$ R$/sc. A diferença entre esse $F$
teórico e o futuro real convertido abre a discussão da base.

### 2.3 Base: spot local − futuro

$$\text{base} = S_{\text{local}} - F$$

A base mede o quanto o mercado físico local se afasta do futuro convertido:

- **Negativa** (o caso brasileiro típico): o local paga menos que o futuro —
  frete Rio Verde → porto, custos de logística, desconto de qualidade;
- **Positiva**: escassez local ou prêmio (soja não-transgênica, compra
  antecipada agressiva das tradings);
- **Sazonal**: na safra (oferta máxima, fev–abr), a base tende a afundar;
  na entressafra, a base recupera.

No notebook usamos um spot **fictício** de Rio Verde (R$ 138,0/sc) para não
sugerir dado oficial: spot 138,0 − futuro convertido 146,18 = **base de
−8,18 R$/sc** (−5,6% do futuro). A leitura importa mais que o número: a base é
o termo que o produtor negocia — o futuro ele só acompanha.

### 2.4 Hedge do produtor

O produtor planta em outubro e colhe em fevereiro. Entre as datas, o preço pode
derreter. O hedge clássico: **vender futuro hoje** (compromisso pelo preço
$F_0$) e desmontar a posição na colheita, vendendo o físico pelo spot $S_t$.
Por saca, o resultado:

$$\text{resultado} = S_t + (F_0 - F_t)$$

A leitura é simétrica:

| cenário na colheita | físico | hedge | receita |
|---|---|---|---|
| preço sobe ($F_t > F_0$) | ganha no spot | perde no futuro ($F_0 - F_t < 0$) | ~$F_0$ |
| preço cai ($F_t < F_0$) | perde no spot | ganha no futuro ($F_0 - F_t > 0$) | ~$F_0$ |

O hedge não enriquece: **trava** a receita perto de $F_0$ convertido. No
exemplo do notebook (venda 14/ago, colheita 04/set/2026), a receita sem hedge
seria R$ 157,9/sc; com hedge, R$ 146,9/sc — perto do $F_0$ de R$ 135,2/sc
(a diferença é a variação da base no período, quando ela não é constante). É
**seguro, não aposta**: troca-se a chance de ganho inesperado pela
previsibilidade que o caixa e o banco exigem.

### 2.5 O que o hedge não resolve: risco de base e ajuste diário

Duas ressalvas separam o hedge de livro do hedge de balcão:

- **Risco de base.** O resultado $S_t + (F_0 - F_t)$ só fecha exatamente em
  $F_0$ se a base for constante. No mundo real, a base oscila (safra cheia no
  interior vs. porto exportando) — o produtor que faz hedge de preço ainda
  carrega o **risco de base**. O "para casa" do notebook simula uma base que
  melhora R$ 3/sc: o resultado deixa de ser exatamente $F_0$;
- **Ajuste diário (mark-to-market).** A bolsa liquida perdas e ganhos do futuro
  **todo dia** na conta de garantia. Se a soja sobe muito entre a venda e a
  colheita, o produtor tem que **aportar margem** no meio do caminho — mesmo
  sabendo que o hedge compensará no fim. Caixa para margem é parte do plano de
  hedge; sem ele, a posição pode ser encerrada à força no pior momento.

Uma terceira ressalva é contábil: o contrato futuro da CBOT é em US$/bu para
um vencimento específico (dez, mar, mai…). O "futuro convertido" do notebook
usa o contrato mais líquido como proxy do vencimento próximo — aproximação
padrão em análise, desde que declarada.

### 2.6 Da conversão à decisão: a ponte com a Aula 19

A aula termina onde o curso continua. Com preço local observado (ou simulado),
câmbio e preço internacional alinhados por data, a pergunta seguinte é
**estatística**: quanto do preço de Rio Verde o câmbio explica? E o futuro de
Chicago? A Aula 19 (regressão com scikit-learn) usa exatamente as séries
convertidas desta aula como variáveis explicativas — a base vira resíduo, e o
$R^2$ vira resposta.

## 3. Roteiro do notebook (`a18_commodities_agro_futuros.ipynb`)

| Seção | O que ver | O que observar |
|---|---|---|
| 1. Duas moedas | contexto Rio Verde/Jataí; carga das 4 séries | câmbio ≈ 5,12; soja ≈ US$ 12,9/bu |
| 2. Conversões | `reindex(ffill)`, fator 60/27,216; milho e boi | soja ≈ R$ 146,2/sc; boi ≈ R$ 361/@ |
| 2.1 Duelo de 2025 | soja convertida vs câmbio (2 painéis) | quem venceu: preço internacional ou dólar? |
| 3. Futuro teórico | $F \approx S(1+rT)$ com Selic 13,9% | carry de 3m ≈ +3,4% sobre o spot |
| 4. Base | spot fictício Rio Verde − futuro convertido | base ≈ −8,2 R$/sc: frete/qualidade |
| 5. Hedge | $S_t + (F_0 - F_t)$; cenários −10%…+10% | receita com hedge fica plana em $F_0$ |
| 6. Exercícios | 4 exercícios | faça antes de olhar `# SOLUÇÃO` |
| 7. Resumo | recap + referências KB | — |

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| Conversão dá ~66 R$/sc na soja | usou fator do milho (25,401) | soja: 27,216 kg/bu → fator 60/27,216 |
| `NaN` na série convertida | calendários CBOT × PTAX diferentes | `usd.reindex(soja.index, method="ffill")` |
| Preço 100× maior que o esperado | esqueceu `/ 100` (CBOT cota centavos/bu) | `soja / 100` antes de multiplicar |
| Boi em arroba 10× errado | confundiu kg com lb (2,20462 lb/kg) | 1 @ = 33,069 lb: `boi / 100 * 33.069 * câmbio` |
| $F$ teórico muito acima do futuro real | usou $T$ em meses (3) em vez de anos (0,25) | $T$ sempre em fração de ano |
| Hedge "perde sempre" | comparou $S_t$ com $F_0$ sem converter datas | mesmo padrão de conversão nos dois lados |
| Base positiva "impossível" | spot fictício inconsistente com o câmbio do dia | usar o câmbio da **mesma data** do spot |
| `KeyError: '2026-08-14'` | data sem negociação (fim de semana/feriado) | escolher dia útil ou `asof`/`ffill` |
| `soja_rsc` "sobrescrito" sem querer | reusar o nome para outra commodity | nomes separados: `soja_rsc`, `milho_rsc`, `boi_ra` |
| Média mensal esquisita em meses incompletos | misturou dias com e sem negociação | `dropna()` após o alinhamento de calendários |
| Conversão do boi com fator da soja | copiou `fator_sc` para todas | boi não usa bushel: fator é 33,069 lb/@ |

## 5. Glossário

| Termo (en) | Em português | Significado |
|---|---|---|
| commodity | commodity | bem padronizado negociado em bolsa (soja, milho, boi) |
| bushel (bu) | bushel | unidade de volume; soja 27,216 kg, milho 25,401 kg |
| sack (sc) | saca | 60 kg — unidade do mercado físico brasileiro |
| arroba (@) | arroba | 15 kg de carcaça = 33,069 lb |
| spot | preço à vista | preço do mercado físico, entrega imediata |
| futures | futuro | contrato padronizado de compra/venda a preço de hoje, entrega futura |
| cost-of-carry | custo de carregamento | juros + armazenagem − conveniência, embutidos em $F$ |
| basis | base | spot local − futuro; frete, qualidade e sazonalidade |
| hedge | hedge/cobertura | posição oposta no futuro para travar a receita |
| mark-to-market | ajuste diário | atualização diária de perdas/ganhos no futuro |
| yield (convenience) | rendimento de conveniência | benefício de manter o estoque físico ($y$) |
| margin call | chamada de margem | aporte de caixa exigido quando a posição futura acumula perda |
| carry | carregamento | juro + armazenagem embutidos na diferença spot × futuro |
| `reindex(..., method='ffill')` | realinhar séries | alinhar calendários preenchendo o último valor |

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/12_chapter-10-time-series.md`
  — McKinney, Cap. 10 *Time Series*: a mecânica das séries (alinhamento,
  `reindex`/`ffill`, `resample`) usada nas conversões.
- `kb/03_jansen_ml_for_algorithmic_trading/07_chapter-1-machine-learning-for-trading-from-idea-to-executio.md`
  — Jansen, Cap. 1: mercados, instrumentos (futuros) e a lógica de
  hedge/alavancagem — do dado à decisão.
- `kb/03_jansen_ml_for_algorithmic_trading/08_chapter-2-market-and-fundamental-data-sources-and-techniques.md`
  — Jansen, Cap. 2: fontes de dados de mercado e fundamentalistas; como futuros
  e commodities são cotados (unidades, ajustes, calendários).

## 7. Gabarito comentado

**E1 — Milho convertido para saca.** Fator 60/25,401 (1 bu de milho = 25,401 kg)
e câmbio alinhado por data:

```python
fator_milho = 60 / 25.401
CAMBIO_m = usd.reindex(milho.index, method="ffill")
milho_rsc = milho / 100 * fator_milho * CAMBIO_m

print("milho hoje:", brl(milho_rsc.iloc[-1]), "/sc de 60 kg")

mensal = milho_rsc.loc['2026'].resample('ME').mean()
print("mês mais caro de 2026:", mensal.idxmax().strftime('%b/%Y'),
      "—", brl(mensal.max()))
```

O milho fecha perto de **R$ 62/sc** (US$ 5,12/bu × 2,3622 × 5,1253). O mês mais
caro de 2026 combina preço internacional e câmbio do período — repare que a
média mensal (`resample('ME').mean()`) suaviza picos diários; para ver o pico
real do mês, use `.max()` em vez de `.mean()`.

**E2 — O boi em arroba.**

```python
CAMBIO_b = usd.reindex(boi.index, method="ffill")
boi_ra = boi / 100 * 33.069 * CAMBIO_b

print("boi hoje:", brl(boi_ra.iloc[-1]), "/arroba")

ret_2026 = (1 + boi.pct_change().loc['2026']).cumprod() - 1
print(f"variação do boi (US$) em 2026: {100 * ret_2026.iloc[-1]:+.1f}%")

ret_cam = (1 + usd.pct_change().loc['2026']).cumprod() - 1
print(f"variação do câmbio em 2026   : {100 * ret_cam.iloc[-1]:+.1f}%")
```

O boi fecha perto de **R$ 361/@** (US$ 2,13/lb × 33,069 × 5,1253). Em 2026 o
preço internacional subiu enquanto o câmbio **caiu** (−5,7% no ano, o dólar de
5,44 para 5,13) — as duas forças se disputam na receita em reais. A pergunta
"c o que puxou?" se responde comparando os dois retornos: preço em dólar e
câmbio somam ou cancelam.

**E3 — Futuro teórico vs futuro real.**

```python
S_hoje = soja_rsc.iloc[-1]
F_teorico_ex = S_hoje * (1 + 0.139 * 0.25)

print(f"F teórico 3m  : {brl(F_teorico_ex)}/sc")
print(f"futuro CBOT   : {brl(soja_rsc.iloc[-1])}/sc")
print(f"base implícita: {brl(S_hoje - F_teorico_ex)}/sc")
print("base negativa típica do Centro-Oeste: frete Rio Verde→portos, qualidade, oferta local")
```

Com $S \approx 146{,}18$ R$/sc: $F \approx 151{,}26$ R$/sc. A diferença de
~−5,1 R$/sc é a base implícita (negativa), coerente com o exemplo da Seção 4:
frete até o porto e qualidade explicam o desconto local. Se a base estivesse
positiva em plena safra, desconfie do spot fictício — ou de um prêmio regional
real (oferta local apertada).

**E4 — Hedge com o milho (Jataí).**

```python
t0, t1 = '2026-08-14', '2026-09-04'
fator_m = 60 / 25.401

F0_m = milho.loc[t0] / 100 * fator_m * usd.loc[t0]
Ft_m = milho.loc[t1] / 100 * fator_m * usd.loc[t1]

S0_m = F0_m                                   # spot fictício = futuro convertido
St_m = milho.loc[t1] / 100 * fator_m * usd.loc[t1]

print(f"sem hedge: {brl(St_m)}/sc")
print(f"com hedge: {brl(St_m + (F0_m - Ft_m))}/sc ≈ F0 = {brl(F0_m)}")
print("hedge trava a receita: nem derrete, nem dispara — previsibilidade para o caixa")
```

O resultado com hedge recupera exatamente $F_0$ porque o spot fictício
acompanha o futuro (base constante). No mundo real, a base oscila — e é por
isso que o produtor não recebe exatamente $F_0$: recebe $F_0$ **mais a variação
da base**. Quem faz hedge de preço ainda tem risco de base (frete, estrada,
safra local) — o exercício "para casa" do notebook simula exatamente isso.

### Leituras que valem a conferência

**Sobre o E2 — o duelo de 2026.** O boi em dólar recuou no ano (−8,2%) e o
câmbio caiu −6,9% (de R$ 5,44 para R$ 5,13): as duas forças andaram **juntas
para baixo** na receita em reais — a combinação (produto) dos dois retornos
aproxima −14,5% no ano. Essa é a leitura que o gráfico do "duelo" da Seção 2.1
pede: o preço em reais não é o preço internacional nem o câmbio, é o **produto**
dos dois, e a resposta para "o que puxou o boi?" é sempre "quanto cada um
variou". A mesma decomposição vale para soja e milho.

**Sobre o E3 — a base implícita.** Comparar o futuro CBOT **convertido** com o
futuro teórico calculado sobre o próprio futuro convertido produz uma base
artificialmente pequena — o exercício funciona como checagem de consistência
(da ordem do carry de 3 meses, ~+3,4%), não como medida real de base. A base
**real** compara o futuro convertido com o preço físico da praça (Seção 4,
spot fictício de R$ 138/sc → base ≈ −8,2 R$/sc). São dois usos diferentes da
mesma subtração: um valida a fórmula, o outro mede o mercado local.

**Sobre o E4 — por que o hedge "recupera" exatamente $F_0$.** No simulador, o
spot de colheita é construído como o futuro convertido da mesma data — base
constante por construção. É o cenário limpo, que isola o mecanismo do hedge:
$S_t + (F_0 - F_t) = F_0$ quando $S_t - F_t$ é constante. A quebra dessa
identidade no mundo real (base variável) é o que o "para casa" explora — e é
também o que separa o hedge de preço do hedge completo (preço **e** base, este
último fora do escopo do curso).