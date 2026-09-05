# Apostila Aula 07 — NumPy: Arrays e Indexação

> Curso Python para Economistas — OIKOS/UEG · Semana 4 · Aula 07 (50 min)

## 1. Por que isso importa (intuição econômica)

Imagine a planilha de faturamento de uma trading do agro goiano: 6 filiais
(Goiânia Campinas, Goiânia Bueno, Anápolis, Rio Verde, Jataí, Catalão) e 36 meses de
histórico. São 216 números — uma matriz 6 × 36. Com o que você aprendeu até a Semana 3,
para converter todo o faturamento a reais de hoje você escreveria dois laços `for`
aninhados, com índice `i` para filial e `j` para mês. Funciona. Mas cada linha do laço
paga o preço de ser código Python interpretado, e o erro clássico — atualizar a lista
enquanto itera sobre ela, ou confundir índice de linha com de coluna — aparece justo
quando a planilha cresce.

NumPy resolve isso mudando a pergunta. Em vez de "como faço o laço?", pergunta-se
"qual operação quero aplicar a **todos** os elementos?". Reajustar todo o faturamento
em 5%? `fat * 1.05`. Ficar só com os meses de safra? `fat[:, mes_safra]`. A matriz
inteira é o objeto; o laço acontece dentro do NumPy, em código compilado em C.

Há também um motivo econômico direto: **NumPy não copia dados à toa**. Quando você faz
`ultimo_semestre = fat[:, -6:]`, o NumPy não duplica os 36 valores — ele cria uma
*view*: outra janela apontando para os mesmos números na memória. Economista que lida
com séries grandes (microdados da POF, séries diárias do BCB desde 2010) precisa saber
quando está olhando a mesma memória por outra janela e quando fez uma cópia de verdade.
Modificar uma view sem perceber altera a matriz original — e corrompe a análise sem
nenhuma mensagem de erro.

Por fim, a questão da reprodutibilidade. Vamos **simular** o faturamento das filiais
(não temos acesso à planilha real da empresa fictícia). Simular com uma semente fixa
(`rng = np.random.default_rng(42)`) garante que você, o instrutor e o colega da frente
gerem exatamente os mesmos 216 números. Análise que não se reproduz não é análise —
é anedota. Esse hábito (sempre fixar a semente) vale para todo o resto do curso:
amostragem na POF, simulações de portfólio, validação de modelos.

## 2. Teoria essencial

### 2.1 Lista vs `ndarray`: a mesma tabela, dois motores

Uma lista Python é um arranjo de **ponteiros** para objetos espalhados pela memória:
cada elemento carrega tipo, contagem de referências e overhead. Um `ndarray` é um
bloco **contíguo de memória** com um único `dtype` — a matriz é lida como o processador
gosta de ler: em rajada. Duas consequências:

1. **Velocidade**: a soma de 1 milhão de números via `sum(range(10**6))` perde,
   tipicamente, de 30 a 100 vezes para `np.sum(np.arange(10**6))`. No notebook medimos
   com `%timeit`: a soma em lista fica na casa de **milissegundos**, a do NumPy na casa
   de **microssegundos** — o laço existe nos dois casos, só que no NumPy ele roda em C.
2. **Homogeneidade**: NumPy não mistura `"soja"` e `12.9` no mesmo array de números.
   O `dtype` é uma decisão (e uma economia de memória).

O custo de memória também é diferente. Um array de 1 milhão de `float64` ocupa
`arr.nbytes` = 8.000.000 bytes ≈ 8 MB, mais alguns bytes de *header*. A lista
equivalente passa de 30 MB (cada `float` Python custa ~24 bytes + o ponteiro de 8).
Com a POF 2017-18 (dezenas de milhares de domicílios × centenas de variáveis), essa
diferença decide se o seu notebook roda ou estoura a RAM.

Regra prática do economista: dados tabulares com uma coluna de texto viram
`pandas` (Semana 5). Matriz pura de números que vai entrar em conta, deflator,
regressão — `ndarray`.

### 2.2 Criação de arrays

