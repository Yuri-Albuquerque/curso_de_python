# Apostila Aula 09 — pandas: `Series`, `DataFrame`, `loc`/`iloc` e entrada/saída de dados

> Curso Python para Economistas — OIKOS/UEG · Semana 5 · Aula 09 (50 min)

## 1. Por que isso importa (intuição econômica)

Tudo o que você fez nas últimas semanas rodou em **listas, dicionários e arrays**.
Funciona — mas o dia a dia do economista não é uma matriz de números puros: é uma
**planilha com cabeçalho**. A cotação do dólar tem *data*; a folha de pagamentos tem
*nome de coluna*; a série do IPCA tem *mês de referência*. O NumPy responde
"o número está na linha 5"; o economista pergunta "quanto foi o IPCA de **mar/1990**?".
Essa tradução — de posição para etiqueta — é o que o pandas adiciona sobre o NumPy,
com dois atributos que o `ndarray` não tem: **índice explícito** (linhas com nome) e
**colunas rotuladas**.

O segundo motivo é o fluxo de trabalho real. Chega segunda-feira e o dado vem de
fontes diferentes: um CSV do Banco Central (que, no Brasil, usa `;` como separador e
vírgula como decimal), uma planilha do cliente em Excel, uma base do IBGE com
microdados. Antes de qualquer análise — antes do gráfico, antes da regressão da
Aula 19 — existe o **ritual de leitura**: abrir o arquivo certo com os argumentos
certos, conferir tipos, lidar com o furo de dados que sempre existe. Essa aula é
esse ritual, com os arquivos reais que o curso usa.

O terceiro motivo é econômico: **dados faltantes não são um detalhe técnico, são
informação**. O dia sem cotação de câmbio pode ser feriado, greve dos corretores ou
falha de coleta — e a decisão de *descartar* (`dropna`), *carregar o último valor*
(`ffill`) ou *pegar o próximo* (`bfill`) muda o resultado da análise. Quem trata
NaN sem pensar fabrica números.

## 2. Teoria essencial

### 2.1 `Series`: o par (índice, valores)

Uma `Series` é um array 1-D do NumPy + um índice explícito (+ um nome opcional):

```python
orcamento = pd.Series(
    {"alimentacao": 1650.0, "aluguel": 900.0, "transporte": 460.0, "saude": 280.0},
    name="despesa_mensal",
)
```

| Atributo | O que é | No exemplo |
|---|---|---|
| `values` | array NumPy com os dados | `[1650.0, 900.0, 460.0, 280.0]` |
| `index` | as etiquetas das linhas | `['alimentacao', 'aluguel', ...]` |
| `dtype` | um tipo só para todos os valores | `float64` |
| `name` | o nome da série (vira nome de coluna num DataFrame) | `'despesa_mensal'` |

Quando o índice são **datas**, a `Series` é uma série temporal de verdade:
`pd.date_range("1990-01", periods=12, freq="MS")` gera os 12 primeiros-dias-de-mês
de 1990, e `ipca_1990.loc["1990-03"]` responde "inflação de março/1990" sem
decorar posição nenhuma.

### 2.2 `DataFrame`: colunas rotuladas com tipos independentes

```python
df = pd.DataFrame({"produto": [...], "preco_usd": [...], "volume_sc": [...]})
```

Três fatos que organizam tudo:

1. Cada **coluna** é uma `Series` — `df["preco_usd"]` devolve uma;
2. Cada coluna tem seu **dtype** (o DataFrame mistura texto e número por coluna, ao contrário do array);
3. `df.shape` é `(linhas, colunas)`; `df.index` e `df.columns` são as etiquetas dos dois eixos.

Por padrão as linhas recebem um `RangeIndex` (0, 1, 2, …) — e aí índice e posição
coincidem, o que esconde a diferença entre `loc` e `iloc` até a semana em que ela
cobra o preço.

### 2.3 `loc` vs `iloc`: as duas portas

| | `df.loc[...]` | `df.iloc[...]` |
|---|---|---|
| Indexa por | **rótulo** (index/columns) | **posição** (0, 1, 2, …) |
| Fatia `a:b` | **inclusiva** (b entra) | **exclusiva** (b sai, padrão Python) |
| Exemplo | `df.loc["soja", "preco_usd"]` | `df.iloc[0, 1]` |

