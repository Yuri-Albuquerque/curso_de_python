# Apostila Aula 04 — Laços: `for`, `while` e Comprehensions
> Curso Python para Economistas — OIKOS/UEG · Semana 2

---

## 1. Por que isso importa (intuição econômica)

Quase todo problema econômico é uma **repetição com memória**. Um saldo devedor não salta
daqui a um ano: ele cresce mês a mês, cada mês sobre o mês anterior. Uma carteira de
clientes não é um cliente: são dezenas de PMEs que precisam da *mesma* regra de crédito
aplicada, uma a uma. Um mercado não encontra o equilíbrio por decreto: compradores e
vendedores reajustam preço após preço até que oferta e demanda se encontrem. Copiar-e-colar
o mesmo `if` doze vezes, ou cinquenta vezes, funciona — até você precisar mudar a regra e
esquecer a terceira cópia. O laço (`for`, `while`) escreve a regra **uma** vez e manda o
computador repetir quantas vezes o problema pedir.

A segunda metade da aula introduz a marca registrada do Python: as **comprehensions**.
Quando o que você quer é *transformar uma lista em outra* — deflacionar doze preços
nominais pelo IPCA, converter uma série de US$/bushel para R$/saca — uma list
comprehension faz em uma linha o que o laço fazia em quatro. McKinney chama as
comprehensions de "um dos recursos mais amados da linguagem" (Apêndice, *List, Set, and
Dict Comprehensions*). Não é estética: é a forma como economistas pensam — *aplique esta
transformação a cada observação* — escrita do jeito que se lê.

E há um terceiro padrão, menos visível mas onipresente: **repetir até convergir**. Modelos
de ajuste de preço (a "teia de aranha" do milho e da soja, onde o plantio de hoje decide o
preço da colheita), métodos iterativos de solução de equações, expectativas que aprendem —
todos pedem um `while` com critério de parada numérico (erro menor que 1e-6) e um guarda de
segurança (limite de iterações). A Aula 04 fecha a "gramática de controle" aberta na Aula
03: decisão (`if`) + repetição (`for`/`while`) = qualquer rotina de consultoria. Da Aula 07
em diante, a repetição passa a ser vetorizada (NumPy/pandas), e você entenderá *por quê*.

---

## 2. Teoria essencial

### 2.1 O laço `for`: iterar sobre uma coleção

O `for` percorre os elementos de uma coleção (lista, tupla, `dict`, string…) um a um
(McKinney, Apêndice — *for loops*):

```text
for variavel in colecao:
    # corpo: roda uma vez POR ELEMENTO
```

Regras de ouro:

1. **Indentação define o corpo** — 4 espaços, como no `if`.
2. A variável do laço (`mes`, `c`, `preco`…) é criada e **sobrescrita a cada volta**;
   escolha nomes que digam o que ela é.
3. Qualquer **iterável** serve: lista, tupla, string, `range`, arquivo, coluna de DataFrame.
4. O corpo pode ter quantas linhas quiser — inclusive `if/elif/else` completos (Aula 03).

Três acompanhantes indispensáveis:

| recurso | o que faz | exemplo |
|---|---|---|
| `range(a, b)` | inteiros de `a` até `b-1` (12 meses = `range(1, 13)`) | `for mes in range(1, 13):` |
| `enumerate(seq, start=1)` | devolve `(índice, elemento)` — contador grátis | `for i, c in enumerate(carteira, start=1):` |
| `zip(a, b)` | percorre duas sequências em paralelo | `for pn, pi in zip(precos, ipcas):` |

E o **desempacotamento**: se cada elemento é uma tupla/lista, o `for` desempacota direto —
`for nome, score in [("Distribuidora Araguaia", 812), ...]:`. Sem índices manuais.

### 2.2 `for` aplicado: juros compostos mês a mês

A fórmula fechada do juro composto resume 12 multiplicações:

$$S_T = S_0\,(1+i_m)^T$$

A computação iterada reconstrói essa fórmula passo a passo — e é a forma que generaliza
para aportes, retiradas e taxas que mudam no meio do caminho (onde a fórmula fechada falha):

$$S_{t+1} = S_t \times (1 + i_m)$$

**De onde vem a taxa mensal?** A Selic está cotada ao ano (13,9% a.a. em setembro/2026 —
confira em `data/csv/selic_diaria_aa.csv`). Mas o saldo cresce **mensalmente**. A conversão
correta é geométrica, não dividir por 12:

