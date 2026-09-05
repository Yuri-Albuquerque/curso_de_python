# Apostila Aula 17 — Séries temporais financeiras: o índice é o tempo

> Curso Python para Economistas — OIKOS/UEG · Semana 9 · Aula 17 (50 min)

## 1. Por que isso importa (intuição econômica)

Quase toda pergunta de trabalho de um economista tem uma data dentro dela. Não
"qual é a Selic?", mas "qual era a Selic **quando assinamos o contrato**?". Não
"quanto está o dólar?", mas "o câmbio **subiu quanto desde o ano passado** — e
o dia 4 de abril de 2025 foi normal?". A Aula 17 transforma essa intuição em
ferramenta: no pandas, uma tabela vira *série temporal* quando a data passa a
ser o **índice** do DataFrame.

A mudança é conceitual e prática ao mesmo tempo. Conceitual: nível não diz nada
sem o *quando* — o preço é uma função do tempo. Prática: com um `DatetimeIndex`,
fatiar a história (`df.loc['2025']`), calcular variações (`pct_change`),
suavizar (`rolling`) e agregar (`resample`) deixam de ser filtros manuais de
planilha e passam a ser uma linha de código cada.

Os dados da aula são os três preços que guiam o agro e as finanças goianas:
**Selic diária** (o custo do dinheiro), **câmbio PTAX** (o conversor de moedas)
e **soja CBOT** (o preço internacional que chega à saca de Rio Verde na Aula 18).
A aula termina com o `pd.bdate_range` — o calendário de dias úteis que organiza
cronogramas de coleta, pagamentos e vencimentos.

## 2. Teoria essencial

### 2.1 Datas: dois dialetos, uma regra

O pandas não adivinha datas; você declara o formato. Os dois dialetos do curso:

| fonte | formato | leitura |
|---|---|---|
| BCB (SGS) | `"02/01/2017"` → `%d/%m/%Y` | `pd.to_datetime(col, format="%d/%m/%Y", dayfirst=True)` |
| Yahoo Finance | `"2016-09-06"` → `%Y-%m-%d` | `pd.to_datetime(col, format="%Y-%m-%d")` |

O `dayfirst=True` existe porque `"02/03/2026"` é ambíguo: no padrão brasileiro
é 2 de março; no padrão americano, 3 de fevereiro. Deixar o pandas adivinhar é
a receita do gráfico errado — a série ordena "lexicograficamente" e o mês vira
ano. **Formato explícito, sempre.**

Depois de converter, a data sobe para o índice:

```python
df = df.set_index("data").sort_index()
```

O `sort_index` é obrigatório: série temporal sem ordem temporal não existe
(rolling, resample e pct_change assumem ordem crescente).

### 2.2 Indexação por data (string parcial)

Com `DatetimeIndex`, strings parciais fatiam a história:

```python
selic.loc['2025']          # o ano de 2025 inteiro
selic.loc['2025-04']       # abril de 2025
usd.loc['2025-04-04']      # um dia
usd.loc['2025-04-01':'2025-04-14']   # intervalo, inclusivo
```

O pandas expande a string para o intervalo completo de datas que casam. É a
versão em uma linha do "filtro de período" da planilha — e compõe com qualquer
operação da aula: `selic.loc['2025'].mean()`, `usd.loc['2025-04'].max()`.

### 2.3 De nível a movimento: shift, pct_change, cumsum

Preço **nível** quase não informa; **variação** informa. Três ferramentas:

| ferramenta | o que faz | equivalente |
|---|---|---|
| `shift(n)` | o valor de *n* dias atrás, na linha de hoje | `s.shift(1)` = ontem |
| `pct_change()` | variação percentual vs. linha anterior | `s / s.shift(1) - 1` |
| `(1+r).cumprod() - 1` | retorno acumulado (composto) | juros sobre juros |
| `r.cumsum()` | soma simples dos retornos | aproximação linear |

Exemplo real da aula (dólar, abril/2025): 03/abr R$ 5,6067 → 04/abr R$ 5,7777,
**+3,05%** em um dia (tarifaço dos EUA sobre o agro brasileiro); no dia
seguinte, −2,46%. No nível isso se perde; no `pct_change` salta aos olhos.

