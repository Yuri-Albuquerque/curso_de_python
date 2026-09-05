# Apostila Aula 08 — NumPy: Ufuncs, Broadcasting e Estatística

> Curso Python para Economistas — OIKOS/UEG · Semana 4 · Aula 08 (50 min)

## 1. Por que isso importa (intuição econômica)

Todo analista precisa responder, todo mês, a mesma pergunta incômoda: **quanto do
crescimento do faturamento é crescimento de verdade, e quanto é só inflação?**
A rede faturou R$ 4,6 milhões em jul/2026 e R$ 3,7 milhões em ago/2023 — cresceu 26%
em valor nominal. Mas no mesmo período os preços subiram ~14,8% (IPCA, ago/2023 →
jul/2026). Em reais de jul/2026, o ganho real é bem menor — e é só ele que interessa
ao dono.

Deflacionar 36 meses de 6 filiais são 216 operações — cada mês por **um fator de
deflação diferente**. É aí que entram as duas ferramentas da aula. As **ufuncs** são
as operações elementares (`+`, `−`, `×`, `÷`, `np.exp`, `np.sqrt`, `np.log`) que o
NumPy aplica elemento a elemento em velocidade de C. O **broadcasting** é a regra que
permite combinar arrays de tamanhos diferentes: multiplicar uma matriz 6 × 36 por um
vetor de 36 fatores, sem laço e sem replicar nada.

É o mesmo padrão do índice de preços: o IBGE não recalcula a economia inteira quando
um preço muda — ele **atualiza o índice e o aplica à série**. Broadcasting é a versão
computacional dessa ideia: a série pequena (36 fatores) "estica" sobre a matriz grande
(6 × 36) e a operação acontece.

Um alerta de direção que evita o erro mais comum da aula: para **trazer valores do
passado à data-base**, o fator **multiplica** (R$ 1,00 de ago/2023 equivale a R$ 1,146
de jul/2026 — os preços subiram no caminho). Dividir pelo fator faria o passado ficar
mais barato do que era — e a "série real" cresceria **mais** que a nominal, absurdo
econômico que o notebook evita explicitamente.

Por fim, o critério de qualidade desta aula é duplo: o resultado tem que estar
**economicamente certo** (real ≤ nominal num período inflacionário) e
**computacionalmente verificado** (`np.allclose` comparando a versão laço com a
vetorizada). Um sem o outro não fecha.

## 2. Teoria essencial

### 2.1 Ufuncs: operações elemento a elemento

Uma *universal function* (ufunc) recebe um array, aplica a operação a cada elemento
e devolve outro array — sem laço visível. As que mais usaremos:

| Ufunc | Operação | Uso econômico |
|---|---|---|
| `+ - * / **` | aritmética | deflacionar, reajustar, indexar |
| `np.exp`, `np.log` | exponencial / log | crescimento contínuo, log-retorno |
| `np.sqrt` | raiz quadrada | desvio-padrão manual |
| `np.abs` | módulo | erro absoluto de previsão |
| `np.maximum(a, b)` | máximo **elemento a elemento** | piso de preço: `np.maximum(preco, custo)` |
| `np.round` | arredondar | apresentação em R$ |
| `np.cumsum`, `np.cumprod` | acumulado | inflação acumulada, receita acumulada |
| `np.where(cond, a, b)` | se/senão vetorial | ajustar série com condição, sem laço |

Também funcionam como métodos: `fat.sum()`, `fat.mean()` — a Aula trata ambos, mas o
método é o idiomático para agregação.

Duas propriedades dos acumulados que valem o preço da leitura:

- `np.cumsum` em cima dos totais mensais dá a **receita acumulada do ano** — o gráfico
  que a diretoria pede para ver "como caminhamos até a meta".
- `np.cumprod(1 + i)` sobre as variações do IPCA dá o **índice de preços** — a base do
  deflator desta aula. Não faça `cumprod` sobre os percentuais diretamente: o produto
  exige os **fatores** `(1 + i)`, nunca os `i`.

### 2.2 Broadcasting: as regras