$$i_m = (1 + i_a)^{1/12} - 1 = 1{,}139^{1/12} - 1 \approx 1{,}0905\% \;\text{a.m.}$$

Dividir 13,9 por 12 (≈ 1,158%) **superestima** o juro mensal — erro típico de quem ignora a
capitalização composta. Com $i_m$ correto, R$ 1.000 viram R$ 1.139,00 em 12 meses — exatamente
+13,9%, como manda a taxa anual.

Quanto tempo para **dobrar**? Resolver $S_0(1+i_m)^T = 2S_0$ dá $T = \ln 2 / \ln(1+i_m)
\approx 63{,}9$ meses ≈ 5,3 anos. A regra do 72 (dividir 72 pela taxa anual: $72/13{,}9
\approx 5{,}2$ anos) é a aproximação de expediente que todo economista carrega.

### 2.3 `while`: repetir até a condição virar `False`

O `for` repete sobre uma coleção finita. O `while` repete **enquanto** uma condição for
verdadeira — o loop do economista modelador (McKinney, Apêndice — *while loops*):

```text
while condicao:
    # corpo — DEVE, em algum momento, tornar condicao falsa
```

O uso econômico central é a **convergência iterativa**. Exemplo: o modelo da teia de
aranha (*cobweb*) para um mercado agrícola. O plantio se decide com o preço **do ano
anterior** — a oferta reage com defasagem:

$$Q^d_t = a - b\,P_t \qquad Q^s_t = c + d\,P_{t-1}$$

Igualando (a oferta de hoje responde ao preço que o produtor observou; a demanda se realiza
no preço novo) e isolando o preço, obtém-se a dinâmica:

$$P_{t+1} = \frac{a - c}{b} - \frac{d}{b}\,P_t$$

Com $a = 100$, $b = 2$, $c = -20$, $d = 1$: $P_{t+1} = 60 - 0{,}5\,P_t$, equilíbrio
$P^* = 40$. Itera-se até o preço praticamente parar de se mover:

$$\lvert P_{t+1} - P_t \rvert < \varepsilon, \quad \varepsilon = 10^{-6}$$

Duas proteções obrigatórias em todo `while` de convergência:

1. **Tolerância explícita** (`1e-6`): "convergiu" não é intuição, é critério numérico
   declarado — e a comparação de `float` usa margem, nunca `==` (Aula 03).
2. **Teto de iterações** (`max_iter = 100`): se o modelo não converge, o laço para e
   **reporta** — silêncio infinito é pior que erro visível.

Quando a convergência acontece? A dinâmica da teia de aranha converge se a oferta for
*menos elástica que a demanda em valor absoluto* — $\lvert d/b \rvert < 1$. Com oferta mais
reativa ($d \ge b$), o preço entra em ciclo (ou explode): o famoso ciclo do porco e do milho
que Oscilava o agro americano nos anos 1930 e que ainda descreve ciclos de plantio em
commodities. O teto de iterações não é burocracia — é o diagnóstico do modelo.

### 2.4 `break` e `continue`: sair e pular

Dentro de qualquer laço:

| comando | efeito | uso típico na consultoria |
|---|---|---|
| `continue` | pula para a **próxima** volta, descartando o resto do corpo | dados sujos: `None`, valor negativo, linha incompleta |
| `break` | **encerra o laço inteiro** na hora | meta atingida antes do prazo; item procurado já encontrado |

`continue` é o filtro de qualidade de dados: uma receita `None` (não informada) não é zero —
é ausência de dado, e entra na soma só depois de tratada. `break` é o critério de parada
antecipado: se o saldo atinge a meta no mês 38, não há razão para iterar até 120.

Ambos vêm direto do Apêndice de McKinney (*for loops*: "skip the remainder of the block"
→ `continue`; "exited altogether" → `break`).

### 2.5 List comprehensions: transformar uma coleção em uma linha

Forma geral (McKinney, Apêndice):

```python
[expressao for elemento in colecao if condicao]
```

Equivale exatamente a:

```python
resultado = []
for elemento in colecao:
    if condicao:
        resultado.append(expressao)
```

Exemplos econômicos da aula:

```python
# deflacionar preços nominais pelo IPCA mensal (zip percorre as duas listas juntas)
precos_reais = [pn / (1 + pi) for pn, pi in zip(precos_nominais, ipca_mensal)]

# converter US$/bushel de soja para R$/saca de 60 kg (1 bu = 27,216 kg)
precos_sc = [usd * 60 / 27.216 * cambio for usd in precos_usd]

# filtrar a carteira: clientes categoria A
clientes_A = [c["cliente"] for c in carteira if c["score"] >= 700]
```

Regras de bom senso:

- Comprehension é para **construir uma lista/dict/set**. Se o corpo tem efeito colateral
  (imprimir, acumular em duas variáveis), use `for` normal.
- A condição (`if`) é opcional — filtro; a expressão é a transformação.
- Comprehension aninhada demais perde a legibilidade que é sua razão de existir.

**Deflação**, a transformação mais pedida em consultoria: o preço nominal de $t$ só é
comparável entre meses se dividido pelo índice de preços:

$$P^{real}_t = \frac{P^{nom}_t}{1 + \pi_t}$$

em que $\pi_t$ é o IPCA **do mês** em decimal (0,46% → 0.0046).

**Câmbio e unidade**: 1 bushel de soja = 27,216 kg; a saca de 60 kg então custa

$$R\$/sc_{60} = \frac{US\$}{bu} \times \frac{60}{27{,}216} \times \text{câmbio}$$

Com soja a US$ 12,90/bu e câmbio a 5,1253 (valores de set/2026): US$ 12,90 × 60/27,216 ×
5,1253 ≈ **R$ 145,76/sc** — a conta que o produtor goiano faz toda semana.

### 2.6 Dict e set comprehensions

Mesma sintaxe, chaves próprias. O dict comprehension constrói **tabelas de mapeamento** —
a forma que a Aula 03 prometeu para substituir cadeias de `match` quando a tabela cresce:

```python
i_m = 0.0109   # taxa mensal equivalente à Selic de 13,9% a.a. (set/2026)

# juros acumulados por prazo de investimento
juros_acumulados = {n: (1 + i_m) ** n - 1 for n in [1, 3, 6, 12]}

# mapa seção CNAE -> grande setor (a promessa da Aula 03 cumprida)
cnae_mapa = {"A": "Agropecuária", "F": "Construção", "G": "Comércio", "J": "Informação"}
cnae_mapa.get("X", "Seção inválida")   # .get com default: dado sujo não quebra o código
```

Chaves repetidas em dict comprehension **sobrescrevem silenciosamente** (a última ganha) —
quando construir o mapa por comprehension, garanta que cada chave apareça uma vez.

### 2.7 Generators: iteração preguiçosa (mencionados)

Uma *generator expression* tem a sintaxe da list comprehension com parênteses:

```python
juros = ((1 + i_m) ** n - 1 for n in [1, 3, 6, 12])
next(juros)      # entrega UM valor por chamada, sob demanda
sum(juros)       # consumível uma única vez (esgotou, esgotou)
```

O gerador é **preguiçoso** (*lazy*): não calcula nada até ser pedido — ideal para
sequências longas (séries diárias de 10 anos) sem alocar a lista inteira na memória.
No dia a dia de consultoria, `list comprehension` resolve 95% dos casos; o gerador entra
quando a sequência é grande demais para ficar na memória. Voltaremos a eles em séries
temporais (Aula 17).

### 2.8 Laço puro vs. comprehension vs. vetorizado

Cronometre a soma de 100 mil números (célula do notebook):

| forma | tempo típico | observação |
|---|---|---|
| `for` com acumulador | ~3–4 ms | a forma mais lenta |
| `sum()` (função nativa, em C) | ~2 ms | laço "de graça" |
| `numpy` `.sum()` (Aula 07) | ~0,03 ms | ~100× mais rápido |

O ponto didático: o laço explícito é a ferramenta **didática**, não a rápida. A partir da
Aula 07 (NumPy) e da Aula 09 (pandas), transformações de séries inteiras passam a ser
vetorizadas — mas todo vetorizado que você escrever lá vai exigir exatamente o raciocínio
de laço que você aprendeu hoje.

---

## 3. Roteiro do notebook

O notebook `a04_lacos_comprehensions.ipynb` segue este mapa — cada seção abre com uma célula
markdown de intuição e células de código curtas (uma ideia por célula). Execute de cima a
baixo no kernel `oikos_py`.

