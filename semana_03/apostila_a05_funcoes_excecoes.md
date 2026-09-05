# Apostila Aula 05 — Funções e tratamento de erros (`def`, `try/except`)
> Curso Python para Economistas — OIKOS/UEG · Semana 3

## 1. Por que isso importa (intuição econômica)

Toda consultoria econômica repete os mesmos cálculos: elasticidade de demanda, parcela
de financiamento, VPL de um projeto. No Aula 04 você repetia esses cálculos copiando e
colando código — com `def` você escreve **uma vez** e reutiliza em todos os relatórios.
Função é o equivalente econômico de uma "planilha-modelo": você define a fórmula uma
vez e depois só troca os insumos.

Há um segundo ganho, menos óbvio: funções são a menor unidade **testável** do Python.
Quando a OIKOS entrega uma análise para um cliente, você precisa garantir que o cálculo
do VPL está certo — não "parece certo na tela", mas certo. Uma função com docstring e
comportamento previsível pode ser verificada célula a célula; um bloco solto de código
não.

E há um terceiro ganho que só aparece na prática: dados de clientes são sujos. Planilhas
chegam com "R$ 1.234,56" em células que deveriam ser números, células vazias onde
deveria haver preço, preços negativos de digitação. `try/except` é a ferramenta que
permite **limpar esses dados sem parar a análise** — tentar converter, capturar o erro,
decidir o que fazer. Sem isso, um único "R$ —" no meio de 5.000 linhas derruba o
notebook inteiro.

Nesta aula construímos três funções econômicas clássicas e usamos `try/except` para
sanitizar uma planilha de preços "suja" de um açougue de Goiânia.

## 2. Teoria essencial

### 2.1 Anatomia de uma função

```
def nome(parametros):
    """docstring — o que a função faz, parâmetros, retorno."""
    corpo...
    return resultado
```

- `def` declara; `return` devolve o valor. Sem `return`, a função devolve `None`.
- **Função pura** (nosso padrão nesta aula): só lê seus argumentos, não modifica nada
  fora dela, e sempre devolve o mesmo resultado para os mesmos argumentos. É o ideal
  para cálculo econômico: `elasticidade_preco(p1, p2, q1, q2)` não "vaza" efeito
  colateral nenhum — é uma fórmula, não uma caixa-preta.
- Argumentos em três sabores:
  - **posicionais**: `f(38.90, 42.30, 320, 290)` — a ordem importa e você precisa
    lembrar o que vem primeiro;
  - **nomeados (keyword)**: `f(p_inicial=38.90, p_final=42.30, ...)` — ordem livre,
    código se auto-documenta;
  - **valor padrão**: `def vpl(taxa, fluxos, t0_investimento=True)` — quem não passa,
    recebe o padrão. Regra de ouro: obrigatórios primeiro, padrões depois.

```python
def vpl(taxa, fluxos):
    """Valor Presente Líquido.

    Parameters
    ----------
    taxa : float
        Taxa de desconto ANUAL em decimal (0.139 = 13,9% a.a.).
    fluxos : lista de floats
        Fluxos de caixa dos períodos 1..n (o investimento entra como
        valor NEGATIVO no índice 0).

    Returns
    ----------
    float
        VPL em R$.
    """
    return sum(fc / (1 + taxa) ** t for t, fc in enumerate(fluxos))
```

`vpl(0.139, [-850_000, 280_000, 310_000, 290_000, 300_000, 260_000])` — posição ou
`vpl(fluxos=[...], taxa=0.139)` — nomeado: mesmo resultado.

### 2.2 As fórmulas da aula

**Elasticidade-preço da demanda** (ponto, com variações percentuais):

$$\varepsilon_D = \frac{\%\Delta Q}{\%\Delta P} = \frac{\Delta Q/Q}{\Delta P/P}$$

Com os dados do açougue (preço do kg do coxão mole R$ 38,90 → R$ 42,30; quantidade
vendida 320 → 290 kg/semana): %ΔP = +8,74%, %ΔQ = −9,38%, portanto
ε ≈ −1,07 — demanda elástica (|ε| > 1): subir o preço **reduz** a receita
(P · Q cai de R$ 12.448,00 para R$ 12.267,00). No notebook comparamos com a
fórmula arco (ponto médio), que dá ε ≈ −1,18 — mesmo diagnóstico.

**Tabela Price** (parcela fixa):

$$PMT = PV \cdot \frac{i}{1-(1+i)^{-n}}$$

Com PV = R$ 320.000 (trator), i = 1,09% a.m. (≈ 13,9% a.a., a Selic de set/2026 como
custo de oportunidade do financiamento) e n = 48: **PMT = R$ 8.597,51**. O mesmo
financiamento no **SAC** começa em R$ 10.154,67 (mês 1) e termina em R$ 6.739,33
(mês 48), com amortização constante de R$ 6.666,67. Total pago Price: R$ 412.680,48
(Price) vs R$ 486.069,33 (SAC) — Price suaviza o caixa, SAC cobra menos juros no total.