Dois arrays compatíveis podem operar juntos mesmo com shapes diferentes. As regras
comparam as dimensões **da direita para a esquerda**; cada par é compatível se:

1. são iguais, **ou**
2. uma delas é `1` (essa dimensão se estica), **ou**
3. o array menor não tem essa dimensão (completa com `1` à esquerda).

Nosso caso central:

```
fat       (6, 36)     faturamento nominal, 6 filiais × 36 meses
fator     (36,)       fator de deflação de cada mês
fator     (1, 36)     NumPy completa à esquerda → compatível com (6, 36)
real      = fat * fator   → (6, 36): cada coluna multiplicada pelo seu fator
```

Um erro comum: se o deflator tivesse shape `(36,)` mas a matriz fosse `(36, 6)`
(meses nas **linhas**), `fat * fator` ainda funcionaria — mas aplicaria a cada **linha**
o fator de um mês único, resposta sem sentido. Quando o eixo não cooperar,
reordenar primeiro: `fat.T`, ou `fator[:, None]` para transformar `(36,)` em `(36, 1)`.

Tabela de memo para shapes no dia a dia:

| Operação | Shapes | Resultado |
|---|---|---|
| `fat + vetor_filiais` | `(6, 36)` + `(6,)` | **falha** — o `(6,)` vira `(1, 6)` e não casa com 36 |
| `fat + vetor_filiais[:, None]` | `(6, 36)` + `(6, 1)` | `(6, 36)` — soma o ajuste da filial em todos os meses |
| `fat * fator` | `(6, 36)` * `(36,)` | `(6, 36)` — cada mês com seu fator |
| `fat * fator[:, None]` | `(6, 36)` * `(36, 1)` | `(6, 36)` com **meses nas linhas** |

A primeira linha da tabela é o `ValueError` mais comum do NumPy — e a correção é
sempre a mesma: alinhar o eixo com `[:, None]` ou transpor com `.T`.

### 2.3 Deflator do IPCA (a construção que o notebook segue)

Do CSV do BCB (SGS 433, `%` mensal com vírgula decimal), chamando $i_t$ a variação
mensal (em decimal) do mês $t$:

1. **Índice acumulado**: $I_t = \prod_{k \le t} (1+i_k)$ — com `np.cumprod(1 + i)`.
2. **Fator de deflação** para trazer o mês $t$ a reais de jul/2026 (o último):
   $$\text{fator}_t = \frac{I_{36}}{I_t}$$
   `fator = idx[-1] / idx`. O fator do último mês é exatamente 1; meses anteriores
   têm fator > 1 (ex.: ago/2023 ≈ 1,146 — inflação de ~14,6% entre lá e cá).
   **Multiplicar, não dividir**: os preços subiram entre $t$ e a data-base, então
   R$ 1,00 do mês $t$ vale mais que R$ 1,00 de hoje.
3. **Série real**: `real = fat * fator` (broadcasting) — cada mês **multiplicado** pelo fator
   que o traz a reais de hoje.

Verificação de sanidade: a inflação acumulada do período é $(I_{36}/I_0) - 1 ≈ 14,8\%$,
e o fator do primeiro mês deve ficar ≈ 1,146. No notebook, o crescimento real do
período fica em ~**9,9%** contra ~26% nominal — é esse número que justifica a frase
"cresceu nominal, engatinhou em real" para a rede como um todo.

Nota de leitura de dados: o IPCA do CSV chega como texto com vírgula (`"0,26"`) —
`pd.read_csv(sep=";", decimal=",")` resolve; e a coluna de datas do BCB vem em
`dd/mm/aaaa`, exigindo `pd.to_datetime(..., dayfirst=True)`. Sem `dayfirst`, o dia
vira mês e o índice sai ordenado errado — o `sort_values("data")` do notebook é a
segunda camada de proteção.

### 2.4 Agregações e `axis`

`fat.sum()`, `.mean()`, `.std()`, `.min()`, `.max()`, `.quantile()` (via
`np.quantile`) resumem o array. O parâmetro `axis` escolhe a direção da agregação —
decorar pelo **shape do resultado**:

| Chamada | Shape de saída | Leitura |
|---|---|---|
| `fat.sum()` | escalar | total geral da rede nos 36 meses |
| `fat.sum(axis=0)` | `(36,)` | um número **por mês** (somou as 6 filiais) |
| `fat.sum(axis=1)` | `(6,)` | um número **por filial** (somou os 36 meses) |

Mnemônico: *axis = a direção que a operação atravessa e elimina*. `axis=0` atravessa
as linhas (colapsa as filiais), sobra o mês. Para total mensal da rede, `axis=0`.

Combinado com o broadcasting, o par `(axis=0, axis=1)` cobre as quatro perguntas do
fechamento mensal: total geral, total por mês, total por filial e ranking. O notebook
usa ainda `np.quantile(fat, 0.25, axis=1)` e `np.quantile(fat, 0.75, axis=1)` — a
amplitude interquartílica por filial resume a dispersão sem sofrer com o outlier da
safra de novembro.

### 2.5 Máscaras booleanas

Uma comparação devolve um array de `True/False`; usá-lo como índice filtra:

```python
fat[tot_mensal > meta_rede]        # colunas (meses) em que a rede bateu a meta
fat[5][fat[5] < 100_000]           # meses em que a Catalão faturou < R$ 100 mil
filiais_sel = fat[(fat < 100_000).any(axis=1)]   # linhas com ao menos 1 mês < piso
```

Combinar condições com `&` (e), `|` (ou), `~` (não) — **sempre com parênteses**,
porque `&` tem precedência sobre `>`. Erro clássico:
`fat[fat > 1e6 & fat < 2e6]` → `TypeError`; o correto é
`fat[(fat > 1e6) & (fat < 2e6)]`.

Contagens rápidas: `(cond).sum()` conta os `True`; `(cond).mean()` dá a proporção.
Três funções que acompanham as máscaras:

| Função | Pergunta que responde |
|---|---|
| `mask.any(axis=1)` | "houve **algum** mês ruim nesta filial?" |
| `mask.all(axis=1)` | "**todos** os meses foram bons nesta filial?" |
| `mask.argmax()` / `mask.argmin()` | "**qual a posição** do melhor/pior mês?" |

No notebook: 27 de 36 meses ficam acima da meta de R$ 3,8 mi para a rede; e
`fat[5] < 100_000` marca **8 meses** da Catalão (mínimo ≈ R$ 88,8 mil) — as demais
filiais nunca caem abaixo do piso.

### 2.6 Loop vs vetorizado

Aplicar 216 fatores com laço aninhado custa, em Python puro, dezenas de vezes mais
que `fat * fator` — e a versão vetorial tem **zero chance** do bug do índice trocado.
`%timeit` no notebook compara as duas formas sobre a mesma tarefa (`out[i, j] =
mat[i, j] * fac[j]` vs `mat * fac`) e fecha com `np.allclose(...)` — True. A regra de
contratação que resume a aula: o candidato que escreve laço para aplicar 216 fatores
não está errado; está apenas 40× mais lento e 10× mais propenso a erro.

## 3. Roteiro do notebook (`a08_numpy_ufuncs_broadcasting.ipynb`)

| Seção | O que ver | O que observar |
|---|---|---|
| 1. Recriar o faturamento | mesma matriz `fat` da Aula 07 (rng 42) | shape (6, 36) — continuidade entre aulas |
| 2. Ufuncs elementares | reajuste 5%, `np.maximum`, `np.round` | ufunc atua em todo o array de uma vez |
| 3. IPCA e deflator | `pd.read_csv(sep=';', decimal=',')`, `cumprod`, `idx[-1]/idx` | `fator[0] ≈ 1,146`; `fator[-1] = 1,000` |
| 4. Broadcasting | `real = fat * fator` | uma linha para 216 fatores diferentes |
| 5. Agregações | `mean/std/sum/min/max` com `axis=0` e `axis=1` | total mensal da rede; ranking de filiais |
| 6. Máscaras | meses acima da meta; filiais < R$ 100 mil | `(fat[5] < 100_000).sum()` = 8 meses da Catalão |
| 7. Loop vs vetorizado | `%timeit` nas duas versões | vetorização vence por dezenas de vezes |
| 8. Exercícios | 4 exercícios | faça antes de olhar `# SOLUÇÃO` |
| 9. Resumo | recap e referências | — |