| seção | o que faz | o que observar |
|---|---|---|
| 1. O laço `for` | regra de crédito da A03 na carteira inteira; juros compostos de R$ 1.000 a 1,0905% a.m. × 12 | o saldo iterado bate com a fórmula fechada (R$ 1.139,00); `enumerate` numerando a tabela |
| 2. `while` + convergência | dobra de capital; teia de aranha $P_{t+1} = 60 - 0{,}5P_t$ até erro < 1e-6 | 64 meses para dobrar (regra do 72: 5,2 anos); teia converge em $P^* = 40$ em 26 iterações; oferta mais elástica → não converge |
| 3. Comprehensions | deflacionar preços (IPCA), converter soja US$→R$/sc, filtrar categoria A, dict comp de juros e de CNAE, generator, timing | mesma transformação em 1 linha; `zip` para duas listas; laço puro é o mais lento |
| 4. `break`/`continue` | limpar receitas com `None`/negativo; `break` na meta de R$ 1.500 | `None` ≠ 0; o `break` corta no mês 38 |
| 📝 Exercícios | 4 exercícios com solução | tente antes de abrir a solução |
| 📌 Resumo | recapitulação e para casa | referências da KB |

Nomes de variáveis que você vai reencontrar na apostila e no gabarito: `i_aa`, `i_m`,
`saldo`, `saldos`, `mes`, `carteira`, `p`, `p_novo`, `erro`, `tol`, `max_iter`,
`historico`, `precos_nominais`, `ipca_mensal`, `precos_reais`, `precos_usd`, `cambio`,
`cnae_mapa`, `juros_acumulados`.

Onde esta aula se encaixa: a regra de crédito da Aula 03 agora roda em laço; na Aula 05 ela
vira **função** (`classificar_cliente(score)`) e o `while` de convergência volta em
solutores numéricos (VPL/TIR, Aula 15). Comprehensions aparecem em toda manipulação de
dados a partir da Aula 09 — e o `np.sum` do timing vira o padrão a partir da Aula 07.

---

## 4. Erros comuns e diagnóstico

| erro | causa provável | correção |
|---|---|---|
| `IndentationError: expected an indented block` | corpo do `for`/`while` não indentado | 4 espaços após `:` |
| `NameError` na variável acumuladora | usou `saldo +=` sem inicializar antes do laço | inicializar antes: `saldo = 0.0` |
| Laço infinito (`while`) | a variável da condição nunca é atualizada dentro do laço | atualizar no corpo; colocar teto `max_iter` |
| Convergência "travada" (sempre 100 iterações) | modelo divergente (teia com $\lvert d/b \rvert \ge 1$) ou tolerância abaixo da precisão do `float` | checar a estabilidade do modelo; tolerância realista (1e-6) |
| 12 iterações viram 11 (ou 13) | `range(1, 12)` para em 11; `range(13)` começa em 0 | 12 meses = `range(1, 13)` — teste o primeiro e o último `mes` |
| `TypeError: 'float' object is not callable` | esqueceu o `*`: `saldo(1 + i_m)` | `saldo * (1 + i_m)` |
| Comprehension devolve lista vazia | filtro nunca é verdadeiro (comparou unidade errada, ex.: R$ com US$) | testar a condição em um elemento antes |
| Chave do dict "sumiu" | dict comprehension com chave repetida — a última sobrescreve | garantir chaves únicas; conferir com `len(d)` |
| `print(gen)` mostra `<generator object ...>` | gerador é preguiçoso: imprimir não avalia | consumir: `list(gen)`, `next(gen)`, `sum(gen)` |
| `break` não funciona na comprehension | comprehension não aceita `break`/`continue` | usar `for` normal ou filtro `if` |
| `ValueError` no `zip` silencioso | listas de tamanhos diferentes — `zip` para na menor | conferir `len()` das duas; alinhar os períodos |
| `continue` pulando mais do que devia | `continue` dentro de `if` sem `else` descarta linhas válidas | revisar a condição; imprimir o que está sendo pulado |

Diagnóstico rápido: coloque um `print` **dentro** do laço imprimindo a variável que muda
(`saldo`, `p`, `erro`). Se ela não muda, o laço é infinito; se muda na direção errada, o
sinal do passo está invertido; se oscila sem parar, o modelo diverge — o laço está certo,
o modelo é que precisa de revisão.

