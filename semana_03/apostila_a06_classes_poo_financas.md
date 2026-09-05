# Apostila Aula 06 — Classes e métodos para Economia e Finanças (POO prática)
> Curso Python para Economistas — OIKOS/UEG · Semana 3

## 1. Por que isso importa (intuição econômica)

Você já escreveu `vpl(taxa, fluxos)` e `pmt_price(PV, i, n)` na Aula 05. Um laudo de
viabilidade real, porém, não tem uma função solta — tem **um projeto**: aquele pivô de
irrigação da fazenda em Rio Verde tem capex, tem fluxos de caixa projetados, tem uma
taxa de desconto, tem dono, tem data. Um financiamento tem principal, taxa, prazo e
"anda junto": amortiza mês a mês. São **coisas** com **atributos** que **fazem coisas**.

Classe é exatamente isso: uma forma de agrupar dados (atributos) e os cálculos que
operam sobre eles (métodos) num único objeto coerente. Sem POO, você espalha
`capex_pivo = 2_500_000`, `fluxos_pivo = [...]`, `vpl(fluxos_pivo, 0.139)` pelo notebook
e reza para que ninguém mexa num sem o outro. Com POO, `projeto.calcular_vpl()` carrega
os dados dele mesmo — impossível calcular o VPL do pivô com os fluxos do silo.

Duas ressalvas honestas para economistas:

1. **POO aqui não é engenharia de software.** Não vamos falar de herança múltipla,
   ABCs, metaclasses nem padrões de projeto GoF. Vamos tratar classe como *planilha
   inteligente*: uma linha ("objeto") que carrega seus próprios números e sabe se
   calcular. McKinney (Apêndice A) mal menciona classes — e é de propósito: para
   análise de dados, você precisa reconhecer e consumir objetos (DataFrames, etc.)
   mais do que projetá-los. Mas para um consultor, modelar um ProjetoInvestimento
   é ganho direto de produtividade.
2. **Quando NÃO usar classe.** Se o trabalho é uma análise pontual de um dataset,
   funções + dicionários bastam (e são o que faremos nas aulas de pandas). Classe
   brilha quando há *entidade* com identidade própria: projeto, título, empréstimo,
   carteira, cliente.

No notebook: um **ProjetoInvestimento** (pivô central de irrigação, capex R$ 2,5 mi,
fluxos de 10 anos) e um **Emprestimo** (R$ 50.000, 24× a 1,19% a.m.) — e ao final a
classe `Titulo` que encapsula o cálculo de rendimento bruto/líquido de uma RDB/CDB
com tabela regressiva de IR.

## 2. Teoria essencial

### 2.1 A anatomia de uma classe

```
class NomeDaClasse:
    """Docstring da classe: o que ela representa."""

    def __init__(self, capex, fluxo_caixa, taxa_desconto):
        # __init__ roda AUTOMATICAMENTE ao criar o objeto:
        # ProjetoInvestimento(2_500_000, [...], 0.139)
        self.capex = capex                    # atributo: dado que mora no objeto
        self.fluxo_caixa = fluxo_caixa
        self.taxa_desconto = taxa_desconto

    def calcular_vpl(self):
        # método: função que RECEBE o próprio objeto como 1º parâmetro (self)
        fluxos = [-self.capex] + list(self.fluxo_caixa)
        return sum(fc / (1 + self.taxa_desconto) ** t for t, fc in enumerate(fluxos))
```

Vocabulário mínimo, sem pânico:

- `__init__`: o "contrutor" — roda na criação: `p = ProjetoInvestimento(...)`.
- `self`: o próprio objeto. Todo método recebe `self` como primeiro parâmetro; você
  não o passa na chamada (`p.calcular_vpl()`, nunca `p.calcular_vpl(p)`).
- **atributo**: dado dentro do objeto (`p.capex`); **método**: função dentro do objeto
  (`p.calcular_vpl()` — note o parêntese: sem ele você obtém o método, não o resultado).
- Convenção: atributos "internos" levam `_` no início (`self._vpl_cache`) — sinal de
  "não mexa de fora"; nesta aula usamos só uma vez, para cache.

### 2.2 As fórmulas que viram métodos

**VPL** (método `calcular_vpl`):

$$VPL = -CAPEX + \sum_{t=1}^{n} \frac{FC_t}{(1+i)^t}$$

**Payback simples** (método `payback`): menor $T$ tal que $-\,CAPEX + \sum_{t=1}^{T} FC_t \ge 0$,
com interpolação linear dentro do ano da recuperação. **Payback descontado**: idem
usando $FC_t/(1+i)^t$.

Projeto do pivô central (100 ha, Rio Verde–GO): capex **R$ 2.500.000**, fluxos de 10
anos [430k, 470k, 500k, 520k, 540k, 550k, 560k, 570k, 575k, 580k], taxa **13,9% a.a.**
(Selic set/2026 — o retorno mínimo exigido pelo sócio que empresta o dinheiro).
Resultado: **VPL = +R$ 183.188,85**, payback simples **5,07 anos**, payback descontado
**8,86 anos** — viável, mas o desconto come o prazo: só recupera perto do fim da vida
útil. É exatamente o tipo de tensão que o relatório executivo precisa mostrar.

