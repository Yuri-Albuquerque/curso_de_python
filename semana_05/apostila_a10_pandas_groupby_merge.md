# Apostila Aula 10 — pandas: filtros, agrupamento (`groupby`) e junções (`merge`)

> Curso Python para Economistas — OIKOS/UEG · Semana 5 · Aula 10 (50 min)

## 1. Por que isso importa (intuição econômica)

A Aula 09 ensinou a ler **uma** tabela. A pesquisa econômica real chega **desmembrada**:
a POF 2017-18 do IBGE — a maior pesquisa de orçamentos familiares do país — é
entregue em arquivos separados de domicílios, moradores e despesas, cada um com
dezenas de milhares de linhas. A pergunta que o seu cliente faz ("quanto do
orçamento das famílias goianas vai para alimentação, e isso cai com a renda?") não
existe em nenhum arquivo isolado. Ela exige **juntar** as tabelas, **filtrar** os
recortes e **resumir** por grupo. Três verbos, três ferramentas do pandas: `merge`,
máscaras booleanas e `groupby`.

Há uma teoria econômica inteira por trás do exercício: a **Lei de Engel** (1857),
que Ernst Engel formulou exatamente observando orçamentos familiares — quanto mais
pobre a família, maior a fração do orçamento gasta em alimentação. O coeficiente de
Engel ($w_{food} = \frac{x_{food}}{x_{total}}$) é um dos preditores clássicos de
nível de bem-estar; calculá-lo sobre microdados reais da POF é a tarefa completa
desta aula, do `read_csv` ao gráfico.

E há o custo de não saber. Um `merge` mal diagnosticado duplica famílias silenciosamente
e o PIB per capita da sua análise cai pela metade sem nenhum erro na tela. Um
`groupby` sem named aggregation devolve colunas ilegíveis que ninguém confere. Em
consultoria, a diferença entre `inner` e `left` é a diferença entre o relatório que
passa na banca e o que volta.

## 2. Teoria essencial

### 2.1 Filtros vetoriais: a máscara booleana

```python
pobres = morador[morador["RENDA_PC"] < 0.5 * 1518]     # ≤ meio salário mínimo (2026)
```

A comparação `morador["RENDA_PC"] < 759` é **vetorizada**: percorre as 57.920 linhas
em C, não em Python, e devolve uma máscara booleana. O `df[mascara]` mantém só as
linhas `True`. Combinações:

| Quer... | Sintaxe |
|---|---|
| e lógico | `(df["a"] > x) & (df["b"] < y)` — parênteses obrigatórios |
| ou lógico | `(df["a"] == 7) \| (df["b"] >= 15)` |
| valor numa lista | `df["UF"].isin([33, 52])` |
| faixa inclusiva | `df["RENDA_PC"].between(1000, 3000)` |
| negação | `~df["col"].isna()` |

**Erro clássico**: usar `and`/`or` textuais em vez de `&`/`|` levanta
`ValueError` ("a verdade de um array é ambígua") — o Python não sabe qual linha
decide. E sem os parênteses, `&` tem precedência sobre `<` e a comparação vira
lixo sintático.

### 2.2 Colunas derivadas

```python
pof["desp_total"] = pof[CATS].sum(axis=1)      # soma ao longo das colunas
pof["w_food"]     = pof["food"] / pof["desp_total"]
```

A atribuição cria a coluna inteira numa linha — o laço de 57 mil iterações nunca
existiu. `axis=1` é a armadilha: soma **ao longo das colunas** (linha a linha);
`axis=0` desceria as linhas (coluna a coluna). A fração de Engel usa o gasto
**total** como denominador; usá-lo sobre a renda per capita de um único membro é
um erro de interpretação (a despesa do domicílio não é paga só pelo responsável).

### 2.3 `groupby`: dividir, aplicar, combinar

O padrão **split-apply-combine** (Hadley Wickham): divida pelas categorias,
aplique uma função a cada pedaço, combine o resultado.

```python
pof.groupby("NIVEL_INST")["RENDA_PC"].mean()          # 1 coluna × 1 função
pof.groupby("NIVEL_INST")["RENDA_PC"].agg(
    media="mean", mediana="median", desvio="std", n="size"
)                                                      # 1 coluna × várias funções
```

**Named aggregation** — várias colunas × várias funções, com nomes que você escolhe:

```python
uf_resumo = pof.groupby("UF").agg(
    renda_media=("RENDA_PC", "mean"),
    renda_p90=("RENDA_PC", lambda s: s.quantile(0.9)),
    gasto_medio=("desp_total", "mean"),
    n_domicilios=("household_id", "size"),
)
```

O nome da variável vira o nome da coluna de saída — a tabela sai pronta para o
relatório, sem renomear depois. `("coluna", "função")` é a sintaxe; funções
nativas ("mean", "size") e lambdas são aceitas.

### 2.4 `pivot_table`: a tabela cruzada

```python
tabela = pof.pivot_table(index="UF", columns="SITUACAO", values="RENDA_PC", aggfunc="mean")
```

Linhas = UF, colunas = situação (1 urbano, 2 rural), células = renda média.
É o `groupby` com **duas** dimensões de agrupamento — equivalente a
`pof.groupby(["UF", "SITUACAO"])["RENDA_PC"].mean().unstack()`, mas legível.
`margins=True` acrescenta os totais (`All`) — a linha/coluna "total geral" do
cruzado do IBGE. Se aparecer NaN, a combinação linha×coluna não existe nos dados.

### 2.5 `merge`: a junção relacional

```python
pof = domicilio.merge(morador, on="household_id", how="inner")
```

`on` é a chave comum; `how` decide quem sobrevive:

| how | Mantém... | Anatomia no nosso caso |
|---|---|---|
| `"inner"` | só chaves presentes nas **duas** tabelas | 57.799 famílias (com as 3 bases) |
| `"left"` | tudo da tabela da esquerda; NaN onde falta | 57.920 linhas (domicílios completos) |
| `"outer"` | tudo das duas; NaN de qualquer lado | 57.920 (quando ninguém tem chave extra) |

Conte linhas antes e depois — é o diagnóstico de todo merge:

```python
len(domicilio), len(morador), len(domicilio.merge(morador, how="inner"))
```

Se `inner` devolve **mais** linhas do que a tabela menor, há chaves duplicadas:
cada par duplicado gera um produto cartesiano local (5.731 famílias × 4 despesas
= linhas estufadas, sem erro na tela). Nossa base tem exatamente esse caso —
2.344 `household_id` repetidos em `pof_morador` (duas pessoas de referência no
mesmo domicílio) — e o tratamento é `drop_duplicates(subset="household_id")`
**antes** do merge. Em base de Pesquisa de Orçamentos, 1 linha = 1 família.

### 2.6 Fórmulas usadas no notebook

Coeficiente de Engel (fração do gasto em alimentação):

$$w_{food} = \frac{x_{food}}{\sum_j x_j}, \qquad j \in \{\text{food, housing, transport, health, other}\}$$

Comprometimento da renda (gasto anual ÷ renda anual per capita do responsável):

$$\rho = \frac{\sum_j x_j}{12 \cdot R_{pc}}$$

Faixas de renda: `pd.qcut(renda, q=4, labels=["Q1","Q2","Q3","Q4"])` divide a
distribuição em **quartis de população** — cada faixa tem ~25% das famílias,
não ~25% da renda (isso seria `pd.cut` com limites fixos).

## 3. Roteiro do notebook (`a10_pandas_groupby_merge.ipynb`)

| Seção | O que ver | O que observar |
|---|---|---|
| 1. Da série ao sistema | POF 2017-18: 3 tabelas | o problema econômico exige juntar, filtrar, resumir |
| 2. Filtros vetoriais | pobreza, `&`/`\|`, `isin`, `between` | parênteses obrigatórios; contagem de linhas em cada filtro |
| 3. Colunas derivadas | `desp_total`, `w_food`, `prop_renda` | `axis=1` soma na linha; Engel à vista no `describe()` |
| 4. groupby | média → `.agg()` → named aggregation | UF 52 no `uf_resumo.loc[[...]]`; gráfico das rendas por UF |
| 5. pivot_table | UF × situação × renda média | gap urbano-rural de Goiás ≈ R$ 118; `margins=True` |
| 6. merge | inner/left/outer contados | inner 57.799 vs outer 57.920: quem sumiu |
| 7. Caso real | Goiás (UF 52), quartis, Engel | Q1 ≈ 65% → Q4 ≈ 59%: a Lei de Engel na POF |
| Exercícios | 5 (GO, quintis, pivot, merge, endividamento) | soluções em `# SOLUÇÃO N` |
| Resumo | recap + para casa | reexecutar a seção 7 com UF 53 (DF) |

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| `ValueError: The truth value of a Series is ambiguous` | `and`/`or` entre comparações de coluna | use `&` / `\|` com **parênteses** em cada comparação |
| Filtro devolveu mais linhas que o esperado | precedência: `&` antes de `<` sem parênteses | `(a > x) & (b < y)`, sempre entre parênteses |
| `KeyError: 'desp_total'` no groupby | coluna derivada só existe na base left, não na inner | recrie a coluna na base que você está usando |
| Merge estufou linhas | chaves duplicadas na tabela da direita | `drop_duplicates(subset=...)` antes do merge |
| `KeyError: 'UF'` após o merge | coluna ficou só na tabela esquerda (esqueceu de juntar) | junte todas as tabelas antes de filtrar |
| `ValueError: Bin labels must be one fewer than the number of bin edges` | `qcut(q=4)` com 5 labels | labels = `["Q1","Q2","Q3","Q4"]` para 4 faixas |
| Média de faixa vazia / `observed=False` warning | `groupby` em coluna categórica com faixas vazias | `observed=True` no groupby |
| Números do relatório não batem | `inner` descartou linhas sem aviso | conte linhas antes/depois de cada merge |
| Soma de categorias ≠ despesa total | categoria coletiva ficou de fora | some **todas** as colunas (`CATS` completo) |

## 5. Glossário

| Termo (en) | Em português | Significado |
|---|---|---|
| boolean mask | máscara booleana | array True/False usado para filtrar linhas |
| derived column | coluna derivada | coluna criada a partir de outras (soma, razão) |
| groupby | agrupamento | split-apply-combine: dividir, aplicar função, combinar |
| split-apply-combine | dividir-aplicar-combinar | paradigma do groupby (Wickham) |
| named aggregation | agregação nomeada | `.agg(nome=("col", "func"))` — saída com colunas legíveis |
| pivot table | tabela cruzada / dinâmica | linhas × colunas × valor agregado |
| merge / join | junção | combinar tabelas por chave comum (`on`) |
| inner join | junção interna | mantém só chaves presentes nas duas tabelas |
| left join | junção à esquerda | mantém toda a tabela esquerda; NaN onde falta |
| outer join | junção externa | mantém tudo; NaN de qualquer lado |
| key | chave | coluna que casa as tabelas (`household_id`) |
| quartile | quartil | 4 faixas de população (~25% cada) via `pd.qcut` |
| Engel coefficient | coeficiente de Engel | fração do gasto em alimentação; cai com a renda |
| unstack / stack | desempilhar / empilhar | mover nível de índice hierárquico para colunas (e vice-versa) |

## 6. Referências

- `kb/02_vanderplas_python_data_science_handbook/06_chapter-3-data-manipulation-with-pandas.md`
  — VanderPlas, *Python Data Science Handbook*, Cap. 3: seções *Aggregation and
  Grouping* (split-apply-combine), *Combining Datasets: Merge and Join*, *Pivot Tables*.
- `kb/01_mckinney_python_for_data_analysis/09_chapter-7-data-wrangling-clean-transform-merge-reshape.md`
  — McKinney, Cap. 7: merge/join em profundidade, `drop_duplicates`, pivoteamento.
- `kb/01_mckinney_python_for_data_analysis/11_chapter-9-data-aggregation-and-group-operations.md`
  — McKinney, Cap. 9: groupby em profundidade, `agg`, named aggregation, `apply`.

## 7. Gabarito comentado

**E1 — Quem estuda mais estuda em Goiás?**

```python
grad_go = go.groupby("NIVEL_INST")["RENDA_PC"].agg(n="size", renda_media="mean").round(0)
grad_br = pof_inner.groupby("NIVEL_INST")["RENDA_PC"].mean().round(0)
comp = pd.DataFrame({"goias": grad_go["renda_media"], "brasil": grad_br})
comp["razao_go_br"] = (comp["goias"] / comp["brasil"]).round(2)
```

A renda sobe monotonicamente com a escolaridade (do nível 1 ao 7), em Goiás e no
Brasil; as razões próximas de 1 mostram que o **gradiente relativo** é parecido —
Go paga premiações de escolaridade semelhantes em nível de renda menor. Comparar
"nível" sem comparar "razão" é o erro clássico de leitura regional.

**E2 — Engel por quintis.** Troque `q=4` por `q=5` (labels Q1–Q5) e reexecute o
groupby. A razão Q1/Q5 sai de `engel5["Q1"] / engel5["Q5"]` (≈ 1.1 na amostra):
a família mais pobre dedica fração ~10% maior do orçamento à alimentação do que a
mais rica. Quanto mais fina a faixa, mais suave (e menos ruidosa) fica a curva —
mas cada faixa tem menos observações, e a variância sobe. Quartil ou quintil é
escolha de legibilidade, não de teoria.

**E3 — pivot_table por situação e UF.**

```python
tab = pof_inner.pivot_table(index="UF", columns="SITUACAO", values="desp_total", aggfunc="mean")
tab.columns = ["urbano", "rural"]
gap = tab.loc[53, "urbano"] - tab.loc[52, "rural"]
```

O urbano do DF gasta ~30% mais que o rural goiano na despesa anualizada —
renda + preço de serviços. Cuidado na leitura: `desp_total` é **despesa**, não
renda; parte do gap reflete custo de vida, não bem-estar.

**E4 — merge left: o que sobra e o que falta?**

```python
pof_left = domicilio.merge(despesa, on="household_id", how="left")
print(f"(a) linhas com left:  {len(pof_left)}")                    # 57.920
print(f"(b) com despesa faltando (food NaN): {pof_left['food'].isna().sum()}")  # 121
```

O inner devolveria menos (57.799) porque **descarta** os 121 domicílios sem
despesa em vez de mantê-los com NaN. Regra de bolso: `left` para *diagnóstico*
("quem ficou de fora?"), `inner` para *estimativa* ("a base completa").
Contar `isna().sum()` na coluna da direita é o diagnóstico padrão do left merge.

**E5 — A faixa mais endividada.**

```python
go["prop_renda"] = go["desp_total"] / (12 * go["RENDA_PC"])
comp = go.groupby("faixa").agg(prop_media=("prop_renda", "mean"), n=("prop_renda", "size"))
print(f"Maior comprometimento: faixa {comp['prop_media'].idxmax()}")
```

O maior comprometimento está nas faixas de renda **menor** — e a leitura econômica
tem duas camadas: (i) despesa fixa (aluguel, energia, alimentação básica) não
escala com a renda, então pesa mais nos pobres; (ii) nossa renda é a **per capita
do responsável**, enquanto a despesa é do domicílio inteiro — famílias grandes com
renda baixa por membro ficam com ρ > 1 sem estarem "endividadas". É a limitação
da variável, não um fenômeno de crédito.