A diferença entre acumulado composto e soma simples é exatamente o **juros
sobre juros** da Aula 15: com 9 anos de dados diários, os dois métodos divergem
porque a composição amplifica. Em finanças, o composto é o correto; a soma
simples é didática.

### 2.4 rolling: a janela que desliza

`rolling(n).mean()` calcula, para cada ponto, a média dos *n* últimos dias — a
janela desliza um dia por vez. Convenções de mercado:

- **MM21** ≈ 1 mês de dias úteis → curto prazo;
- **MM252** ≈ 1 ano de dias úteis → referência anual.

As primeiras *n−1* linhas ficam `NaN`: a janela ainda não encheu. É
comportamento correto, não bug — e o `first_valid_index()` mostra onde a série
começa de verdade. O `rolling` também faz `std()`: a **volatilidade realizada**
em janela de 21 dias, anualizada com $\sqrt{252}$ (raiz do número de dias úteis
do ano), o padrão do mercado — e o ponto de entrada do Cap. 9 de Jansen.

Quando a MM21 cruza a MM252 para cima, o mercado fala em momentum de alta;
sinais assim são a matéria-prima de estratégias quantitativas (KB: Jansen,
Cap. 9). Nesta aula, usamos as médias como **suavizadores de tendência**.

### 2.5 resample: mudar a frequência

`resample` agrupa a série em períodos maiores (downsampling). No pandas 3.x:

| código | frequência | típico uso |
|---|---|---|
| `'ME'` | fim de mês | relatório mensal |
| `'YE'` | fim de ano | fechamento anual |

Os antigos `'M'` e `'Y'` foram aposentados — use sempre `'ME'`/`'YE'`.

Depois do resample, escolhe-se a agregação — e aqui há uma regra econômica:

- **Nível** (preço, câmbio, taxa): `.mean()` (média do período) ou `.last()`
  (fechamento do período);
- **Fluxo** (retorno, volume): `.sum()` — retorno mensal é a soma dos retornos
  diários (aproximação; o composto exato é `(1+r).resample('ME').apply(prod)-1`,
  fora do escopo).

A célula do notebook que faz `resample('ME').agg(['mean','last','min','max'])`
produz a tabela de resumo que o relatório mensal do OIKOS consome.

### 2.7 O índice de datas é também um calendário

Além de fatiar, o `DatetimeIndex` expõe **propriedades de calendário** — atributos
que respondem perguntas de agenda sem laço algum:

```python
usd.index.year        # ano de cada observação (array)
usd.index.month       # mês (1-12)
usd.index.weekday     # dia da semana: segunda=0 … domingo=6
usd.index.day_name()  # 'Monday', 'Tuesday'… (em inglês, padrão da biblioteca)
```

Duas combinações que o analista usa toda semana:

- **Filtrar por dia da semana**: `usd.loc['2025'][usd.loc['2025'].index.weekday == 4]`
  devolve todas as sextas-feiras de 2025 (coleta semanal de preço);
- **Contar por período**: `usd.loc['2025'].index.month.value_counts().sort_index()`
  mostra quantos dias úteis cada mês aportou — útil para conferir se o dado está
  completo (fevereiro sempre tem menos; se tiver mais, algo está errado).

O `weekday` é o mesmo número que o `bdate_range` usa: segunda=0 … sexta=4. O
Exercício 4 usa exatamente isso (`weekday == 3` para quintas).

### 2.8 Volatilidade realizada: da janela ao número anual

O `rolling(21).std()` dos retornos diários dá a **volatilidade realizada
mensal** — mas volatilidade se compara em base **anual**. A convenção do mercado
multiplica pelo $\sqrt{252}$ (raiz do número de dias úteis do ano):

$$\sigma_{\text{anual}} = \sigma_{\text{diária}} \times \sqrt{252}$$

O $\sqrt{252}$ não é mágica: se os retornos diários são independentes, a
**variância** de um ano é a soma de 252 variâncias diárias — e desvio-padrão é
raiz de variância. Multiplicar por 252 (sem a raiz) inflaria o número ~15 vezes.

