# Apostila Aula 02 — Sintaxe Básica, Tipagem e Variáveis Econômicas
> Curso Python para Economistas — OIKOS/UEG · Semana 1

## 1. Por que isso importa (intuição econômica)

Todo trabalho do economista é transformar números: um IPCA mensal vira taxa
acumulada em 12 meses; um câmbio de ontem e de hoje viram variação percentual;
preços em dólar de soja e boi viram receita em reais. Em planilha, essas
transformações são fórmulas em células. Em Python, são **expressões sobre
valores guardados em variáveis**. A sintaxe da linguagem é a versão geral da
fórmula de planilha: mais verbosa na primeira vez, infinitamente mais potente
quando o problema cresce — 1 país vira 20, 1 mês vira 30 anos, 1 planilha vira
um painel de 5.000 domicílios da POF.

Os **tipos** importam porque cada grandeza econômica tem natureza diferente.
A quantidade de sacas é inteira (`int`); o preço é fracionário (`float`); o
município é texto (`str`), não número — somar código de município é absurdo; a
resposta "o projeto passa na TIR?" é verdadeiro/falso (`bool`). O Python exige
pouca declaração formal, mas o tipo governa o que se pode fazer com o valor:
dividir textos com `+` concatena, dividir inteiros com `/` dá float. Metade dos
erros de quem começa é de tipo, não de lógica.

Nesta aula construímos o vocabulário mínimo e já o aplicamos a números reais
do Brasil de 2026: câmbio ≈ R$ 5,1253/US$ (04/09/2026, BCB), IPCA mensal com
acumulado de 12 meses ≈ 4,44%, soja ≈ US$ 12,9/saca, salário mínimo de R$
1.518. Os exemplos são os mesmos que reaparecem no notebook — a leitura da
apostila é o "pré-relatório", a aula é o code-along.

## 2. Teoria essencial

### 2.1 Semântica da linguagem em 4 regras

Do Apêndice do McKinney (*Python Language Essentials*):

1. **Indentação define blocos** — o Python usa espaços em vez de chaves `{}`;
   o padrão da comunidade (e do curso) é **4 espaços** por nível.
2. **Tudo é objeto** — cada número, texto, lista e função é um objeto com tipo
   e métodos próprios; por isso `x.tipo_de_coisa()` funciona para quase tudo.
3. **Comentários** com `#`; o Python ignora o resto da linha. Comente decisões
   ("Selic de 13,9% a.a. = nível de set/2026"), não o óbvio.
4. **Case-sensitive e `=` é atribuição** — `selic` ≠ `Selic`; `=` guarda valor,
   `==` compara.

