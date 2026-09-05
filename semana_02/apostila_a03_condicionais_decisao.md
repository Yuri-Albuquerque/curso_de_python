# Apostila Aula 03 — Condicionais: `if/elif/else` e `match/case`
> Curso Python para Economistas — OIKOS/UEG · Semana 2

---

## 1. Por que isso importa (intuição econômica)

Toda consultoria econômica vive de **regras de decisão**. Quando a OIKOS analisa o risco de
crédito de um cliente PME, o analista não "sente" o risco: ele aplica uma política escrita —
*se o score for maior ou igual a 700, categoria A, taxa de 1,9% ao mês; se estiver entre 450
e 699, categoria B, taxa de 3,4%; abaixo disso, categoria C, taxa de 6,2%*. Essa frase, em
Python, é um `if/elif/else`. Programar condicionais é transformar a política de crédito da
empresa em código que decide igual — para todos os clientes, sempre, sem esquecer nenhum caso.

O mesmo vale para tributos. Dizer "o cliente é do Simples Nacional, então a carga efetiva é
aproximadamente 5% da receita" é outra regra de decisão — mas aqui a variável é uma
**categoria** (regime tributário, setor CNAE), não um número contínuo. Para regras de
decisão por categoria, o Python 3.10+ tem uma estrutura dedicada e mais legível: o
`match/case`. Ele é o "porteiro de setores" do código: recebe um valor e o encaminha para o
ramo correspondente, como uma mesa de entrada que distribui processos por área.

Note o padrão econômico por trás dos dois exemplos: **faixas contínuas viram categorias**
(score → A/B/C; faturamento → regime) e **categorias viram parâmetros** (categoria → taxa de
juro; regime → carga tributária). É o mesmo movimento que fazemos ao montar uma tabela de
preços por faixa de consumo de energia, ou ao classificar municípios por porte para escolher
a metodologia de pesquisa. A habilidade técnica é sempre a mesma: escrever a regra de modo
que o computador aplique sem exceções manuais.

Nesta aula você vai escrever as regras de decisão que serão reutilizadas em todo o curso:
classificar clientes por score, definir taxa por categoria, escolher regime tributário e
mapear setor CNAE. Na Aula 04, vamos colocar essas regras **dentro de laços** para processar
uma carteira inteira de uma vez. Aprender a decidir vem antes de aprender a repetir.

---

## 2. Teoria essencial

### 2.1 Comparações produzem booleanos

Todo operador relacional devolve `True` ou `False` (`bool`):

| operador | significado | exemplo | resultado |
|---|---|---|---|
| `==` | igual a | `cambio == 5.12` | `True` se câmbio for 5,12 |
| `!=` | diferente de | `regime != "simples"` | `True` se regime não for Simples |
| `>` | maior que | `score > 700` | — |
| `<` | menor que | `score < 450` | — |
| `>=` | maior ou igual | `score >= 700` | — |
| `<=` | menor ou igual | `divida <= 0.5` | — |

Cuidados que custam caro:

- **`=` atribui, `==` compara.** `score = 700` guarda o valor; `score == 700` pergunta.
- **Comparação de `float` com `==` é frágil.** `0.1 + 0.2 == 0.3` devolve `False`
  (aritmética binária). Para dinheiro, compare com margem: `abs(a - b) < 0.01`.
- **Comparação é encadeável**: `450 <= score < 700` equivale a
  `(450 <= score) and (score < 700)` — e é a forma mais legível.
- **Tipos diferentes não se comparam bem**: `"700" > 450` gera `TypeError` no Python 3.
  Score vindo de planilha geralmente chega como texto — converta antes com `int()`/`float()`.

### 2.2 Operadores lógicos: `and`, `or`, `not`

Combinam condições. A política de crédito real quase nunca depende de um único critério:

| expressão | resultado |
|---|---|
| `A and B` | `True` só se **as duas** forem `True` |
| `A or B` | `True` se **pelo menos uma** for `True` |
| `not A` | inverte: `True` vira `False` |

Duas propriedades úteis:

- **Precedência**: `not` vem antes de `and`, que vem antes de `or`. Em dúvida, use parênteses.
- **Avaliação preguiçosa (short-circuit)**: em `A and B`, se `A` é `False`, `B` nem é avaliada.
  Útil para "guardar" a segunda condição: `score >= 450 and divida <= 0.5`.