| Função | O que faz | Uso típico no curso |
|---|---|---|
| `np.array([[...], [...]])` | de lista (de listas) | montar a matriz de faturamento |
| `np.arange(36)` | inteiros 0…35, passo 1 | índice de meses |
| `np.linspace(0, 1, 37)` | 37 pontos igualmente espaçados, `endpoint` incluído | eixo de tempo suave, grid de taxas |
| `np.zeros((6, 36))` | matriz 6 × 36 de zeros | alocar resultado antes de preencher |
| `np.ones(6)` | vetor de uns | pesos iguais entre filiais |
| `np.full((6, 36), 100_000.0)` | matriz constante | a meta mensal de cada filial |
| `rng = np.random.default_rng(42)` | gerador moderno, semente fixa | simular faturamento plausível |
| `rng.normal(0, 0.05, (6, 36))` | ruído normal (média 0, desvio 5%) | choques mensais de receita |

Diferença `arange` vs `linspace`: `np.arange(0, 1, 0.1)` **exclui** o fim e sofre de
acúmulo de erro com passos fracionários; `np.linspace(0, 1, 11)` inclui o fim e conta
o número de pontos. Para eixos de tempo com datas, prefira `linspace` ou o pandas.

Sobre a semente: `default_rng(42)` garante que você, o colega e o instrutor gerem
**exatamente os mesmos números**. Sem semente, nenhuma análise é reproduzível —
pecado em trabalho que será auditado. Note que o notebook também roda
`np.random.seed(42)` no setup: é a semente da API antiga, mantida por compatibilidade;
o código novo deve usar `default_rng` (a API `np.random.X` global é considerada
legado).

Nossa matriz de faturamento nasce de uma decomposição clássica de séries de receita:

$$\text{fat}_{i,m} = \underbrace{\text{base}_i}_{\text{tamanho}} \cdot \underbrace{(1+g_i)^m}_{\text{tendência}} \cdot \underbrace{s_{m}}_{\text{sazonalidade}} \cdot \underbrace{(1+\varepsilon_{i,m})}_{\text{ruído}}$$

com $s_m = 1{,}06$ nos meses de safra (nov–dez) e $\varepsilon \sim N(0, 0{,}05^2)$.
O notebook constrói isso com `base[:, None] * tendencia * sazonalidade * (1 + ruido)`
— sem um único laço.

### 2.3 `dtype`: o tipo único da matriz

`fat.dtype` costuma ser `float64` — 64 bits por número, ~15 dígitos de precisão.
Inteiro aparece em contagens (`np.arange(36).dtype == int64`); cuidado apenas com a
**divisão verdadeira**: `5 // 2` dá `2`, `5 / 2` dá `2.5`, e NumPy segue o mesmo
código. Para converter de propósito, use `fat.astype(np.float64)` (casting explícito).
`fat.astype(int)` **trunca** (R$ 98.999,70 → 98999) — quase sempre indesejado em
valores monetários.

| dtype | O que guarda | Quando usar |
|---|---|---|
| `float64` | real com ~15 dígitos | padrão para dinheiro, índices, taxas |
| `int64` | inteiro | contagens: nº de notas, nº de domicílios |
| `bool` | `True`/`False` | máscaras (Aula 08) |
| `object` | qualquer Python | **evitar** — perde a velocidade do NumPy |

Dois detalhes que poupam horas:

- `fat / 0` não levanta erro: devolve `inf` (ou `nan` para 0/0) **com um
  `RuntimeWarning`**. Em bases monetárias, procure `np.isinf`/`np.isnan` depois de
  qualquer divisão arriscada.
- Somar `float64` pequenos em cima de um valor grande acumula erro de ponto flutuante;
  para comparar resultados de duas rotinas, use `np.allclose(a, b)` — nunca `a == b`.

### 2.4 Indexação e slicing

A sintaxe é a da lista, estendida a duas dimensões `fat[linha, coluna]`:

```python
fat[0, 0]        # elemento: filial 0, mês 0
fat[0]           # linha inteira: a filial 0 em todos os meses (36 valores)
fat[:, 0]        # coluna inteira: mês 0 em todas as filiais (6 valores)
fat[:, :12]      # primeiro ano (todas as linhas, meses 0–11)
fat[:, -12:]     # último ano
fat[::2, ::6]    # filiais alternadas, a cada 6 meses (subamostragem)
fat[::-1]        # linhas em ordem reversa
fat[[0, 2, 4]]   # fancy indexing: filiais 0, 2 e 4 (linhas não contíguas)
```

Regra de leitura: `:` = "todos", `a:b` = "de a até b−1", `a:b:p` = "com passo p",
`-1` = "o último". Índices negativos contam do fim — útil para "últimos 12 meses",
pergunta que o analista faz toda segunda-feira.

Calendário da nossa matriz: o mês de índice 0 é **ago/2023** e o 35 é **jul/2026**.
Contas rápidas de índice: jan/2024 = mês 5, jan/2025 = mês 17, dez/2025 = mês 28,
jul/2026 = mês 35. O notebook gera rótulos `"mmm/aaaa"` num array `meses` para que
você possa traduzir índice em calendário sem fazer conta de cabeça:

```python
mes_num = np.arange(36)
ano = 2023 + (7 + mes_num) // 12          # ago/2023 é o mês 0
mes_do_ano = ((7 + mes_num) % 12) + 1
meses = np.array([f"{m:02d}/{a}" for m, a in zip(mes_do_ano, ano)])
```

Fancy indexing vs slicing: `fat[[0, 2, 4]]` seleciona linhas fora de sequência e
**devolve uma cópia**; `fat[0:6:2]` seleciona as mesmas linhas em sequência e
**devolve uma view**. Mesmo resultado na leitura, comportamento totalmente diferente
na escrita — a Seção 2.5 vive disso.

### 2.5 Views vs cópias: o ponto crítico da aula

**Slicing básico devolve uma view.** Uma view não guarda números: guarda
*onde* os números estão (deslocamento, forma, passos — os *strides*). Duas
consequências:

```python
janela = fat[:, -6:]     # view dos últimos 6 meses
janela[0, 0] = -1.0      # ⚠ ALTERA fat[0, 30] — a matriz original mudou
print(fat[0, 30])        # -1.0: o faturamento de ago/2026 "virou" negativo
```

Quando a vista é útil: renomear as mesmas colunas para todas as linhas, zerar um
pedaço, corrigir um furo — de propósito. Quando é armadilha: você recortou um
período para analisar, e uma atribuição dentro do recorte corrompeu a série inteira.

**Cópia explícita**: `janela = fat[:, -6:].copy()`. Custa memória, compra isolamento.
Regra do curso: *recortou para transformar de forma independente? `.copy()`.*
Teste rápido de procedência: `fat.base is None` — cópias "raízes" têm `base None`;
views apontam para um array pai.

Fancy indexing (`fat[[0, 2, 4]]` — selecionar filiais não contíguas) e máscara booleana
**devolvem cópias**, não views. O perigo é o slice simples.

O notebook demonstra o ciclo completo: contaminar → restaurar → recortar com
`.copy()` → conferir que a original ficou intacta. Guarde a sequência; ela é o
diagnóstico que você fará um dia num código alheio (ou no seu, às 23h da véspera
da entrega).

### 2.6 Fórmulas úteis (variáveis que usaremos)

Crescimento composto mensal de uma filial com taxa $g$ ao longo de $m$ meses:

$$\text{fat}_{m} = \text{fat}_{0} \cdot (1+g)^{m}$$

Variação percentual mês a mês da rede:

$$g_{t} = \frac{\text{fat}_{t} - \text{fat}_{t-1}}{\text{fat}_{t-1}}$$

Meta: cada filial parte de `np.full((6, 36), 100_000)` — R$ 100 mil/mês por filial
como piso de desempenho no exercício. (A deflação pelo IPCA entra na Aula 08, onde o
fator $I_{36}/I_t$ **multiplica** os valores passados para levá-los à data-base.)

## 3. Roteiro do notebook (`a07_numpy_arrays_indexacao.ipynb`)