Variável é apenas um **nome** apontando para um valor (não uma "caixa com tipo
fixo"). Por isso dá para "reaproveitar" o nome com outro tipo:

```python
taxa = 0.0444      # float: acumulado IPCA 12 meses (set/2025→jul/2026)
taxa = "4,44% a.a."  # agora str — legal, mas cuidado: nomes devem significar algo
```

### 2.2 Tipos escalares essenciais

| Tipo | Exemplo econômico | Como o Python vê |
|---|---|---|
| `int` | sacas colhidas: 1.800; UF 52 (GO) | inteiro de precisão ilimitada |
| `float` | câmbio 5.1253; IPCA 0,07% a.m. | ponto flutuante 64 bits (dupla precisão) |
| `str` | "Goiânia"; "BCB-SGS 433" | texto imutável, entre `'...'` ou `"..."` |
| `bool` | `preco < custo` → False | `True`/`False`, resultado de comparações |
| `None` | dado faltante provisório | ausência de valor |

Conversões explícitas (`int()`, `float()`, `str()`) evitam surpresas — e a
principal surpresa é a **aritmética de ponto flutuante**: `0.1 + 0.2 == 0.3`
retorna `False`! Motivo: computador representa decimais em binário; `0.2`
não é exatamente 0,2. Consequência prática: **compare floats com tolerância**
(`abs(0.1 + 0.2 - 0.3) < 1e-9`) e formate valores para exibição com 2 casas
(`f"{x:.2f}"`), nunca confie no 16º decimal. Dinheiro em planilha sofre o mesmo;
a diferença é que aqui você pode ver o motivo.

O `float` em ação (fórmulas clássicas, em LaTeX):

$$ i_{acum12} = \left[\prod_{k=1}^{12}(1+i_k)\right] - 1 \qquad \text{(IPCA acumulado em 12 meses)} $$

$$ \Delta_{cambio} = \frac{c_t - c_{t-1}}{c_{t-1}} \times 100 \qquad \text{(variação % do câmbio)} $$

$$ P_{sc60kg} = P_{US\$/bu} \times \frac{60}{27{,}216} \times c \qquad \text{(soja: US\$/bushel → R\$/sc 60 kg)} $$

### 2.3 Operadores aritméticos e de atribuição

| Operador | Exemplo | Resultado | Uso típico no curso |
|---|---|---|---|
| `+ - * /` | `5.1253 * 12.9` | `66.11637` | conversão de moeda |
| `/` sempre → `float` | `12 / 5` | `2.4` | cuidado: `10/2` dá `5.0`, não `5` |
| `//` divisão inteira | `1800 // 60` | `30` | quantas sacas inteiras |
| `%` módulo (resto) | `1800 % 60` | `0` | sobra de sacas |
| `**` potência | `(1.0044)**12` | `1.0541…` | capitalização/juros compostos |
| `+=` incrementa | `custo += 150` | — | acumular custos |
| `*=` multiplica | `saldo *= 1.139` | — | aplicar juros (Selic ~13,9% a.a.) |

### 2.4 Estruturas nativas: listas, tuplas, dicionários

**Lista** (`list`) — sequência **mutável**, a "coluna de planilha" do Python:

```python
meses = ["fev", "mar", "abr"]
ipca = [0.70, 0.88, 0.67]        # % a.m., BCB-SGS 433 (2026)
ipca[1] = 0.90                    # mutável: dá para corrigir
```

Índices começam em **0**: `ipca[0]` é fevereiro. Fatiar: `ipca[:2]` → primeiros
dois. `len(ipca)` → 3.

**Tupla** (`tuple`) — sequência **imutável**. Ideal para registros que não
devem mudar: `uf_go = (52, "Goiás")`. Tentar `uf_go[0] = 53` levanta
`TypeError` — proteção contra "consertar" o código IBGE por engano.

**Dicionário** (`dict`) — pares **chave → valor**, a "PROCV mental" do Python:

```python
precos = {"soja_sc": 12.9, "boi_at": 320.0, "cambio": 5.1253}
precos["cambio"]       # acesso pela chave, sem saber a posição
precos["milho_sc"] = 8.4   # adiciona/atualiza
"boi_at" in precos     # True — teste de chave
precos.keys()          # dict_keys(['soja_sc', 'boi_at', 'cambio', 'milho_sc'])
```

Quando usar o quê: lista para séries ordenadas; tupla para registro fixo
(coordenada, chave composta); dict para consulta por nome (parâmetros de
cenário: `"selic": 13.9`).

### 2.5 Lendo o IPCA real com pandas (primeira degustação)

O notebook lê o arquivo oficial do BCB já nesta aula — só para mostrar que o
que você acabou de aprender opera sobre dados de verdade (o pandas em si é o
tema das aulas 9-10). O arquivo tem separador `;` e decimal `,` (padrão BR):

```python
from pathlib import Path
import pandas as pd
DATA = Path("../data/csv")
ipca = pd.read_csv(DATA / "ipca_mensal.csv", sep=";", decimal=",")
ipca["data"] = pd.to_datetime(ipca["data"], format="%d/%m/%Y", dayfirst=True)
ultimos_12 = ipca.tail(12)
acumulado_12m = (1 + ultimos_12["valor"]/100).prod() - 1   # → ≈ 0.0444 (4,44%)
```

A linha do acumulado usa exatamente a fórmula da Seção 2.2 — produto de
(1 + taxa mensal) menos 1. É o mesmo cálculo que você faria no Excel com
`PRODUTO(1+A1:A12/100)-1`, só que em uma linha e reutilizável para qualquer
janela de tempo.

### 2.6 JupyterLab: atalhos e mágicos (continuação da Aula 01)

O fluxo de trabalho no Jupyter é interativo: roda a célula, olha o resultado,
ajusta. Atalhos que valem memorizar hoje (modo Comando, fora da célula):

| Atalho | Ação |
|---|---|
| `Shift+Enter` | executa a célula e vai para a próxima (o mais usado do curso) |
| `A` / `B` | cria célula Acima / Baixo |
| `DD` | apaga a célula |
| `M` / `Y` | converte para Markdown / Code |
| `0-0` (duas vezes) | reinicia o kernel (limpa a memória) |

Mágicos úteis nesta aula (o `%` indica comando especial do IPython):

- `%time` — cronometra uma única execução de uma instrução.
- `%timeit` — roda a instrução várias vezes e reporta média/melhor tempo;
  ideal para instruções rápidas (VanderPlas, Cap. 1).

## 3. Roteiro do notebook

`a02_sintaxe_tipos_variaveis.ipynb`, seção por seção:

1. **Setup** — imports padrão + célula que lista os tipos de objetos da
   economia com `type()` (`int`, `float`, `str`, `bool`).
2. **Tipos essenciais** — cada tipo com exemplo econômico; conversões;
   armadilha do `0.1 + 0.2 != 0.3` e comparação com tolerância.
3. **Aritmética aplicada** — variação do câmbio (5,1253 → 5,0962 em dois dias
   de set/2026, dados reais do CSV), juros compostos com Selic 13,9% a.a.,
   conversão soja US$/bu → R$/sc60kg com câmbio.
4. **Variáveis e atribuição** — acumular custo de produção com `+=`; nomes
   idiomáticos (`cambio`, `preco_soja_usd`).
5. **Listas, tuplas, dicionários** — série IPCA de fev–jul/2026 em lista,
   registro UF como tupla, cenário de câmbio como dict; acesso, fatiamento,
   teste de chave.
6. **IPCA de verdade com pandas** — leitura do `ipca_mensal.csv`
   (`sep=';'`, `decimal=','`), últimos 12 meses e acumulado 12m via produto;
   variação % do câmbio a partir do `usdbrl_diario.csv`.
7. **`%time`/`%timeit` revisitados** — mesmo experimento da Aula 01 (lista vs
   NumPy), agora com números reais: 1 milhão de observações.
8. **Exercícios** — 4 exercícios: inflação acumulada de um período arbitrário,
   conversão de boi gordo, mini-tabela de preços com dict, benchmark próprio.
9. **Resumo e para casa** — bullets, próximos passos (Aula 03: condicionais),
   referências da KB.

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| `NameError: name 'cambio' is not defined` | célula da variável não rodou (ou kernel reiniciou) | rode as células em ordem, de cima a baixo |
| `TypeError: can only concatenate str... to str` | somou texto com número: `"5,12" + 0.1` | converta: `float("5,12".replace(",", ".")) + 0.1` |
| `IndexError: list index out of range` | índice ≥ tamanho (listas começam em 0) | `len(lista)` para conferir; último elemento é `lista[-1]` |
| `KeyError: 'soja'` | chave inexistente no dict | teste antes: `"soja" in precos` |
| `0.1 + 0.2` resulta `0.30000000000000004` | representação binária de float — não é bug | compare com `abs(a-b) < 1e-9`; exiba com `f"{x:.2f}"` ou `brl()` |
| `10/2` dá `5.0`, não `5` | `/` sempre retorna float | use `int(10/2)` ou `10//2` quando precisar de inteiro |
| `ValueError: could not convert string to float: '0,88'` | leu CSV sem `decimal=','` | `pd.read_csv(..., sep=';', decimal=',')` |
| `FileNotFoundError` ao ler CSV | notebook rodado fora da pasta `semana_01/` | caminho relativo `../data/csv` exige estar na pasta certa; rode o `jupyter lab` em `semana_01/` |
| `%timeit` reclama de sintaxe com `for` | mágico de linha só aceita uma instrução | use a forma de célula `%%timeit` (primeira linha) |

## 5. Glossário

| Termo (en) | Tradução / equivalente | Significado |
|---|---|---|
| type | tipo | categoria do valor (`int`, `float`, `str`, `bool`) |
| variable | variável | nome associado a um valor na memória do kernel |
| assignment | atribuição | guardar valor em variável (`=`) |
| list | lista | sequência ordenada e mutável |
| tuple | tupla | sequência ordenada e imutável |
| dict (dictionary) | dicionário | coleção chave → valor |
| key / value | chave / valor | par básico de um dicionário |
| index | índice | posição de um elemento (começa em 0) |
| slicing | fatiamento | pegar pedaço de sequência: `ipca[:3]` |
| immutable | imutável | que não pode ser alterado após criado (str, tuple) |
| float | ponto flutuante | número decimal 64 bits |
| boolean | booleano | valor lógico `True`/`False` |
| floor division | divisão inteira | `//`, descarta a parte fracionária |
| modulo | módulo (resto) | `%`, resto da divisão inteira |
| `NaN` | valor faltante | "Not a Number" — furo na série de dados |

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/15_appendix-python-language-essentials.md`
  — McKinney, *Python for Data Analysis* (2012), Apêndice: "Language
  Semantics" (indentação, objetos), "Scalar Types" (Tabela A-2), "Tuple",
  "List", "Dict".
- `kb/02_vanderplas_python_data_science_handbook/04_chapter-1-ipython-beyond-normal-python.md`
  — VanderPlas, Cap. 1: "IPython Magic Commands" e "Profiling and Timing Code".
- Dados: `data/csv/ipca_mensal.csv` (BCB-SGS 433) e `data/csv/usdbrl_diario.csv`
  (BCB-SGS 1) — valores usados nos exemplos: câmbio 5,1253 (04/09/2026);
  IPCA acumulado 12m ≈ 4,44%; Selic ~13,9% a.a. (set/2026); soja ~US$ 12,9/bu;
  salário mínimo R$ 1.518 (2026).

## 7. Gabarito comentado

Soluções dos 4 exercícios do notebook `a02_sintaxe_tipos_variaveis.ipynb`.

**Exercício 1 — Inflação acumulada de um período arbitrário.** A fórmula
(Seção 2.2) é genérica: acumular $n$ meses = produto dos $(1 + i_k/100)$ menos 1.
Com a lista do notebook (fev–jul/2026, 6 meses) o resultado deve ser ≈ **3,10%**:

```python
ipca_fev_jul = [0.70, 0.88, 0.67, 0.58, 0.16, 0.07]  # % a.m., BCB-SGS 433
acumulado = 1.0
for i in ipca_fev_jul:          # loop simples — versão sem pandas
    acumulado *= (1 + i/100)
inflacao_6m = (acumulado - 1) * 100
print(f"Inflação acumulada fev-jul/2026: {inflacao_6m:.2f}%")
```

A leitura econômica: 3,10% em 6 meses ≈ 0,51% a.m. média geométrica — bem
distante do pico de 2022–23; com Selic a 13,9% a.a., o Banco Central mantém o
custo do dinheiro alto porque a inflação já respondeu, mas a meta (~3%) ainda
exige cuidado.

**Exercício 2 — Boi gordo: do dólar para a arroba.** Conversão do agrobusiness:
1 arroba = 15 kg de carcaça; 1 kg = 2,20462 lb → 1 arroba = 33,069 lb. Preço em
US$/lb × 33,069 → R$/arroba (com câmbio 5,1253 e CME a US$ 2,20/lb):

```python
cambio = 5.1253                    # R$/US$ (04/09/2026, BCB-SGS 1)
boi_usd_lb = 2.20                  # US$/lb (futuro CME, exemplificativo)
arroba_brl = boi_usd_lb * 33.069 * cambio
print(f"Boi gordo: {brl(arroba_brl)} por arroba")
# → ≈ R$ 372,87 por arroba
```

A checagem de sanidade vale nota: boi a ~R$ 370/@ está dentro da faixa
histórica recente (R$ 300–420). Se der R$ 37 mil, o erro é de fator 100 —
confira se multiplicou por lb/kg duas vezes.

**Exercício 3 — Tabela de preços do agro (dict).** O dict troca acesso por
posição (lista) por acesso por nome — em relatório, isso elimina o erro de
contar posição errada. Solução com `.get()` para chave ausente:

```python
precos = {"soja_sc60kg": 145.76, "boi_arroba": 372.87, "milho_sc60kg": 51.50}
precos["cambio"] = 5.1253          # atualiza/adiciona chave
print("preço soja:", brl(precos["soja_sc60kg"]))
print("preço café:", precos.get("cafe", "não monitorado"))
print("chaves:", list(precos.keys()))
```

**Exercício 4 — Benchmark próprio (`%timeit`).** Mesma lógica da Aula 01, agora
com 1 milhão de lançamentos contábeis simulados. O NumPy deve ganhar por ordem
de grandeza (~10×+): soma em C vetorizada vs loop em Python puro. Preencha a
tabela e compare com a do colega — o número exato varia por máquina, a ordem de
grandeza não:

```python
valores = [1200.50 + i * 0.01 for i in range(1_000_000)]  # lançamentos fictícios

%timeit sum(valores)                 # Python puro

import numpy as np
arr = np.array(valores)
%timeit np.sum(arr)                  # NumPy vetorizado
```

*(Dica: rode as duas mágicas em células separadas para comparar os relatórios;
o `%time` de uma única execução é útil quando a operação demora segundos e não
vale repeti-la.)*