Tradução da política de crédito combinada para código:

$$\text{aprovado} = \lnot\,\text{negativado} \;\wedge\; \big[(s \ge 650 \land d \le 0{,}5) \lor (s \ge 700 \land g)\big]$$

em que $s$ é o score, $d$ a dívida/receita e $g$ a existência de garantia. Note como cada
operador lógico da fórmula tem correspondente direto em Python:

| fórmula | Python |
|---|---|
| $\lnot\,\text{negativado}$ | `not negativado` |
| $\land$ | `and` |
| $\lor$ | `or` |
| $s \ge 650 \land d \le 0{,}5$ | `score >= 650 and divida_receita <= 0.5` |

Tabela-verdade resumida (grave as linhas em negrito do `and`):

| `A` | `B` | `A and B` | `A or B` | `not A` |
|---|---|---|---|---|
| `True` | `True` | `True` | `True` | `False` |
| `True` | `False` | `False` | `True` | `False` |
| `False` | `True` | **`False`** | `True` | `True` |
| `False` | `False` | `False` | **`False`** | `True` |

Em consultoria: `and` = *exigência cumulativa* (precisa de score E de garantia); `or` =
*caminhos alternativos de aprovação* (entra por esta regra OU por aquela).

### 2.3 `if / elif / else`

Estrutura para classificar o score em categoria de risco:

$$
\text{categoria}(s)=
\begin{cases}
A, & s \ge 700 \\
B, & 450 \le s < 700 \\
C, & s < 450
\end{cases}
$$

```python
if score >= 700:
    categoria = "A"
elif score >= 450:
    categoria = "B"   # só chega aqui se score < 700
else:
    categoria = "C"
```

Regras de ouro:

1. **Ordem importa.** O Python testa de cima para baixo e para no primeiro ramo verdadeiro.
   Por isso o `elif score >= 450` funciona sem o limite superior: já sabemos que `score < 700`.
2. **Indentação define o bloco.** 4 espaços. Tudo que está dentro do `if` roda só se a
   condição for verdadeira.
3. **O `else` é o "coringa"** — captura tudo que sobrou. Use-o para o caso residual, não
   para uma faixa específica que você quis nomear.
4. `elif` é opcional e pode se repetir quantas vezes a política exigir.
5. **Um único `else` no fim.** Dois `else` para o mesmo `if` é erro de sintaxe.

Faixas de referência usadas no notebook (política ilustrativa de capital de giro PJ):

| categoria | score (0–1000) | taxa mensal | leitura econômica |
|---|---|---|---|
| A | ≥ 700 | 1,9% | risco baixo —Spread apertado |
| B | 450–699 | 3,4% | risco médio —Spread intermediário |
| C | < 450 | 6,2% | risco alto —Spread compensa inadimplência esperada |

### 2.4 Expressão condicional (ternária)

Quando só há dois caminhos e você quer **atribuir um valor**, a ternária cabe numa linha
(McKinney, Apêndice — *Ternary Expressions*):

```python
categoria = "A" if score >= 700 else "B"
rotulo = "caro" if preco > referencia else "barato"
```

Regra de bom senso: ternária para escolher **valores**; `if/elif/else` em bloco para
escolher **ações** (várias linhas). Ternária aninhada demais vira código ilegível.

Exemplo econômico típico — sinalização em relatório:

```python
status = "convergiu" if abs(erro) < 1e-6 else "iterando"  # volta na Aula 04
```

### 2.5 `match/case` (Python 3.10+)

O `match` compara um valor contra **padrões**, em ordem, e executa o primeiro que casa:

```python
match regime:
    case "simples":
        carga = 0.05
    case "presumido":
        carga = 0.085
    case "real":
        carga = None  # depende da margem de lucro — ver notebook
    case _:
        carga = None  # coringa: regime desconhecido
```

Recursos que usaremos:

- **Alternativas com `|`**: `case "A" | "B" | "C":` casa qualquer uma.
- **Coringa `case _`**: o `else` do `match`. Sempre o deixe por último — e sempre o escreva.
- **Guarda (`if`) no padrão**: `case (_, fat) if fat <= 4_800_000:` casa a tupla só se o
  faturamento respeitar o limite. Perfeito para limites legais, como o teto do Simples
  Nacional (R$ 4,8 milhões em 2026).