Com o dado da aula, a volatilidade anualizada recente do câmbio fica em torno de
**7,5%** — um valor baixo para câmbio de exportador de commodities, e muito menor
que o de uma ação típica brasileira (30–40%). É essa comparação de magnitudes que
torna o número útil: "o dólar está calmo ou agitado?" tem resposta em %.

No Cap. 9 de Jansen, essa volatilidade realizada é o benchmark contra o qual se
avaliam modelos de previsão (EWMA, GARCH) — o ponto de partida é exatamente a
linha `rolling(21).std() * np.sqrt(252)` desta aula.

### 2.9 Da série ao negócio: a ponte para a Aula 18

Tudo o que a aula constrói reaparece na Aula 18 com papel econômico:

| ferramenta da A17 | uso na A18 |
|---|---|
| `DatetimeIndex` + `loc['2026-08-14']` | escolher o dia da venda do hedge e da colheita |
| `reindex(..., method='ffill')` | alinhar o câmbio (PTAX) ao calendário da CBOT |
| `pct_change().cumsum()` | separar o que subiu por preço internacional vs. câmbio |
| `resample('ME').mean()` | relatório mensal de preço de saca para o cliente |
| `pd.bdate_range` | cronograma de coletas de preço no mercado físico |

Séries temporais não são um capítulo isolado: são a infraestrutura que toda
análise de preço — física ou futuro — roda por baixo.

### 2.6 pd.bdate_range: o calendário de dias úteis

```python
pd.bdate_range('2026-09-01', '2026-09-30')   # só business days
```

Gera a agenda de pagamentos, vencimentos e coletas de preço. Comparar o
`bdate_range` com as datas que efetivamente aparecem no dado BCB revela os
**feriados** (buracos esperados). Filtrar por dia da semana é direto no
`DatetimeIndex`: `idx.weekday` (segunda=0 … quinta=3, sábado=5).

## 3. Roteiro do notebook (`a17_series_temporais_financeiras.ipynb`)

| Seção | O que ver | O que observar |
|---|---|---|
| 1. Datas importam | texto vs `to_datetime` com formato explícito | `"02/03/2026"`: 2/mar ou 3/fev? `dayfirst` resolve |
| 2. Carregar BCB/CBOT | `read_csv(sep=';', decimal=',')`, `set_index`, `sort_index` | `usd.loc['2025']` só funciona depois do índice |
| 2.1 Coleta ao vivo | `try/except` com yfinance (BRL=X) | sem internet: mensagem de fallback e segue com CSV |
| 3. Indexação por data | `loc['2025']`, `loc['2025-04']`, intervalos | Selic média 2025 ≈ 14,33% a.a. |
| 4. shift/pct_change/cumsum | dólar de abr/2025: +3,05% e −2,46% | shift(1) = ontem; cumprod vs cumsum |
| 5. rolling | MM21/MM252 do câmbio; vol anualizada | NaN nas primeiras 251 linhas da MM252 |
| 6. resample | `'ME'`/`'YE'`, `agg(['mean','last','min','max'])` | nível→média; fluxo→soma |
| 7. bdate_range | agenda de set/2026; quintas de 1º semestre (Ex. 4) | feriados aparecem como buracos no dado |
| 8. Exercícios | 4 exercícios | faça antes de olhar `# SOLUÇÃO` |
| 9. Resumo | recap + referências KB | — |

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| `df.loc['2025']` → `KeyError` | data ainda é coluna de texto, não índice | `set_index` + `sort_index` após `to_datetime` |
| Série embaralhada / rolling estranho | índice sem ordem temporal | sempre `.sort_index()` |
| Datas trocadas (dia/mês invertidos) | faltou `dayfirst=True` no dado BCB | `pd.to_datetime(col, format="%d/%m/%Y", dayfirst=True)` |
| `ValueError: time data ... doesn't match format` | formato literal errado (ex.: `%-m`) | conferir a string real: BCB é `%d/%m/%Y`; Yahoo `%Y-%m-%d` |
| `TypeError` ao somar texto e data | comparar/usar data como string | converter com `pd.to_datetime` antes de qualquer operação |
| Muitos `NaN` no começo da MM252 | janela de 252 não encheu | comportamento correto; use `first_valid_index()` para saber onde começa |
| `ValueError: Invalid frequency: M` | pandas 3.x aposentou `'M'`/`'Y'` | usar `'ME'` e `'YE'` |
| `SettingWithCopyWarning` ao alterar recorte | alteração em fatia de cópia | operar sobre a cópia inteira ou usar `.copy()` |
| Volatilidade anualizada absurda | esqueceu `* np.sqrt(252)` na anualização | `rolling(21).std() * np.sqrt(252)` |
| `pct_change()` na primeira linha | não existe "ontem" do primeiro dia | `NaN` por construção — ignore ou recorte a partir do segundo dia |
| Retorno acumulado "menor" que o esperado | misturou `cumsum` (soma simples) com `cumprod` (composto) | decisão econômica: composto é o correto em finanças |
| Fuso horário estranho no índice | dado com timezone (Yahoo intradiário) | `df.index = df.index.tz_localize(None)` ou usar `usdbrl_yahoo_diario.csv` (já normalizado) |