As pegadinhas da aula:

- **Rótulo que não é posição**: após `df.set_index(np.arange(10, 14))`, o rótulo 12
  só existe para `loc` — `df_num.iloc[12]` levanta `IndexError` (só há 4 linhas,
  posições 0–3);
- **Fatia inclusiva**: `df.loc[10:12]` traz 3 linhas (10, 11, **12**);
  `df.iloc[0:2]` traz 2 (0, 1). Mesmo `:`, filosofias diferentes;
- **`KeyError` no loc**: o rótulo não existe (erro de digitação, ou a coluna virou índice);
- **Atalho honesto**: `df["col"]` para coluna única, `df[["a", "b"]]` para várias.

### 2.4 Entrada: o CSV brasileiro e o `pd.read_csv`

O arquivo do BCB (`ipca_mensal.csv`, SGS 433) tem literalmente isto dentro:

```
"data";"valor"
"01/01/1980";"6,62"
```

Três armadilhas, três argumentos:

| Armadilha | Sem o argumento | Com o argumento |
|---|---|---|
| Separador `;` | tudo vira 1 coluna de texto | `sep=";"` |
| Decimal `,` | `"6,62"` vira **texto**; média quebra | `decimal=","` |
| Data `dd/mm/aaaa` | coluna de texto, sem ordem cronológica | `pd.to_datetime(col, dayfirst=True)` |

O `dayfirst=True` importa: sem ele, "01/02/2026" viraria 2 de janeiro. Para séries
BCB o formato é sempre dia-mês-ano. O `encoding` entra quando há acento:
planilhas salvas no Excel brasileiro em modo legado usam `latin-1`, e o padrão do
pandas é `utf-8` — com o encoding errado, `região` vira `regiÃ£o`.

### 2.5 Saída e reentrada: Excel

```python
df.to_excel("mini_relatorio_a09.xlsx", index=False)  # index=False: não exportar o RangeIndex
df_volta = pd.read_excel("mini_relatorio_a09.xlsx")  # openpyxl faz o trabalho pesado
```

O `index=False` é a decisão certa quase sempre: o índice do pandas é posição de
trabalho, não coluna de dados. Sem ele, o Excel ganha uma coluna sem nome que
contamina o próximo leitor (humano ou programa).

### 2.6 Dados faltantes: NaN e as três decisões

`NaN` ("not a number") é um float especial: contamina a coluna, não faz aritmética
quebrar. Diagnóstico e tratamento:

```python
s.isna()          # máscara booleana: True onde falta
s.isna().sum()    # quantos faltam (por coluna, se for DataFrame)
s.dropna()        # decisão 1: descartar as linhas com furo
s.ffill()         # decisão 2: forward fill — o último valor válido "vaza" para frente
s.bfill()         # decisão 3: backward fill — o próximo valor válido preenche para trás
```

Para séries de mercado, `ffill` costuma ser a escolha certa: o preço de ontem é a
melhor estimativa disponível para o dia que não teve pregão. `bfill` é mais raro —
útil quando se quer o dado "assim que existir" (lançamento contábil, divulgação de
série revizada).

> **pandas 3.x**: `fillna(method="ffill")` **não existe mais**. A forma é sempre
> `s.ffill()` / `s.bfill()`. Preencher com constante continua `fillna(valor)`.
> No mesmo espírito: `append()` foi removido (use `pd.concat`) e evite `inplace=True`.

### 2.7 Fórmulas usadas no notebook

Inflação acumulada de $n$ meses (a partir das taxas mensais $\pi_t$):

$$\Pi_{12m} = \left[\prod_{t=1}^{12}(1+\pi_t)\right] - 1$$

Peso de uma categoria $i$ no orçamento:

$$w_i = \frac{x_i}{\sum_j x_j}$$

## 3. Roteiro do notebook (`a09_pandas_series_dataframe.ipynb`)