| Seção | O que ver | O que observar |
|---|---|---|
| 1. Lista vs ndarray | `%timeit`: `sum(range(10**6))` vs `np.sum(np.arange(10**6))` | a razão de velocidade (tipicamente ≥ 30×) |
| 2. Criando a matriz | `np.array`, `arange`, `linspace`, `zeros`, `full`, `default_rng(42)` | a matriz `fat` 6 × 36 nasce; `fat.shape` confirma (6, 36) |
| 3. dtype e casting | `.dtype`, `.astype`, efeitos da divisão | `astype(int)` trunca — veja o valor antes/depois |
| 4. Indexação/slicing | linhas, colunas, janelas, passo, reverso | `fat[:, -12:]` = último ano, sem laço |
| 5. Views vs cópias | demonstração de contaminação + `.copy()` | a linha `janela[0,0] = -1` muda a original; após `.copy()`, não muda |
| 6. Exercícios | 4 exercícios | faça antes de olhar `# SOLUÇÃO` |
| 7. Resumo | recap e referências | — |

Perguntas-guia para acompanhar cada seção (responda mentalmente antes de rodar a
célula seguinte):

1. Se eu dobrasse o número de filiais, qual linha do notebook quebraria? (Nenhuma —
   só `fat.shape` mudaria para `(12, 36)`.)
2. Por que `fat[5]` e `fat[5, :]` são a mesma coisa?
3. Onde exatamente a Seção 5 usaria `.copy()` se fosse para corrigir (e não só ler)?
4. Que valor `fat.base is None` devolve para uma cópia?

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| `IndexError: too many indices` | `fat[0, 0]` em array criado de lista simples (1-D) | monte com listas de listas ou use `fat[0][0]`/reshape |
| `IndexError: index 36 is out of bounds` | esqueceu que índice vai até `n−1` | use `fat.shape` antes; `fat[:, 35]` é o último mês |
| Modificar o recorte alterou a matriz original | slice devolveu **view** | `.copy()` no recorte; confira com `.base` |
| Números viraram inteiros sem decimais | `astype(int)` ou criação com ints | `dtype=float` na criação ou `astype(np.float64)` |
| `fat * 1.05` rodou, mas nada mudou | resultado não foi atribuído | `fat = fat * 1.05` (NumPy não altera no lugar por padrão) |
| Série de tempos em tempos difere entre colegas | gerador sem semente | `rng = np.random.default_rng(42)` sempre |
| `ufunc 'isnan' not supported` em array de moeda | array virou `object` (misturou texto) | mantenha o array numérico; texto fica no pandas |
| `a == b` entre dois arrays deu array de `True/False` | comparou elemento a elemento sem querer | para comparar arrays inteiros use `np.array_equal(a, b)` ou `np.allclose(a, b)` |
| `Setting an array element with a sequence` | tentou encaixar vetor de tamanho errado num slot | confira `shape` de ambos os lados da atribuição |

## 5. Glossário

| Termo (en) | Em português | Significado |
|---|---|---|
| array | arranjo / matriz | bloco contíguo de números com dtype único |
| shape | forma | tupla `(linhas, colunas)` — aqui `(6, 36)` |
| dtype | tipo de dado | como cada elemento é codificado (`float64`, `int64`) |
| stride | passo de memória | quantos bytes avançar para chegar ao próximo elemento |
| axis | eixo | direção da operação: `axis=0` desce as linhas, `axis=1` ao longo das colunas |
| view | visão | janela sobre a mesma memória; alterar altera o original |
| copy | cópia | memória nova, independente |
| slice | fatia | recorte `a:b` |
| fancy indexing | indexação avançada | seleção por lista de índices ou máscara (devolve cópia) |
| broadcasting | difusão | esticar um array menor para caber numa operação com um maior |
| vectorization | vetorização | substituir laços por operações sobre o array inteiro |
| seed | semente | número que torna a aleatoriedade reproduzível |
| ufunc | função universal | operação elemento a elemento do NumPy (`np.add`, `np.exp`, `np.sqrt`…) |
| casting | conversão de tipo | transformar dtype de propósito (`astype`) |
| truncation | truncamento | perda da parte fracionária — cuidado com `astype(int)` em dinheiro |