O exemplo do notebook usa tuplas `(regime, faturamento)` — o `match` desempacota o padrão
`case ("simples", fat)` e a guarda decide se o faturamento cabe no teto legal.

Quando usar cada um? `if/elif` para faixas numéricas (score, receita); `match/case` para
**categorias nomeadas** (regime, seção CNAE, uf) e combinações de valores.

### 2.6 Truthiness (verdade escondida)

Valores "vazios" são falsos em contexto booleano: `0`, `0.0`, `""`, `[]`, `{}`, `None`.
Por isso `if lista:` significa "se a lista não estiver vazia". Conveniente, mas evite
escrever `if x == True` — é redundante e menos pythônico.

Cuidado econômico clássico: `if carga:` é `False` quando `carga == 0` — e uma carga
tributária de 0% é um dado legítimo (isenção). Se "zero" é informação, teste explícito:
`if carga is None:` para "sem dado" e `if carga == 0:` para "isento".

### 2.7 Aninhamento e legibilidade

Condições podem viver dentro de condições, mas cada nível de aninhamento custa legibilidade.
Prefira **achatar** com `and`:

```python
# aninhado — funciona, mas exige leitura em camadas
if score >= 450:
    if divida_receita <= 0.5:
        aprovado = True

# achatado — mesma lógica, leitura única
if score >= 450 and divida_receita <= 0.5:
    aprovado = True
```

Check-list antes de entregar uma regra de decisão ao orientador da OIKOS:

1. Todas as faixas estão cobertas? (o `else`/`case _` garante o "sobrou")
2. A ordem vai do caso mais restritivo ao mais geral?
3. Comparação de dinheiro usa margem em vez de `==` exato?
4. Dados sujos (regime inexistente, score texto) têm destino definido?
5. Os nomes dizem o que significam (`taxa_mensal`, não `tm`)?

---

## 3. Roteiro do notebook

O notebook `a03_condicionais_decisao.ipynb` segue este mapa — cada seção tem uma célula
markdown com a intuição e células de código curtas. Execute de cima a baixo.

| seção | o que faz | o que observar |
|---|---|---|
| 1. Operadores relacionais | comparações com score, câmbio e Selic | comparação devolve `bool`; encadeamento `450 <= score < 700` |
| 2. Operadores lógicos | regra de crédito combinada | parênteses resolvem a precedência; short-circuit economiza avaliação |
| 3. `if/elif/else` | classificação A/B/C e taxa por categoria | ordem dos ramos; `else` como coringa; prévia do `for` na carteira |
| 4. `match/case` — regimes tributários | Simples, Presumido, Real | padrões literais; guarda com faturamento (limite R$ 4,8 mi) |
| 5. `match/case` — setores CNAE | letras de seção → descrição | alternativas com `\|`; `case _` obrigatório por último |
| 📝 Exercícios | 4 exercícios com solução | tente antes de abrir a solução |
| 📌 Resumo | recapitulação e para casa | referências da KB |

Nomes de variáveis que você vai reencontrar (e na apostila/gabarito): `score`, `categoria`,
`taxa_mensal`, `divida_receita`, `garantia`, `negativado`, `regime`, `carga`, `secao`,
`carteira`.

Onde esta aula se encaixa no curso: a política de crédito da Seção 3 volta na Aula 04 dentro
de laços (processar a carteira inteira), na Aula 05 vira **função** reutilizável
(`classificar_cliente(score)`) e, muito depois, na Aula 13 vira coluna de um DataFrame
(`np.select`/`pd.cut` — a versão vetorizada dos mesmos `if`s).

---

## 4. Erros comuns e diagnóstico