---

## 5. Glossário

| termo (pt) | termo (en) | significado |
|---|---|---|
| laço | loop | estrutura que repete um bloco de código |
| iterar | iterate | percorrer elemento por elemento |
| iterável | iterable | objeto que pode ser percorrido (lista, `range`, string…) |
| laço determinado | definite loop | `for` — sabe-se quantas voltas |
| laço condicional | indefinite loop | `while` — repete até a condição falhar |
| acumulador | accumulator | variável que guarda o resultado parcial (`saldo`, `total`) |
| desempacotamento | unpacking | `for nome, score in pares:` — extrai campos de tuplas |
| list comprehension | list comprehension | `[expr for x in col if cond]` — constrói lista em 1 linha |
| dict comprehension | dict comprehension | `{chave: valor for x in colecao}` |
| set comprehension | set comprehension | `{expr for x in colecao}` — conjunto sem repetição |
| gerador | generator | objeto que produz valores sob demanda (*lazy*) |
| expressão geradora | generator expression | `(expr for x in colecao)` |
| avaliação preguiçosa | lazy evaluation | calcular só quando o valor é pedido |
| `break` | break | encerra o laço imediatamente |
| `continue` | continue | pula para a próxima iteração |
| convergência | convergence | sequência que se aproxima de um valor-limite |
| tolerância | tolerance | erro máximo aceito como "convergiu" ($\varepsilon = 10^{-6}$) |
| teia de aranha | cobweb model | modelo de preço com oferta defasada (plantio × colheita) |
| equilíbrio de mercado | market equilibrium | preço em que $Q^d = Q^s$ ($P^*$) |
| juros compostos | compound interest | juro que rende sobre juro: $S_{t+1} = S_t(1+i)$ |
| capitalização | compounding | frequência com que o juro é incorporado (mensal, anual) |
| deflacionar | deflate | dividir preço nominal pelo índice de preços |
| número índice | index number | base de comparação de preços (IPCA, IGP-M) |
| vetorização | vectorization | operação sobre a série inteira sem laço explícito |
| carteira | portfolio | conjunto de clientes/ativos processados em bloco |

---

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/15_appendix-python-language-essentials.md`
  — McKinney (2012), **Apêndice: Python Language Essentials**; seções *The Basics*
  → **for loops** (inclui `continue`/`break`), **while loops**, **List, Set, and Dict
  Comprehensions** e **Generators** (em *Functions*).
- `kb/02_vanderplas_python_data_science_handbook/04_chapter-1-ipython-beyond-normal-python.md`
  — VanderPlas, Cap. 1 (list comprehensions e a discussão loop vs. vetorizado).
- Livros: Wes McKinney, *Python for Data Analysis*, 2012, O'Reilly — Apêndice A;
  Jake VanderPlas, *Python Data Science Handbook* — Cap. 1.
- Documentação oficial (leitura opcional): tutorial de controle de fluxo
  (`for`/`while`/`break`/`continue`) e PEP 289 (generator expressions).
- Aula anterior (revisar): `semana_02/apostila_a03_condicionais_decisao.md` — os `if`s que
  hoje entram nos laços.
- Próxima aula: `semana_03/apostila_a05_funcoes_excecoes.md` — a regra de crédito vira
  função reutilizável.

---

## 7. Gabarito comentado

Soluções dos exercícios do notebook `a04_lacos_comprehensions.ipynb`. Tente antes de olhar.

### Exercício 1 — Juros compostos com aporte mensal

```python
# SOLUÇÃO 1
saldo = 1_000.0     # saldo inicial
aporte = 200.0      # depósito todo mês

for mes in range(1, 25):                 # 24 meses = range(1, 25)
    saldo = saldo * (1 + i_m) + aporte   # capitaliza PRIMEIRO, aporta DEPOIS