## 6. Referências

- `kb/02_vanderplas_python_data_science_handbook/05_chapter-2-introduction-to-numpy.md`
  — VanderPlas, *Python Data Science Handbook*, Cap. 2 (seções "The Basics of NumPy
  Arrays" e "Computation on Arrays"): criação, dtype, slicing, views, ufuncs.
- `kb/01_mckinney_python_for_data_analysis/06_chapter-4-numpy-basics-arrays-and-vectorized-computation.md`
  — McKinney, *Python for Data Analysis*, Cap. 4: ndarray na prática, casting,
  indexação, vetorização.

## 7. Gabarito comentado

**E1 — Janela de safra.** A matriz do notebook é `fat` (6 × 36, meses de ago/2023 a
jul/2026). Quer-se a média de faturamento da rede nos últimos 12 meses:

```python
ultimo_ano = fat[:, -12:]          # view; aqui só lemos, não alteramos
media_ultimo_ano = ultimo_ano.mean()
brl(media_ultimo_ano)
```

`: -12` pega todas as linhas (`:`) e os 12 meses finais. Como **só lemos**, a view é
segura — a alternativa `.copy()` seria defensiva, mas desnecessária. Se o exercício
pedisse *corrigir* os valores da janela, aí sim a cópia seria obrigatória antes.
Executando, o resultado fica próximo de **R$ 3,9 milhões/mês** (a rede cresce de ~R$ 3,7
mi no primeiro mês para ~R$ 4,6 mi no último; a média do ano final fica entre esses
valores, puxada para cima pela tendência e pela safra de nov–dez).

**E2 — Uma filial em mãos.** Faturamento completo da 4ª filial (Rio Verde, índice 3)
e a soma dos 36 meses:

```python
rio_verde = fat[3]                 # linha inteira (view de leitura)
total_rio_verde = rio_verde.sum()
brl(total_rio_verde)
```

`fat[3]` devolve a linha inteira porque NumPy completa o índice faltante com `:`
(é o mesmo que `fat[3, :]`). Erro clássico: escrever `fat[3, 0:36]` — funciona, mas é
ruído; `fat[3]` comunica a intenção ("a filial inteira"). O total da Rio Verde passa de
R$ 20 milhões nos 36 meses (base de R$ 430 mil/mês crescendo 0,6% a.m. mais safra).

**E3 — Meta mensal e comparativo.** Matriz de metas constantes e comparação
elemento a elemento:

```python
meta = np.full((6, 36), 100_000.0)
atingiu = fat > meta               # booleana 6 × 36: True = bateu a meta no mês
pct = atingiu.mean()               # fração de meses-filial com meta batida
print(f"{pct:.1%} dos meses-filial bateram a meta de R$ 100 mil")
```

`fat > meta` compara elemento a elemento e devolve um array booleano do mesmo shape —
o primeiro passo da máscara booleana que a Aula 08 explora a fundo. `.mean()` sobre um
booleano calcula a fração de `True` (True=1, False=0) — atalho elegante para
"percentual de cumprimento". Executando: **96,3%** — as 5 filiais maiores batem a meta
em todos os 36 meses; a Catalão, em 28 de 36.

**E4 — Cópia defensiva.** Recortar Catalão (índice 5), zerrar um mês errado **sem**
contaminar `fat`:

```python
catalao = fat[5].copy()            # SEM .copy(), a correção sujaria a matriz original
catalao[10] = 0.0                  # mês com nota fiscal emitida em duplicidade — zera
print(fat[5, 10])                  # intocado: a correção ficou isolada
```

Sem `.copy()`, `catalao[10] = 0.0` alteraria `fat[5, 10]` — o faturamento da Catalão
em jun/2024 desapareceria da base para sempre (bem, até rodar a célula de novo).
No print final, `fat[5, 10]` continua **R$ 117.585,04**. Este é o padrão profissional:
*recorte para corrigir ⇒ copie primeiro.*