| Seção | O que ver | O que observar |
|---|---|---|
| 1. De arrays a tabelas | intuição: índice + rótulo | a pergunta econômica é "quando", não "linha N" |
| 2. Series | orçamento familiar, IPCA 1990 | `values`/`index`/`name`; acesso por rótulo e posição |
| 3. DataFrame | matriz de commodities de Goiás | `shape`, `columns`, `dtypes`, coluna derivada `receita_usd` |
| 4. loc vs iloc | as duas portas + 2 pegadinhas | `iloc[12]` em 4 linhas quebra; `loc[10:12]` inclui o 12 |
| 5. Importar CSV | IPCA real do BCB (sep/decimal/dayfirst) | gráfico de 40 anos; IPCA 12m ≈ 4,4% |
| 6. Excel | ciclo `to_excel` → `read_excel` | `equals()` confirma a volta sem perda |
| 7. Dados faltantes | câmbio com furos | `isna` → `dropna` → `ffill`/`bfill` (pandas 3.x!) |
| 8. Bônus encoding | `latin-1` vs `utf-8` | "região" volta legível |
| Exercícios | 4 (dados reais + pegadinhas) | soluções em `# SOLUÇÃO N` |
| Resumo | recap + para casa | Selic ≈ 13,9% a.a. em set/2026 |

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| `KeyError: 'data'` | coluna virou índice (ou nome errado) | confira `df.columns`; use `reset_index()` se precisar da coluna de volta |
| Coluna numérica com média quebrada / dtype `object` | decimal `,` não convertido | `pd.read_csv(..., decimal=",")` ou `str.replace(",", ".").astype(float)` |
| CSV abriu em 1 coluna só | separador errado | `sep=";"` (padrão BCB/Excel BR) |
| Datas fora de ordem / `dayfirst` errado | "01/02/2026" lido como 2/jan | `pd.to_datetime(col, dayfirst=True)` + `sort_index()` |
| `IndexError: positional indexers are out-of-bounds` | `iloc` com rótulo (ex.: 12 em base de 4 linhas) | use `loc` para rótulo, `iloc` para posição; confira `df.index` |
| `KeyError` no `loc` | rótulo não existe (digitação; coluna virou índice) | `df.index` / `df.columns` antes; ou `df.reset_index()` |
| `TypeError: unsupported format string passed to Series` | `loc["1994-07"]` devolveu uma Series (1 coluna, várias linhas) | `.iloc[0]` para pegar o único valor |
| Acento virou `regiÃ£o` | encoding errado | `pd.read_csv(..., encoding="latin-1")` |
| `TypeError: Fillna.__init__() got an unexpected keyword 'method'` | sintaxe pandas ≤ 2.x | use `s.ffill()` / `s.bfill()` |
| `ArithmeticError`/NaN estranho em coluna mista | coluna de texto com furos virou `object` | trate furos **antes** da aritmética; confira `df.dtypes` |

## 5. Glossário

| Termo (en) | Em português | Significado |
|---|---|---|
| Series | série | array 1-D com índice explícito (e nome opcional) |
| DataFrame | quadro de dados | tabela: linhas indexadas + colunas rotuladas, dtype por coluna |
| index | índice | etiqueta das linhas; pode ser data, texto ou número |
| label | rótulo | o nome do elemento do índice (acessado por `loc`) |
| positional index | índice posicional | a posição contada de 0 (acessada por `iloc`) |
| dtype | tipo de dado | como cada coluna é codificada (`float64`, `int64`, `str`) |
| NaN | dado faltante | "not a number"; marcador de furo (float especial) |
| missing data | dado faltante | sinônimo corrente de NaN |
| dropna | descartar furos | remover linhas/colunas com NaN |
| ffill / bfill | preencher p/ frente / trás | carregar o último (ou próximo) valor válido para o furo |
| delimiter / separator | separador | caractere que divide colunas no CSV (`,` no EUA, `;` no BR) |
| decimal separator | separador decimal | vírgula (BR) vs ponto (EUA) |
| encoding | codificação | mapa byte→caractere (`utf-8`, `latin-1`) |
| datetime64 | data-hora | dtype de data do pandas; permite indexar por `"1994-07"` |

## 6. Referências