| erro | causa provável | correção |
|---|---|---|
| `SyntaxError` | usou `=` no lugar de `==` numa condição | `if score == 700:` — `=` só atribui |
| `IndentationError: expected an indented block` | esqueceu de indentar o corpo do `if` | 4 espaços após `:` |
| `IndentationError: unexpected indent` | indentou linha que não pertence ao bloco | alinhar com o bloco pai |
| `SyntaxError` no `match` | Python < 3.10, ou `case` fora de `match` | conferir versão (`sys.version`); `case` só dentro do bloco |
| `TypeError: '>' not supported between ...` | comparou número com `None` ou string (`"700"`) | converter tipo antes (`float(...)`) ou garantir valor default |
| Condição nunca `True` | comparou `float` com `==` exato (`0.1+0.2 == 0.3`) | comparar com margem: `abs(a - b) < 0.01` |
| Categoria sempre errada | faixas em ordem trocada (testou `>= 450` antes de `>= 700`) | ordenar do ramo mais restritivo ao mais geral |
| `NameError` no `match` | variável do `match` não definida antes | definir `regime = "simples"` antes do bloco |
| Ramo do `case _` executando sempre | coringa não ficou por último | `case _` sempre por último |
| `KeyError` nos exercícios | chave do dicionário com nome diferente do esperado | conferir grafia: `"divida_receita"` ≠ `"divida"` |
| Isenção tratada como "sem dado" | testou truthiness (`if carga:`) com valor 0 | testar `if carga is None:` quando "zero" é dado legítimo |

Diagnóstico rápido: imprima a condição isolada antes do `if` (`print(score >= 700)`).
Se o `bool` impresso está certo mas o ramo errado roda, o problema é a ordem dos ramos.
Se o `bool` impresso está errado, o problema está na comparação (tipo, valor ou `=`/`==`).

---

## 5. Glossário

| termo (pt) | termo (en) | significado |
|---|---|---|
| condicional | conditional | estrutura que executa código dependendo de uma condição |
| operador relacional | comparison operator | `==`, `!=`, `>`, `<`, `>=`, `<=` — devolve `bool` |
| operador lógico | boolean operator | `and`, `or`, `not` |
| expressão ternária | ternary / conditional expression | `x if cond else y` numa linha |
| ramo | branch | bloco executado quando a condição casa |
| correspondência de padrões | pattern matching | mecanismo do `match/case` |
| guarda | guard | condição extra num padrão: `case x if x > 0` |
| coringa | wildcard | `case _` — casa com qualquer valor |
| faixa | band / range | intervalo de valores de uma categoria (ex.: score 450–699) |
| score de crédito | credit score | nota 0–1000 de risco do bureau |
| curto-circuito | short-circuit | segunda condição não avaliada quando a primeira já decide |
| seção CNAE | CNAE section | letra que agrupa atividades econômicas (A = agropecuária…) |
| carga tributária | tax burden | tributos como % da receita |
| regime tributário | tax regime | Simples Nacional, Lucro Presumido, Lucro Real |
| spread bancário | lending spread | diferença entre taxa de juro cobrada e custo do funding |
| inadimplência esperada | expected default | probabilidade × perda dado default, embutida na taxa |
| política de crédito | credit policy | conjunto de regras que define aprovação e precificação |
| carteira de clientes | client portfolio | conjunto de clientes ativos analisado em bloco |

---

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/15_appendix-python-language-essentials.md`
  — McKinney (2012), **Apêndice: Python Language Essentials**; seções *The Basics*
  (comparações, `if`, expressões ternárias) e *Data Structures and Sequences*.
- Livro: Wes McKinney, *Python for Data Analysis*, 2012, O'Reilly — Apêndice A
  (Python Language Essentials).
- Documentação oficial (leitura opcional): tutorial de controle de fluxo e
  PEP 634 (Structural Pattern Matching) — Python 3.10+.
- Aula anterior (revisar): `semana_01/apostila_a02_sintaxe_tipos_variaveis.md`.
- Próxima aula: `semana_02/apostila_a04_lacos_comprehensions.md` — as regras desta aula
  dentro de laços.

---

## 7. Gabarito comentado

Soluções dos exercícios do notebook `a03_condicionais_decisao.ipynb`. Tente antes de olhar.

### Exercício 1 — Classificar a carteira por score

```python
# SOLUÇÃO 1
scores = [812, 464, 735, 291, 503]

for i, score in enumerate(scores, start=1):   # enumerate: Aula 04
    if score >= 700:
        categoria = "A"
        taxa_mensal = 0.019
    elif score >= 450:
        categoria = "B"
        taxa_mensal = 0.034
    else:
        categoria = "C"
        taxa_mensal = 0.062
    print(f"Cliente {i}: score {score} → categoria {categoria} | taxa {taxa_mensal:.2%} a.m.")