## 5. Glossário

| Termo (en) | Em português | Significado |
|---|---|---|
| time series | série temporal | observações indexadas pelo tempo |
| DatetimeIndex | índice de datas | índice pandas com datas (permite `loc['2025']`) |
| `to_datetime` | converter p/ data | parse de texto → `Timestamp`, com formato explícito |
| `dayfirst` | dia primeiro | interpreta `dd/mm/aaaa` (padrão BCB) |
| `shift` | deslocar | valor de *n* períodos atrás na linha atual |
| `pct_change` | variação percentual | `(hoje/ontem − 1)` |
| `cumsum` / `cumprod` | soma/produto acumulado | trajetória acumulada; cumprod = composição |
| rolling | janela móvel | estatística sobre janela que desliza (MM, vol) |
| moving average (MA) | média móvel | rolling mean; MM21 (mês), MM252 (ano) |
| realized volatility | volatilidade realizada | desvio-padrão dos retornos, anualizada com √252 |
| `resample` | reamostrar | mudar a frequência (diário→mensal: `'ME'`) |
| business day | dia útil | `bdate_range`; weekday 0–4 |
| frequency alias | código de frequência | `'ME'` = month end, `'YE'` = year end (pandas 3.x) |

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/12_chapter-10-time-series.md`
  — McKinney, Cap. 10 *Time Series*: DatetimeIndex, indexação por data, `shift`,
  `pct_change`, `rolling`, `resample` e convenções de frequência.
- `kb/01_mckinney_python_for_data_analysis/13_chapter-11-financial-and-economic-data-applications.md`
  — McKinney, Cap. 11 *Financial and Economic Data Applications*: retornos,
  janelas e agregações aplicadas a finanças.
- `kb/03_jansen_ml_for_algorithmic_trading/15_chapter-9-time-series-models-for-volatility-forecasts-and-st.md`
  — Jansen, Cap. 9: volatilidade realizada, médias móveis e sinais
  (aprofundamento — a ponte para as aulas de modelo).

## 7. Gabarito comentado

**E1 — O ano do tarifaço.** O câmbio de 2025 com `loc['2025']`, o dia de maior
alta/queda com `pct_change` + `idxmax/idxmin`, e a contagem acima da MM252:

```python
u25 = usd.loc['2025']
print("a) média/min/max 2025:", u25.mean().round(4), u25.min(), u25.max())

u25_ret = usd.pct_change().loc['2025']
dia_alta = u25_ret.idxmax()
dia_queda = u25_ret.idxmin()
print("b) maior alta:", dia_alta.date(), f"{100 * u25_ret.max():.2f}%",
      "| maior queda:", dia_queda.date(), f"{100 * u25_ret.min():.2f}%")

mm252 = usd.rolling(252).mean()
acima = (u25 > mm252.loc['2025']).sum()
print("c) dias acima da MM252:", acima, "de", len(u25))
```

Resposta com o dado atual: a) média ≈ R$ 5,586, mín ≈ 5,273 (fev), máx ≈ 6,209
(11/abr); b) maior alta em **04/abr/2025 (+3,05%)** e maior queda em
**10/abr/2025 (−2,46%)** — a semana do tarifaço; c) **84 dias** de 252 ficaram
acima da MM252 (o dólar passou o ano-majoridade acima da referência anual após
abril). O `idxmax` devolve a **data** (rótulo), não a posição — a diferença
entre série temporal e array nu.

**E2 — Resumo mensal da Selic.**

```python
resumo = selic.loc['2025'].resample('ME').agg(['mean', 'first', 'last'])
print(resumo.round(2))