**Parcela Price** (método `pmt` da classe `Emprestimo`):

$$PMT = PV \cdot \frac{i}{1-(1+i)^{-n}}$$

Emprestimo de R$ 50.000, i = 1,19% a.m., 24 meses → **PMT = R$ 2.407,26**;
juros totais R$ 7.774,32 (13,2% do principal). O método `saldo_devedor(mes)` devolve
quanto ainda se deve — útil quando o cliente pergunta "quanto fica se eu quitar hoje?".

**Rendimento de renda fixa** (classe `Titulo`): valor futuro bruto $VF = PV(1+i)^t$;
IR regressivo conforme o prazo (tabela da RDB): 22,5% até 180 dias, 20% até 360,
17,5% até 720, 15% acima de 720. CDB de R$ 10.000 a 14,86% a.a. bruto por 2 anos:
bruto R$ 13.192,82, IR 15% R$ 478,92, líquido R$ 12.713,90.

### 2.3 `__repr__`: o objeto como relatório executivo

Quando você digita `p` no notebook, o Python mostra o resultado de `p.__repr__()`.
O padrão feio — `<__main__.ProjetoInvestimento at 0x1045...>` — é inútil. Sobrescrever
`__repr__` transforma o objeto numa linha de laudo:

```python
def __repr__(self):
    vpl = self.calcular_vpl()
    sinal = "✅ viável" if vpl > 0 else "❌ inviável"
    return (f"ProjetoInvestimento(VPL={brl(vpl)}, "
            f"payback={self.payback():.1f} anos) {sinal}")
```

Regra prática desta aula: **toda classe que criamos tem `__repr__` que responde a
pergunta do cliente em uma linha.** É POO aplicada à comunicação, não ao código.

### 2.4 Comparação com o que você já sabe

| Aula 05 (função) | Aula 06 (classe) |
|---|---|
| `vpl(taxa, fluxos)` | `p.calcular_vpl()` — dados viajam com o cálculo |
| chamar com os argumentos certos toda vez | dados entram uma vez no `__init__` |
| fácil misturar dados de 2 projetos | cada objeto é hermético: `p1`, `p2` independentes |
| `pmt_price(PV, i, n)` | `emp.pmt()`, `emp.saldo_devedor(mes)` |
| docstring documenta | docstring + `__repr__` documenta e **exibe** |

Quando comparar 3 cenários de taxa (13,9% / 16% / 12%)? Na Aula 05, três chamadas
cuidadosas. Com objetos: `for tx in [0.139, 0.16, 0.12]: p.taxa_desconto = tx; print(p)`
— o objeto é mutável e se recalcula. Cuidado: mutabilidade é poder e armadilha —
depois de `p.taxa_desconto = 0.16`, o `p` antigo não existe mais (não há cópia
automática).

## 3. Roteiro do notebook (`a06_classes_poo_financas.ipynb`)

| Seção | O que faz | O que observar |
|---|---|---|
| Setup | imports + `brl()` | igual às aulas anteriores |
| 1. De função a classe | `ProjetoInvestimento` mínima | `__init__`, `self`, `calcular_vpl()` |
| 2. Pivô central de irrigação | objeto real (Rio Verde–GO) | VPL = +R$ 183.188,85; sensibilidade da taxa |
| 3. `payback()` e payback descontado | métodos novos | 5,07 vs 8,86 anos — impacto do desconto |
| 4. `__repr__` executivo | visualização de uma linha | ✅/❌ direto no print |
| 5. Comparando 3 projetos | lista de objetos | silo (Aula 05) vs pivô; ordenar por VPL |
| 6. Classe `Emprestimo` | 2ª classe leve | PMT, saldo devedor, quitação antecipada |
| 7. Classe `Titulo` | renda fixa com IR regressivo | bruto → IR → líquido |
| Exercícios | 4 exercícios | soluções comentadas ao final |
| Resumo | para casa | Apêndice A (McKinney) + cap. 13 p/ Aula 15 |

## 4. Erros comuns e diagnóstico

| Erro | Causa provável | Correção |
|---|---|---|
| `TypeError: calcular_vpl() takes 0 positional arguments but 1 was given` | esqueceu `self` na assinatura do método | `def calcular_vpl(self):` |
| `TypeError: ... takes 1 positional argument but 2 were given` | passou argumento na chamada: `p.calcular_vpl(p)` | chamar `p.calcular_vpl()` — o `self` é implícito |
| `NameError: name 'self' is not defined` | usou `self` fora de método | `self` só existe dentro de métodos |
| `AttributeError: 'ProjetoInvestimento' object has no attribute 'payback'` | typo ou método definido depois da célula executada | re-executar a célula da classe |
| VPL errado/descontado a mais | fluxo do capex entrou no índice 0 E repetido no método | capex entra uma vez, como `-self.capex` no t=0 |
| payback volta negativo ou `None` | fluxos não recuperam o capex dentro do horizonte | checar soma dos fluxos > capex |
| `p.calcular_vpl` (sem parênteses) devolve método, não número | faltou chamada | usar `p.calcular_vpl()` |
| Objeto "mudou sozinho" | mutou `taxa_desconto` num loop de sensibilidade | guardar cópia: `p2 = ProjetoInvestimento(...)` novo |