Números de referência que você deve saber reconhecer ao rodar (janela ago/2023 →
jul/2026, semente 42): inflação acumulada ≈ **14,84%**; fator de ago/2023 ≈ **1,1458**;
crescimento da rede nominal ≈ **26%**, real ≈ **10%**; 27 meses acima da meta de rede;
8 meses da Catalão abaixo do piso; pior mês da rede = **09/2023** (~R$ 3,54 mi).
Se algum desses sair disparado, a primeira suspeita é a ordem dos meses no deflator.

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| `ValueError: operands could not be broadcast` | shapes incompatíveis (ex.: `(6, 36)` com `(6,)`) | alinhar eixos: `fat.T`, ou `vetor[:, None]` |
| Deflator aplicado na direção errada | eixo dos meses não é o que você acha | confirmar com `fat.shape`; meses devem ficar no **eixo 1** |
| Série real cresce MAIS que a nominal | fator aplicado com divisão em vez de multiplicação | o fator para a data-base **multiplica**; `fator[-1]` deve ser 1 |
| `fator[-1]` diferente de 1,000 | ordem dos meses invertida ao montar o índice | ordenar por data antes do `cumprod` |
| `TypeError: unsupported operand type(s) for &` | `&` sem parênteses com comparações | `fat[(a) & (b)]` — sempre parentetizar |
| Máscara devolveu cópia e você alterou "a original" | indexação booleana copia | alterar via `np.where(cond, novo, fat)` ou sobre o recorte copiado |
| IPCA lido como texto `"0,26"` | faltou `decimal=','` no `read_csv` | `pd.read_csv(sep=';', decimal=',')` |
| `KeyError: 'data'` no `to_datetime` | esqueceu `dayfirst=True` (dd/mm/aaaa do BCB) | `pd.to_datetime(col, dayfirst=True)` |
| `cumprod` deu número gigante sem sentido | produto sobre percentuais (`i`) em vez de fatores (`1+i`) | `np.cumprod(1 + infl_mensal)` |
| Média real "melhora" com o tempo | fator aplicado invertido (dividiu em vez de multiplicar, ou usou `idx` em vez de `idx[-1]/idx`) | conferir que `fator[0] > 1` e `fator[-1] == 1`; real deve ser mais **plano** que nominal |

## 5. Glossário

| Termo (en) | Em português | Significado |
|---|---|---|
| ufunc | função universal | operação elemento a elemento vetorizada em C |
| broadcasting | difusão | regras que permitem operar arrays de shapes diferentes |
| deflator | deflator | fator que converte valor nominal em real de uma data-base |
| real vs nominal | — | corrigido pela inflação vs valores da época |
| data-base | — | data em que todos os valores passam a valer (aqui: jul/2026) |
| axis | eixo | direção da agregação; `axis=0` colapsa filiais, `axis=1` colapsa meses |
| boolean mask | máscara booleana | array True/False usado para filtrar |
| cumprod | produto acumulado | índice de preços a partir das variações mensais |
| aggregation | agregação | reduzir um eixo a um número (`sum`, `mean`…) |
| quantile | quantil | valor abaixo do qual está dada fração dos dados |
| interquartile range | amplitude interquartílica | q75 − q25; dispersão robusta a outliers |
| `np.allclose` | — | comparação numérica tolerante entre dois arrays |

## 6. Referências

- `kb/02_vanderplas_python_data_science_handbook/05_chapter-2-introduction-to-numpy.md`
  — VanderPlas, Cap. 2: seções "Computation on Arrays: Universal Functions",
  "Aggregations" e "Comparisons, Masks, and Boolean Logic"; "Broadcasting" no fim do
  capítulo.
- `kb/01_mckinney_python_for_data_analysis/06_chapter-4-numpy-basics-arrays-and-vectorized-computation.md`
  — McKinney, Cap. 4: ufuncs e vetorização na prática.