mes_pico = resumo['mean'].idxmax()
print(f"Selic média mais alta de 2025: {mes_pico.strftime('%b/%Y')} "
      f"({resumo['mean'].max():.2f}% a.a.)")
```

A Selic média de 2025 foi ≈ **14,33% a.a.** — o pico concentra-se no início do
ano (primeiros meses acima de 14%), antes do início do ciclo de cortes. Repare
que `first`/`last` capturam o "abriu/fechou" do mês — a leitura que o relatório
usa.

**E3 — Retorno acumulado da soja em 2025.**

```python
s25 = soja.loc['2025']
r_s = s25.pct_change()

ret_comp = (1 + r_s).cumprod() - 1          # composição correta
ret_soma = r_s.cumsum()                     # aproximação linear

print(f"soja 2025: composto {100 * ret_comp.iloc[-1]:+.1f}% | "
      f"soma simples {100 * ret_soma.iloc[-1]:+.1f}%")
print("diferença = juros sobre juros (a composição amplifica os retornos positivos)")
```

A composição é a correta porque o retorno de hoje incide sobre o capital já
acumulado — o mesmo raciocínio do montante composto da Aula 15. Em séries com
muitos dias positivos seguidos, o composto fica **acima** da soma simples; a
diferença cresce com o tempo e com a volatilidade.

**E4 — Cronograma de coletas (quintas úteis).**

```python
calendario = pd.bdate_range('2026-01-01', '2026-06-30')
quintas = calendario[calendario.weekday == 3]
print("coletas (quintas úteis):", len(quintas))
print(quintas[:5])
```

São **26 coletas**: seis meses × ~4,33 quintas/mês. `weekday == 3` filtra as
quintas (segunda=0). O `bdate_range` garante que nenhum feriado crie coleta
inexistente — e, se quiser refinar, compare o calendário com as datas do dado
BCB no mesmo período: os buracos são feriados nacionais.

### Leituras que valem a conferência

**Sobre o Ex. 2 — a curva da Selic em 2025.** O resumo mensal mostra o ciclo
completo do ano: Selic média de **12,24% a.a. em janeiro** subindo até
**14,90% a.a. em julho** e ficando lá até dezembro. O `first`/`last` da tabela
conta a história de forma ainda mais nítida: o ano abriu em 12,15% e fechou em
13,15%… depois de passar por 14,90%. Foi um ano de **aperto** (não de cortes) —
quem leu "Selic caindo" no início de 2025 leu intenção de política, não dado
realizado. O `idxmax()` sobre a coluna `mean` devolve agosto/2025, mas com a
série plana em 14,90 de jul a dez, qualquer mês desse platô seria uma resposta
defensável — um lembrete de que `idxmax` devolve **o primeiro** máximo em caso
de empate.

**Sobre o Ex. 3 — soja em 2025.** O retorno acumulado composto (+3,1%) ficou
**abaixo** da soma simples (+4,4%) — o oposto do que a intuição "juros sobre
juros" sugere a primeiro olhar. A explicação está na ordem das perdas e ganhos:
com retornos negativos no meio do caminho, a composição **reduz a base** sobre
a qual os ganhos seguintes incidem. A regra prática: composto > soma quando os
ganhos vêm primeiro; composto < soma quando há perdas no meio (volatilidade
"come" parte da soma simples). Em séries longas e voláteis, a diferença entre
os dois métodos é grande — e é por isso que finanças usa `cumprod`.

**Sobre a célula de fallback.** A Seção 2.1 é a única com rede de todo o curso.
O `try/except` pega **qualquer** exceção (`ImportError` sem yfinance instalado,
erro de rede, bloqueio do Yahoo) e cai na mesma mensagem de fallback — o
notebook nunca quebra por causa dela. Esse padrão (rede é opcional, dado local
é obrigatório) é o contrato offline-first do curso inteiro, e vale para
qualquer script de produção que você escrever: coleta ao vivo é *upgrade*, não
dependência.