- `kb/02_vanderplas_python_data_science_handbook/06_chapter-3-data-manipulation-with-pandas.md`
  — VanderPlas, *Python Data Science Handbook*, Cap. 3: seções *Pandas Objects*
  (Series/DataFrame/Index), *Data Indexing and Selection* (loc/iloc).
- `kb/01_mckinney_python_for_data_analysis/07_chapter-5-getting-started-with-pandas.md`
  — McKinney, Cap. 5: introdução às estruturas, reindexação, indexação básica.
- `kb/01_mckinney_python_for_data_analysis/08_chapter-6-data-loading-storage-and-file-formats.md`
  — McKinney, Cap. 6: `read_csv` em profundidade (sep, decimal, encoding), formatos binários.

## 7. Gabarito comentado

**E1 — O câmbio de setembro/2026.** Leitura brasileira + datetime + último registro:

```python
cambio_df = pd.read_csv(DATA / "usdbrl_diario.csv", sep=";", decimal=",")
cambio_df["data"] = pd.to_datetime(cambio_df["data"], dayfirst=True)
cambio_df = cambio_df.set_index("data").sort_index()

print(f"Observações diárias: {len(cambio_df)}")          # 2.429 dias úteis
print(f"Última cotação ({cambio_df.index[-1].date()}): {brl(cambio_df['valor'].iloc[-1])}")
# → 04/09/2026: R$ 5,13 (≈ R$ 5,12/US$ de set/2026)
```

Os três argumentos de leitura fazem o trabalho: sem `sep=";"` o arquivo vira uma
coluna de texto; sem `decimal=","` a média sai errada por ordem de grandeza.
`.iloc[-1]` pega a última posição — seria `loc` com a data completa, mais verboso.

**E2 — Três portas, três respostas.** Com índice por produto:

```python
df_ex = pd.DataFrame(
    {"produto": ["soja", "milho", "boi_gordo"], "preco_usd": [12.90, 5.10, 195.00]}
).set_index("produto")

print(df_ex.loc["soja", "preco_usd"])   # rótulo de linha + rótulo de coluna
print(df_ex.iloc[0, 0])                  # posição (0, 0)
print(df_ex["preco_usd"].iloc[0])        # coluna, depois posição
```

Os três imprimem `12.9`. A pergunta da fatia: com rótulos `['a','b','c']`,
`df.loc["a":"b"]` devolve **as mesmas 2 linhas** que `df.iloc[0:2]` — porque o
`loc` é inclusivo no fim (a, b) e o `iloc` é exclusivo (posições 0, 1). A diferença
entre as portas só aparece quando o número de elementos entre o início e o fim muda
com a inclusividade, ou quando índice e posição deixam de coincidir.

**E3 — IPCA do Plano Real.** Filtro temporal com rótulos de mês:

```python
jul_94 = ipca_ex.loc["1994-07", "valor"].iloc[0]     # ⚠ série mensal: 1 linha por mês
ano_1_real = ipca_ex.loc["1994-08":"1995-07", "valor"]
print(f"IPCA jul/1994 (mês do Plano Real): {jul_94:.2f}%")            # 6,84%
print(f"Média ago/1994 → jul/1995: {ano_1_real.mean():.2f}% ao mês")  # ≈ 2,04%
```

Dois detalhes: (1) `loc["1994-07"]` num índice **mensal** devolve uma `Series`
(aquele mês, que tem 1 linha) — o `.iloc[0]` extrai o número; (2) a fatia
`"1994-08":"1995-07"` é **inclusiva nos dois extremos** — 12 meses exatos. A queda
de ~6,8% para ~2% ao mês é o choque do Plano Real em números.

**E4 — Reconstruindo o furo do câmbio.**

```python
print("Furos:", cambio_semana.isna().sum())     # 2
cambio_ffill = cambio_semana.ffill()            # ter=5.12 (herda seg); qui=5.15 (herda qua)
cambio_bfill = cambio_semana.bfill()            # ter=5.15 (herda qua); qui=5.11 (herda sex)
```

A frase: `ffill`, porque o dia sem cotação deve carregar a **última cotação
conhecida** — a prática de mercado (e a regra de séries de preço). `bfill` daria à
terça-feira uma informação que só existiu depois, o que contaminaria qualquer
retorno calculado naquele intervalo.