- `kb/01_mckinney_python_for_data_analysis/14_chapter-12-advanced-numpy.md`
  — McKinney, Cap. 12: broadcasting e layout interno do ndarray (leitura de aprofundamento).

## 7. Gabarito comentado

**E1 — Deflacionar na mão (para entender o broadcasting).** Levar apenas a
Goiânia Campinas (linha 0) a reais de jul/2026 com um laço `for` sobre os 36 fatores
e, em seguida, com uma única operação vetorizada:

```python
goiania_real_loop = np.empty(36)
for j in range(36):
    goiania_real_loop[j] = fat[0, j] * fator[j]      # 1 fator por mês, laço explícito

goiania_real_vec = fat[0] * fator                     # ufunc + broadcasting (1-D)
np.allclose(goiania_real_loop, goiania_real_vec)      # True: são iguais
```

O laço não está errado — está lento e verboso. `np.allclose` é a forma profissional
de conferir que duas rotinas (a ingênua e a vetorizada) concordam; em produção,
compara-se assim antes de aposentar o código antigo. A média real da Goiânia Campinas
sai no print do notebook; compare com a média nominal (a diferença é o efeito da
inflação de ~14,8% comprimindo o passado).

**E2 — Meta anual de 2025.** Total nominal do ano civil 2025 (meses de índice 17 a 28
na janela ago/2023→jul/2026: jan/2025 = mês 17, dez/2025 = mês 28):

```python
print("janela pedida:", meses[17], "->", meses[28])   # jan/2025 -> dez/2025
fat_2025 = fat[:, 17:29]                # 12 meses de 2025, todas as filiais
total_2025 = fat_2025.sum()
brl(total_2025)
```

Confira o índice: ago/2023 é o mês 0, logo jan/2024 é 5, jan/2025 é 17 e dez/2025 é
28 — a fatia `17:29` tem exatamente 12 colunas (o `print` do gabarito mostra
`01/2025 -> 12/2025` antes de somar). Contar índices de calendário à mão é exatamente
o tipo de tarefa que, em produção, se resolve uma vez e transforma em vetor de
rótulos (o pandas da Semana 5 resolve isso com índice de datas). O total de 2025 fica
na casa de **R$ 50 milhões** — o número a checar é a ordem de grandeza, não o centavo.

**E3 — Mês mais fraco da rede.** Encontrar, entre os 36 totais mensais
(`tot = fat.sum(axis=0)`), o pior mês e o valor dele:

```python
tot = fat.sum(axis=0)
pior_mes = tot.argmin()               # POSIÇÃO do mínimo, não o valor
print("pior mês da rede:", meses[pior_mes], "-", brl(tot[pior_mes]))
```

`argmin` devolve a **posição** do mínimo, não o valor — o erro comum é chamar
`.min()` achando que descobre o mês. Executando: **09/2023**, com ~**R$ 3,54 milhões**
— o primeiro mês completo da janela, quando a rede ainda estava na base menor.

**E4 — Filiais persistentemente abaixo do piso.** Usar `axis=1` para achar, por
filial, o **pior mês** e filtrar as que têm algum mês abaixo de R$ 100 mil:

```python
pior_mes_filial = fat.min(axis=1)                    # menor mês de cada filial
abaixo_do_piso = fat[(fat < 100_000).any(axis=1)]    # linhas (filiais) selecionadas
filiais_abaixo = [f for f, p in zip(filiais, pior_mes_filial) if p < 100_000]
filiais_abaixo
```

`.any(axis=1)` pergunta "algum mês desta filial ficou abaixo?", devolvendo um booleano
de shape `(6,)` que indexa as linhas. A lista com `zip(filiais, ...)` só traduz os
índices de volta para nomes — e confirma o esperado: apenas a **Catalão** tem meses
abaixo do piso de R$ 100 mil (8 meses, mínimo ≈ R$ 88.797). O recorte
`abaixo_do_piso` tem shape `(1, 36)`: uma linha, 36 meses.