```

Saída esperada:

```
Cliente 1: score 812 → categoria A | taxa 1.90% a.m.
Cliente 2: score 464 → categoria B | taxa 3.40% a.m.
Cliente 3: score 735 → categoria A | taxa 1.90% a.m.
Cliente 4: score 291 → categoria C | taxa 6.20% a.m.
Cliente 5: score 503 → categoria B | taxa 3.40% a.m.
```

Comentário: as faixas seguem a política A (≥ 700), B (450–699) e C (< 450), com taxas de
capital de giro PJ de 1,9%, 3,4% e 6,2% ao mês. O `elif` funciona sem limite superior porque
os ramos são testados em ordem. O `for`/`enumerate` será formalizado na Aula 04 — aqui é só
uma prévia para aplicar a regra à carteira inteira.

### Exercício 2 — Regra combinada de aprovação

```python
# SOLUÇÃO 2
clientes = [
    {"nome": "Distribuidora Araguaia", "score": 672, "divida_receita": 0.48, "garantia": False, "negativado": False},
    {"nome": "Laticínios Serra Dourada", "score": 715, "divida_receita": 0.75, "garantia": True,  "negativado": False},
]

for c in clientes:
    aprovado = (
        not c["negativado"]
        and ((c["score"] >= 650 and c["divida_receita"] <= 0.5)
             or (c["score"] >= 700 and c["garantia"]))
    )
    print(f"{c['nome']}: {'APROVADO' if aprovado else 'REPROVADO'}")
```

Saída esperada:

```
Distribuidora Araguaia: APROVADO
Laticínios Serra Dourada: APROVADO
```

Comentário: `not` vem primeiro, parênteses isolam o `or`. A primeira cliente entra pela
regra de score médio com dívida controlada; a segunda entra pela regra de score alto **com**
garantia, mesmo endividada. É exatamente a fórmula da Seção 2.2 da apostila.

### Exercício 3 — Carga tributária estimada por regime

```python
# SOLUÇÃO 3
empresas = [
    {"nome": "Empório Cerrado", "regime": "simples", "faturamento": 2_400_000},
    {"nome": "Transportadora Anhanguera", "regime": "presumido", "faturamento": 12_000_000},
    {"nome": "Agroindustrial Vale do Araguaia", "regime": "real", "faturamento": 90_000_000},
]

for e in empresas:
    match e["regime"]:
        case "simples":
            carga = 0.05          # alíquota efetiva típica (Anexo I, ilustrativa)
        case "presumido":
            carga = 0.085         # IRPJ+CSLL+PIS/COFINS presunção, comércio
        case "real":
            carga = 0.065         # depende da margem; margem baixa → carga menor
        case _:
            carga = None
    print(f"{e['nome']}: carga estimada {carga:.1%}" if carga else f"{e['nome']}: regime não cadastrado")
```

Saída esperada:

```
Empório Cerrado: carga estimada 5.0%
Transportadora Anhanguera: carga estimada 8.5%
Agroindustrial Vale do Araguaia: carga estimada 6.5%
```

Comentário: valores aproximados e ilustrativos para comércio/serviços — o ponto didático é a
estrutura do `match`, não a tabela fiscal. Repare que o `case _` protege contra regimes fora
da lista (dado sujo de planilha é comum).

### Exercício 4 — Setores CNAE com `match`

```python
# SOLUÇÃO 4
secoes = ["A", "G", "J", "F", "X"]

for secao in secoes:
    match secao:
        case "A":
            setor = "Agropecuária / extração vegetal"
        case "B" | "C" | "D" | "E":
            setor = "Indústria e extração mineral"
        case "F":
            setor = "Construção"
        case "G":
            setor = "Comércio"
        case "H" | "I" | "J" | "K" | "L" | "M" | "N":
            setor = "Serviços"
        case _:
            setor = "Seção inválida"
    print(f"Seção {secao}: {setor}")
```

Saída esperada:

```
Seção A: Agropecuária / extração vegetal
Seção G: Comércio
Seção J: Serviços
Seção F: Construção
Seção X: Seção inválida
```

Comentário: `|` agrupa letras sem repetir o `case`. O `X` cai no coringa — comportamento
seguro para dados sujos. Em projetos reais, mapeie CNAE por tabela (`dict`), que veremos na
Aula 04 com *dict comprehension*.

---

*Material didático — Empresa Júnior OIKOS (UEG), Ciências Econômicas. Uso interno em aula.*