## 5. Glossário

| Termo (pt) | Termo (en) | Significado |
|---|---|---|
| classe | class | molde que agrupa atributos + métodos |
| objeto/instância | object / instance | exemplar concreto criado a partir da classe |
| atributo | attribute | dado que mora dentro do objeto (`p.capex`) |
| método | method | função do objeto (`p.calcular_vpl()`) |
| construtor | constructor (`__init__`) | código que roda na criação do objeto |
| `self` | self | o próprio objeto, 1º parâmetro de todo método |
| método especial | dunder method | `__init__`, `__repr__` etc. ("dunder" = double underscore) |
| `__repr__` | `__repr__` | representação textual do objeto (o que o notebook mostra) |
| encapsulamento | encapsulation | dados + operações vivem juntos; interno com `_` |
| payback | payback period | tempo para recuperar o investimento |
| payback descontado | discounted payback | idem, com fluxos descontados pela taxa |
| saldo devedor | outstanding balance | dívida remanescente em um mês |
| IR regressivo | regressive withholding tax | alíquota cai com o prazo (tabela RDB) |

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/15_appendix-python-language-essentials.md`
  — seções **Functions Are Objects** e **Namespaces, Scope, and Local Functions**
  (a observação do McKinney de que estado global em excesso pede POO é a ponte para
  esta aula). Wes McKinney, *Python for Data Analysis* (2012), Apêndice A.
- `kb/02_vanderplas_python_data_science_handbook/04_chapter-1.md` — objetos e métodos
  (sintaxe `obj.método()`), para reconhecer POO "alheia" (DataFrames).
- Próximas aulas: Aula 15 (`kb/01_mckinney_python_for_data_analysis/13_chapter-11.md`
  — *Financial and Economic Data Applications*) transformará o VPL/payback de hoje em
  análise completa com pandas; Aula 14 usará classes para DRE/balanço.

## 7. Gabarito comentado

**Exercício 1 — Método `tir()` aproximado.** A TIR é a taxa que zera o VPL. Estratégia
de grade: varrer `taxa` com `np.linspace(-0.5, 1.0, 1501)`, calcular o VPL em cada taxa,
achar a troca de sinal e refinar com `np.interp`. Para o pivô, **TIR ≈ 15,64% a.a.** —
acima dos 13,9% exigidos, coerente com VPL positivo; abaixo de 16% (onde o VPL já é
negativo, ver Exercício 2). Solução com
`np.linspace(-0.5, 1.0, 1501)` e `np.interp` sobre a troca de sinal. Erro comum:
esquecer que o capex já está em `fluxo_caixa` duplicando o investimento.

**Exercício 2 — Projeto do silo como classe.** Recriar os fluxos da Aula 05
(capex R$ 850.000; [280k, 310k, 290k, 300k, 260k]) e construir
`ProjetoInvestimento(850_000, fluxos, 0.139)` → VPL = **+R$ 144.919,77**, payback
**2,9 anos**. Comparação executiva: o silo tem VPL menor que o pivô (R$ 183.188,85),
mas recupera o caixa em 3 anos em vez de 5 — se o cliente precisa de liquidez
(ou tem prazo curto), silo vence apesar do VPL menor. VPL não é critério único.

**Exercício 3 — `Emprestimo` com carência.** Acrescentar atributo `carencia` (meses
sem amortizar, pagando só juros i·PV) e ajustar o número de parcelas para
`n - carencia` sobre o principal integral. Para o empréstimo da aula com 3 meses de
carência: PMT sobre 21 meses → **R$ 2.704,90/mês** (vs R$ 2.407,26 sem carência);
total de juros sobe de R$ 7.774,32 para **R$ 8.587,82** (3 × i·PV na carência +
juros das 21 parcelas). Mensagem para o cliente: carência alivia o caixa imediato
e **encarece** o crédito — quantificar é o nosso trabalho.

**Exercício 4 — `Carteira` contendo projetos.** Classe leve com atributo `projetos`
(lista de objetos `ProjetoInvestimento`) e métodos `vpl_total()` (soma dos VPLs) e
`melhor_projeto()` (max por VPL, com `max(carteira.projetos, key=lambda p: p.calcular_vpl())`).
Para os 3 projetos do notebook (silo, pivô, pivô com taxa de 16%): VPL total =
**R$ 293.132,81** (144.919,77 + 183.188,85 − 34.975,80) — note que o terceiro projeto
inviável "puxa" a carteira para baixo; o `melhor_projeto()` é o pivô a 13,9%.
O `__repr__` da carteira deve listar os projetos com seu ✅/❌. Aqui aparece o conceito
de **composição** (objeto contendo objetos) — o mesmo padrão que um DataFrame de
projetos terá na Aula 15.