**try/except** — a sintaxe completa usada na aula:

```python
try:
    valor = float(limpo)          # o que pode dar erro
except ValueError:                # o que fazer SE der esse erro
    valor = None
else:                             # só roda se o try deu certo
    registros_ok += 1
finally:                          # roda SEMPRE, deu erro ou não
    total_lidas += 1
```

- `except ValueError:` com o tipo específico — nunca `except:` nuo (engole bug de
  verdade). Pode capturar vários tipos: `except (ValueError, TypeError):`.
- `else` roda só no sucesso; `finally` roda sempre — útil para registrar auditoria
  ("quantas linhas tentei ler?") independentemente do resultado.
- `raise ValueError("mensagem")` cria o seu próprio erro quando a entrada é
  economicamente inválida (preço negativo, taxa ≤ 0).

### 2.3 Sanitização: o padrão de 3 camadas

Para converter `"R$ 1.234,56"` → `1234.56`, a ordem dos passos importa:

1. `.strip()` — remove espaços sobrando;
2. `.replace("R$", "").strip()` — remove o símbolo da moeda;
3. `.replace(".", "").replace(",", ".")` — formato brasileiro: ponto = milhar,
   vírgula = decimal. "1.234,56" → "1234,56" → "1234.56";
4. `float(...)` dentro de `try/except ValueError` — se algo sobrar que não é número,
   devolve `None` em vez de quebrar.

Nunca inverta as etapas 2 e 3: remover o ponto ANTES da vírgula destruiria "1.234,56"
→ "123456" (perda do decimal) ou "1,234.56" → "1,23456".

### 2.4 Erros que você vai ver hoje

| Exceção | Dispara quando |
|---|---|
| `ValueError` | `float("abc")`, `int("R$ 5")` — tipo certo, conteúdo inválido |
| `ZeroDivisionError` | `elasticidade(38.90, 38.90, 320, 290)` — ΔP = 0 |
| `TypeError` | `float(None)`, `"5" + 5` — tipo errado de entrada |
| `IndexError` | `fluxos[10]` em lista de 5 fluxos |

## 3. Roteiro do notebook (`a05_funcoes_excecoes.ipynb`)

| Seção | O que faz | O que observar |
|---|---|---|
| Setup | imports + `brl()` | formatação "R$ 1.234,56" já pronta |
| 1. Primeira função | `elasticidade_preco` | docstring, `return` vs `None` |
| 2. Elasticidade arco | `elasticidade_arco` | ε ponto ≈ −1,07 vs arco ≈ −1,18 |
| 3. Args posicionais/nomeados | `vpl(taxa, fluxos)` | as DUAS formas de chamar |
| 4. Tabela Price e SAC | `pmt_price`, `tabela_price`, `tabela_sac` | parcela fixa vs decrescente; loop `for t in range(1, n+1)` |
| 5. try/except | `attempt_float` (McKinney), `safe_div` | erro específico vs `except:` nu; `ZeroDivisionError` |
| 6. Sanitização | `limpar_moeda`, `carregar_precos` | 5.000 linhas hipotéticas; contagem ok/erro; `finally` |
| 7. Mini-relatório | função que chama funções | composição: relatório = f(dados limpos) |
| Exercícios | 5 exercícios | soluções comentadas ao final |
| Resumo | para casa | leitura do Apêndice A (McKinney) |

## 4. Erros comuns e diagnóstico

| Erro | Causa provável | Correção |
|---|---|---|
| `NameError: name 'elasticidade' is not defined` | célula com `def` não executada | rodar a célula do `def` antes de chamar |
| `TypeError: ... missing 1 required positional argument` | chamou `f(38.90)` sem todos os obrigatórios | conferir a assinatura: `f(p_inicial, p_final, q_inicial, q_final)` |
| `TypeError: unsupported operand type(s)` | passou `"38.90"` (string) em vez de `38.90` | sanitizar antes: `limpar_moeda()` ou `float()` |
| `ZeroDivisionError` | preços iguais (ΔP = 0) ou n = 0 | tratar no `try/except` ou validar entrada |
| Função devolve `None` | esqueceu o `return` | conferir se a última linha tem `return` |
| Conversão "1.234,56" → 1.234 | trocou a ordem dos `replace` | remover pontos de milhar antes de trocar vírgula por ponto |
| `except:` genérico engole bug | captura QUALQUER erro, até typo | sempre `except ValueError:` com tipo específico |

## 5. Glossário