print(f"Saldo final: {brl(saldo)}")
```

Saída esperada:

```
Saldo final: R$ 6.750,29
```

Comentário: a ordem dentro do laço importa — **capitaliza primeiro, aporta depois** (o
aporte do mês também rende no mês seguinte). Sem os aportes, os mesmos R$ 1.000 renderiam
apenas R$ 1.297,32 em 24 meses: os R$ 4.800 aportados viraram ~R$ 5.453 de patrimônio. É o
mesmo laço da Seção 1 com uma linha a mais — e é assim que se constroem simulações de
aposentadoria. Na Aula 15 (VPL/TIR) essa acumulação reaparece com desconto.

### Exercício 2 — Teia de aranha: outro mercado, mesma convergência?

```python
# SOLUÇÃO 2
p = 30.0            # preço inicial (fora do equilíbrio)
tol = 1e-6
max_iter = 100

for it in range(1, max_iter + 1):
    p_novo = 90 - 0.5 * p     # Qd = 80 - P ; Qs = -10 + 0.5 P(t-1)
    erro = abs(p_novo - p)
    p = p_novo
    if erro < tol:
        break

print(f"Convergiu para P* = {p:.6f} em {it} iterações (erro final = {erro:.2e})")
```

Saída esperada:

```
Convergiu para P* = 60.000000 em 27 iterações (erro final = 8.94e-07)
```

Comentário: a dinâmica é $P_{t+1} = 90 - 0{,}5P_t$ (demanda $Q^d = 80 - P$, oferta
$Q^s = -10 + 0{,}5P_{t-1}$), com equilíbrio $P^* = 60$. Como o coeficiente de ajuste é
0,5 (oferta menos elástica que demanda), a convergência é geométrica e leva ~27 iterações
partindo de $P_0 = 30$ — o mesmo padrão do notebook. Se a oferta fosse mais elástica que a
demanda, o `for` terminaria nas 100 iterações sem convergir: o teto de iterações é o
diagnóstico do modelo, não um detalhe de programação.

### Exercício 3 — Soja: de US$/bushel para R$/saca, com filtro

```python
# SOLUÇÃO 3
precos_usd = [12.10, 12.45, 12.90, 13.20]   # US$/bushel (CBOT, ilustrativo)
cambio = 5.1253                             # R$/US$ (BCB-SGS 1, 04/09/2026)

precos_sc = [usd * 60 / 27.216 * cambio for usd in precos_usd]
caros = [usd * 60 / 27.216 * cambio for usd in precos_usd if usd > 12.50]

print("R$/sc de todos: ", [round(v, 2) for v in precos_sc])
print("R$/sc acima de US$ 12,50:", [round(v, 2) for v in caros])
```

Saída esperada:

```
R$/sc de todos:  [136.72, 140.67, 145.76, 149.15]
R$/sc acima de US$ 12,50: [145.76, 149.15]
```

Comentário: a conversão tem três camadas — unidade (60 kg ÷ 27,216 kg/bu), moeda (× câmbio)
e filtro (`if usd > 12.50`). O `if` dentro da comprehension substitui o `continue` do laço:
as linhas que não passam no filtro simplesmente não entram na lista nova. Em produção, o
preço do bushel viria de `data/csv/soja_cbot_usd_bushel.csv` e o câmbio de
`usdbrl_diario.csv` — a estrutura da comprehension não mudaria.

### Exercício 4 — Tabela de carga tributária com dict comprehension

```python
# SOLUÇÃO 4
cargas = {
    "simples":   0.05,    # alíquota efetiva típica (ilustrativa)
    "presumido": 0.085,   # IRPJ+CSLL+PIS/COFINS sobre presunção
    "real":      0.065,   # depende da margem efetiva
}

for regime in ["simples", "presumido", "real", "mei"]:
    carga = cargas.get(regime)
    rotulo = f"{carga:.1%}" if carga is not None else "regime não cadastrado"
    print(f"{regime:10s} -> {rotulo}")
```

Saída esperada:

```
simples    -> 5.0%
presumido  -> 8.5%
real       -> 6.5%
mei        -> regime não cadastrado
```

Comentário: o dict substitui a escada de `match` da Aula 03 quando a tabela cresce — cada
regime é uma linha de dados, não um ramo de código. O `.get(regime)` devolve `None` para o
"mei" (que não está na tabela) **sem quebrar** — e o teste `if carga is not None`
distingue "sem dado" de "isento" (carga 0% é dado legítimo; lembrete da Aula 03 sobre
truthiness). Para *construir* tabelas assim em uma linha, use dict comprehension — como
fizemos com o mapa CNAE no notebook.

---

*Material didático — Empresa Júnior OIKOS (UEG), Ciências Econômicas. Uso interno em aula.*