| Termo (pt) | Termo (en) | Significado |
|---|---|---|
| função pura | pure function | mesma entrada → mesma saída, sem efeitos colaterais |
| argumento posicional | positional argument | identificado pela posição na chamada |
| argumento nomeado | keyword argument | identificado por `nome=valor` na chamada |
| valor padrão | default value | valor usado quando o argumento não é passado |
| docstring | docstring | string na 1ª linha da função que documenta (`help(f)` a lê) |
| escopo local | local scope | variáveis criadas dentro da função morrem quando ela termina |
| exceção | exception | objeto de erro que interrompe o fluxo até ser capturado |
| capturar | catch / handle | interceptar a exceção com `except` para decidir o que fazer |
| lançar | raise | criar um erro com `raise ValueError("msg")` |
| sanitizar | sanitize / clean | transformar entrada suja em dado confiável |
| elasticidade-preço | price elasticity of demand | ε = %ΔQ / %ΔP |
| tabela Price | annuity / fixed-payment loan | parcelas fixas, juros decrescentes |
| tabela SAC | constant amortization mortgage | amortização fixa, parcelas decrescentes |

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/15_appendix-python-language-essentials.md`
  — seções **Functions** (def, posicionais/nomeados, valores padrão, retornos múltiplos),
  **Exception handling** (`attempt_float`, `try/except/finally`), **Anonymous (lambda)
  Functions** e **Namespaces, Scope and Local Functions**. Wes McKinney, *Python for
  Data Analysis* (2012), Apêndice A.
- `kb/02_vanderplas_python_data_science_handbook/04_chapter-1.md` — *A Guided Tour of
  Python Language Features* (def, *args/**kwargs, exceções). Jake VanderPlas, *Python
  Data Science Handbook*.
- Próxima aula: Aula 15 (VPL/TIR/amortização) reutiliza `vpl()` e a Tabela Price
  construídas aqui — vale refazer os exercícios antes de chegar lá.

## 7. Gabarito comentado

**Exercício 1 — Elasticidade do arroz em Goiânia.** Preço sobe de R$ 5,40 para R$ 5,89
(+9,07%); quantidade cai de 1.200 para 1.080 pacotes/mês (−10,0%). Com
`elasticidade_preco(5.40, 5.89, 1200, 1080)` obtém-se ε ≈ **−1,10** (ponto). Demanda elástica:
|ε| > 1 — o consumidor reage mais que proporcionalmente. Implicação executiva: em
mercado elástico, desconto de preço **aumenta** receita total (P·Q), e aumento de preço
a reduz. Se a resposta deu positiva, provavelmente trocou numerador e denominador —
ε é sempre %ΔQ/%ΔP, nessa ordem.

**Exercício 2 — Financiamento de trator com entrada.** Com entrada de R$ 32.000,
financia-se PV = R$ 288.000 em 36 meses a 1,09% a.m.:
`pmt_price(288_000, 0.0109, 36)` → **R$ 9.714,96/mês**. O erro comum: aplicar a fórmula
sobre os R$ 320.000 cheios e ignorar a entrada. Regra: PMT calcula-se sobre o valor
**financiado**, nunca sobre o valor do bem. Total pago: R$ 9.714,96 × 36 = R$ 349.738,54.

**Exercício 3 — SAC vs Price lado a lado.** Basta chamar as duas funções do notebook
com os mesmos argumentos (PV = R$ 320.000, i = 1,09% a.m., n = 48) e comparar as
primeiras e últimas parcelas. Price: todas as parcelas R$ 8.597,51; juros totais
R$ 92.680,48. SAC: de R$ 10.154,67 no mês 1 caindo até R$ 6.739,33 no mês 48; juros
totais R$ 85.456,00 (fórmula dos juros do SAC: i·PV·(n+1)/2). Moral para o cliente:
o SAC desembolsa menos no total porque amortiza mais rápido no início, mas começa com
a parcela mais pesada; o Price suaviza o fluxo de caixa mensal ao custo de ~R$ 7.224,48
de juros adicionais. Qual escolher? Depende do caixa do cliente, não da taxa.

**Exercício 4 — Sanitizando lista de preços.** Aplique `limpar_moeda` à lista
`["R$ 38,90", "42,30", "R$ 1.234,56", "", "R$ —", "  5,40 "]` e conte com
`sum(v is not None for v in ...)` → 4 valores válidos, 2 `None`. A função devolve `None`
(podendo usar `float("nan")` se preferir sinalizar ausência) em vez de lançar erro — é
isso que permite processar 5.000 linhas sem o notebook quebrar.

**Exercício 5 — `vpl` com validação.** Basta acrescentar antes do cálculo:

```python
if taxa <= 0:
    raise ValueError("A taxa de desconto deve ser positiva (use decimal, ex.: 0.139).")
if fluxos[0] >= 0:
    raise ValueError("O fluxo do período 0 deve ser o investimento (negativo).")
```

A assinatura pedida é `def vpl(taxa, fluxos):` — a validação não muda a interface,
só protege contra entradas economicamente sem sentido (taxa 0 descontaria nada;
VPL sem investimento no período 0 costuma indicar erro de montagem da planilha).
Teste: `vpl(0.139, [-850_000, 280_000, 310_000, 290_000, 300_000, 260_000])` →
**R$ 144.919,77** — o silo é viável a 13,9% a.a.