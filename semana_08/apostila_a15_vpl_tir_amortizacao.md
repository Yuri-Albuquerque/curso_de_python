# Apostila Aula 15 — VPL, TIR e amortização: engenharia econômica no Python
> Curso Python para Economistas — OIKOS/UEG · Semana 8

## 1. Por que isso importa (intuição econômica)

Toda decisão de investimento da Empresa Júnior OIKOS passa pela mesma pergunta:
*o dinheiro que entra no futuro vale o dinheiro que sai hoje?* Um produtor de Rio Verde
que quer um confinamento de R$ 3,2 milhões, uma usina de calcário em Catalão, um silo
financiado em 120 meses — todos os laudos que a OIKOS entrega se resumem a comparar
valores que acontecem em **datas diferentes**. Somar reais de 2026 com reais de 2034 é
o erro nº 1 do analista iniciante: R$ 1 recebido daqui a 8 anos não é R$ 1, é R$ 1
dividido por $(1+i)^8$ — e a $i = 13{,}9\%$ a.a. isso é **R$ 0,33**.

O **VPL** (Valor Presente Líquido) é a máquina que faz essa conversão: traz todos os
fluxos para "hoje" usando uma taxa que representa o **custo do capital** — o que o
dono do dinheiro abriria mão se não investisse no projeto. A **TIR** responde a pergunta
espelhada: *a que taxa o projeto rende por si mesmo?* Se a TIR supera o custo do capital,
o projeto paga o mercado e ainda sobra riqueza. Nenhum laudo sério sai da OIKOS sem os dois números.

A terceira peça da aula é o **financiamento**. SAC e Price são apenas VPL ao contrário:
o banco calcula a parcela exatamente para que o VPL do fluxo dele, à taxa do contrato,
seja igual ao principal emprestado. Quando você implementa a tabela de amortização
mês a mês em Python, está desmontando a máquina que os bancos usam para precificar
crédito rural — e passa a responder, com número, perguntas como "vale refinanciar?",
"quanto custa antecipar?", "SAC ou Price?". É o mesmo ferramental da consultoria:
engenharia econômica é decidir com o tempo do dinheiro a favor do cliente.

## 2. Teoria essencial

### 2.1 Valor do dinheiro no tempo e VPL

$$VPL = -Capex + \sum_{t=1}^{n} \frac{CF_t}{(1+i)^t}$$

- $CF_t$ = fluxo de caixa livre do ano $t$ (entrada − saída, pós-impostos);
- $i$ = taxa de desconto anual em decimal (13,9% → `0.139`);
- $-Capex$ = o desembolso do ano 0, com sinal negativo;
- **Critério**: $VPL > 0$ → aceita (cria riqueza em valor de hoje); $VPL < 0$ → rejeita.

O fator $\frac{1}{(1+i)^t}$ é o **fator de desconto**. Duas propriedades que valem um
destaque: ele é **decrescente** em $i$ (juro maior → futuro vale menos) e **decrescente
em $t$** (quanto mais longe o recebimento, menos vale). Por isso projetos longos são
mais sensíveis a juros: no confinamento da aula, subir a taxa de 12% para 16% derruba
o VPL de R$ 1.325.542,91 para R$ 731.536,83 — quatro pontos percentuais comem quase
R$ 600 mil de valor.

Em Python, a implementação é um laço com acumulador (a mesma engrenagem da Aula 06):

```python
def vpl(capex, fluxos, taxa):
    total = -capex
    for t, cf in enumerate(fluxos, start=1):
        total += cf / (1 + taxa) ** t
    return total
```

Sem `numpy_financial`, sem Excel: 4 linhas que você sabe defender linha a linha.

### 2.2 WACC: a taxa que dá dignidade ao VPL

O VPL é tão bom quanto a taxa. O custo médio ponderado de capital soma as duas fontes
de dinheiro — sócios e bancos — com o ajuste fiscal da dívida:

$$WACC = w_e \cdot k_e + w_d \cdot k_d \cdot (1 - IR)$$

- $k_e$ (custo do capital próprio) via CAPM: $k_e = r_f + \beta \cdot \text{prêmio}$;
- $k_d$ (custo da dívida) entra **pós-imposto** porque juros são dedutíveis do IRPJ/CSLL;
- no caso da aula: $r_f \approx 11{,}9\%$ (Selic set/2026 13,9% descontada do spread do CDI),
  prêmio de risco do agro 4,5 p.p., $\beta = 1$, dívida a 15% pré-IR → $k_d = 9{,}9\%$,
  estrutura 60/40 → WACC ≈ 12–13% — **adotamos 13,9%**, a própria Selic, por
  conservadorismo: taxa arredondada para cima dá VPL menor e laudo mais honesto.

Regra prática de consultoria: a taxa do laudo precisa ser **defendível em uma frase**
("Selic de set/2026 + prêmio de risco; escolhemos o lado conservador"). Número sem
história não sobrevive à reunião com o cliente.

### 2.3 TIR: a taxa que o projeto rende

$$\text{TIR} = i^* \text{ tal que } VPL(i^*) = 0$$

Não existe fórmula fechada para fluxos longos — a TIR é **raiz de um polinômio de grau
n**. Resolvemos por **bisseção**: mantenha um intervalo $[lo, hi]$ em que o VPL troca de
sinal, teste o ponto médio, descarte a metade que não contém a raiz. Cada iteração
divide o intervalo por 2; com tolerância de $10^{-10}$, ~40 iterações bastam.

```python
def tir(capex, fluxos, lo=-0.5, hi=2.0, tol=1e-10, max_iter=200):
    def f(i):
        return vpl(capex, fluxos, i)
    flo, fhi = f(lo), f(hi)
    if flo * fhi > 0:          # sem troca de sinal → sem raiz garantida
        return None
    for _ in range(max_iter):
        mid = (lo + hi) / 2
        fm = f(mid)
        if abs(fm) < tol:
            return mid
        if flo * fm < 0:
            hi, fhi = mid, fm
        else:
            lo, flo = mid, fm
    return (lo + hi) / 2
```

Decisão: **TIR > WACC → aceita; TIR < WACC → rejeita**. Quando o fluxo tem um único
sinal invertido (capex no início, receitas depois), TIR e VPL **nunca discordam**.
Com sinais múltiplos (projetos de mineração com reforma no meio, por exemplo), a TIR
pode ter múltiplas raízes — nesse caso, confie no VPL. O `scipy.optimize.brentq` faz
a mesma busca com um método mais esperto (interpolção + bisseção): em produção, use-o;
na aula, o loop é o conteúdo.

### 2.4 Payback: a régua do caixa apertado

O **payback simples** é o tempo para a soma nominal dos fluxos recompor o capex; o
**payback descontado** faz a mesma conta com fluxos descontados. É um critério
*inferior* ao VPL (ignora o que vem depois da recuperação), mas é o primeiro número
que o produtor pergunta — caixa travado é risco de calote. No confinamento: 4 anos
simples, **5,41 anos descontado**. Os dois sempre aparecem juntos no laudo.

### 2.5 SAC × Price: os dois sistemas de amortização

Num financiamento de principal $PV$, taxa mensal $i_m$ e prazo $n$ meses:

**Price (parcela constante)**

$$PMT = PV \cdot \frac{i_m}{1-(1+i_m)^{-n}}$$

A cada mês: juros $= saldo \cdot i_m$; amortização $= PMT - \text{juros}$; o saldo desce
lentamente no começo e acelera no fim.

**SAC (amortização constante)**

$$Amort = \frac{PV}{n}, \qquad PMT_k = \frac{PV}{n} + saldo_k \cdot i_m$$

A amortização é fixa; os juros caem todo mês sobre um saldo menor → a parcela começa
alta e desce monotonamente.

Números do caso da aula (R$ 800 mil, 12% a.a. equivalente composto, 120 meses):

| indicador | Price | SAC |
|---|---|---|
| parcela mês 1 | R$ 11.195,77 | R$ 14.257,70 |
| parcela mês 120 | R$ 11.195,77 | R$ 6.738,03 |
| juros totais | R$ 543.492,87 | R$ 459.257,58 |
| saldo no mês 60 | R$ 510.390,64 | R$ 400.000,00 |

A **taxa mensal equivalente** — o detalhe que separa o analista do digitador — converte
a taxa anual composta, não dividida:

$$i_m = (1 + i_{aa})^{1/12} - 1$$

Para 12% a.a.: $i_m = 0{,}9489\%$ ao mês (e não 1,0000%). A convenção $i_{aa}/12$
subestima o juro do banco e distorce a parcela.

### 2.6 A TIR do credor: o teste de sanidade

Do lado do banco, o fluxo é $+PV$ no mês 0 e $-PMT$ por $n$ meses. A TIR desse fluxo
**deve devolver a taxa de contrato** — é a condição de equilíbrio que define a parcela.
Se sua tabela Price, descontada à taxa do contrato, não reproduz o principal, há um
bug. Esse teste vale um relatório: é a forma mais barata de auditar uma planilha
de crédito antes de assinar.

## 3. Roteiro do notebook (`a15_vpl_tir_amortizacao.ipynb`)

| Seção | O que faz | O que observar |
|---|---|---|
| Setup | imports + `brl()` | padrão de todas as aulas do curso |
| 1. A pergunta que decide o investimento | dados do confinamento (capex R$ 3,2 mi, 8 fluxos) | soma nominal R$ 7,44 mi ≠ valor de hoje |
| 2. VPL à mão | função `vpl()` + VPL a 12/13,9/16% | VPL @13,9% = R$ 1.027.111,88 |
| 3. WACC | montagem do 13,9% (Selic + prêmio + dívida pós-IR) | cada peça é uma decisão defendível |
| 4. TIR por bisseção | loop `tir()` + comparação com `brentq` | TIR 22,47% > WACC → aceita |
| 5. Sensibilidade | gráfico VPL × taxa + comparativo com a frota | curva decrescente; TIR é o cruzamento do zero |
| 6. SAC × Price | tabelas em pandas (120 meses) | Price +R$ 84.235 de juros; SAC parcela 27% maior |
| 7. TIR do credor | bisseção sobre o fluxo do banco | devolve exatamente 0,9489% a.m. |
| 📝 Exercícios | 4 casos com solução | usina, TIR de fluxo completo, refinanciamento, sensibilidade |

Rodando em casa: `jupyter lab` dentro de `semana_08/`, kernel **Python (oikos_py)**,
`Shift+Enter` de cima a baixo. Sem internet, sem pacotes além do ambiente da disciplina.

## 4. Erros comuns e diagnóstico

| erro | causa provável | correção |
|---|---|---|
| `VPL` positivo com soma nominal negativa | sinal do capex esquecido | ano 0 entra com `-capex` dentro da função |
| `taxa: 13.9%` no lugar de `13,9% a.a.` | passou 13.9 em vez de 0.139 | taxa em **decimal**: `0.139`; use `f"{i:.1%}"` para exibir |
| parcela Price errada (~R$ 10.500) | taxa mensal = `taxa_aa/12` | use equivalente composto: `(1.12)**(1/12) - 1` |
| `ZeroDivisionError` em `af(i, n)` | taxa 0 no fator de anuidade | trate `i == 0` como caso especial (`af = n`) |
| `tir()` devolve `None` | sem troca de sinal no intervalo | amplie `[lo, hi]`; verifique se há raiz (fluxo viável) |
| TIR "absurda" (300%+) | intervalo `hi` muito baixo pegou raiz espúria | confira com `brentq` e plote a curva VPL × i |
| `KeyError` em `price.loc[35, "saldo"]` | índice do DataFrame não é 0-based | Price tem `mes` 1..120 → mês 36 é índice **35** |
| juros totais SAC < Price e "susto" | não é erro: SAC amortiza mais cedo | é a lição da seção 6 — explique o mecanismo |
| gráfico VPL × taxa sem curva | `taxas` em decimal e eixo em % misturados | multiplique por 100 só no eixo: `ax.plot(taxas*100, ...)` |
| `brentq` reclama de sinal | intervalo com VPL do mesmo sinal nas pontas | passe `[lo, hi]` com troca de sinal (ex.: `[-0.5, 2.0]`) |

## 5. Glossário

| termo (pt) | termo (en) | definição curta |
|---|---|---|
| VPL / VAL | NPV | soma dos fluxos descontados menos o investimento inicial |
| TIR | IRR | taxa que zera o VPL; rendimento implícito do projeto |
| WACC / CMPC | WACC | custo médio ponderado de capital próprio e de terceiros |
| taxa livre de risco | risk-free rate | retorno sem risco de crédito; aqui, a Selic |
| prêmio de risco | risk premium | retorno extra exigido por assumir risco de negócio |
| CAPM | CAPM | $k_e = r_f + \beta \times$ prêmio de mercado |
| custo da dívida pós-imposto | after-tax cost of debt | $k_d (1 - IR)$: juros dedutíveis barateiam a dívida |
| fator de anuidade | annuity factor | VP de R$ 1/ano por $n$ anos: $(1-(1+i)^{-n})/i$ |
| bisseção | bisection | busca binária da raiz por troca de sinal |
| payback descontado | discounted payback | tempo de recuperação do capex com fluxos descontados |
| SAC | — | amortização constante; parcela decrescente |
| Price | — | parcela constante; amortização acelera no fim |
| saldo devedor | outstanding balance | dívida remanescente após a parcela $k$ |
| taxa equivalente | equivalent rate | conversão composta entre periodicidades |
| fluxo de caixa livre | free cash flow | caixa gerado após investimentos e impostos |
| escudo fiscal | tax shield | economia de imposto gerada por custo dedutível |

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/13_chapter-11-financial-and-economic-data-applications.md`
  — McKinney, *Python for Data Analysis* (2012), cap. 11: aplicações financeiras e
  econômicas com pandas; alinhamento de séries e dados econômicos.
- `kb/03_jansen_ml_for_algorithmic_trading/11_chapter-5-portfolio-optimization-and-performance-evaluation.md`
  — Jansen, *ML for Algorithmic Trading* (2ª ed.), cap. 5: taxa livre de risco,
  retorno exigido e métricas de desempenho (a base conceitual do WACC da seção 3).
- Livro-texto da disciplina de engenharia econômica (Hirschfeld; Souza & Clímaco) para
  as tabelas de fator financeiro — que aqui calculamos com Python em vez de tabeadas.

## 7. Gabarito comentado

### Exercício 1 — Usina de calcário em Catalão (10 anos)

Dados: capex R$ 3,6 mi; fluxos de R$ 900 mil (anos 1-2), R$ 1,1 mi (anos 3-6),
R$ 950 mil (anos 7-10); taxa 13,9% a.a.

```python
capex_ex, fluxos_ex = 3_600_000, [900_000, 900_000,
                                  1_100_000, 1_100_000, 1_100_000, 1_100_000,
                                  950_000, 950_000, 950_000, 950_000]
vpl_ex = vpl(capex_ex, fluxos_ex, 0.139)
tir_ex = tir(capex_ex, fluxos_ex)
pb_ex  = payback_descontado(capex_ex, fluxos_ex, 0.139)
```

**Respostas**: VPL = **R$ 1.629.854,10**; TIR = **24,52%**; payback descontado =
**5,29 anos**. TIR (24,5%) > WACC (13,9%) → **aceita**; o VPL confirma: depois de pagar
capital e custo de oportunidade, sobra ~R$ 1,63 mi de riqueza em valor de hoje.
Os dois critérios concordam porque o fluxo tem um único sinal invertido — a condição
em que TIR e VPL são consistentes.

### Exercício 2 — TIR de um fluxo completo (sinal embutido)

Fluxo: `[-800_000, 200_000, 250_000, 300_000, 350_000]`. A bisseção agora roda sobre
$\sum_t CF_t/(1+i)^t = 0$ **sem separar capex**:

```python
def tir_fluxo(fluxo, lo=-0.5, hi=2.0, tol=1e-10, max_iter=200):
    def f(i):
        return sum(cf / (1 + i) ** t for t, cf in enumerate(fluxo))
    # ... mesmo esqueleto da bisseção da aula
tir_cli = tir_fluxo([-800_000, 200_000, 250_000, 300_000, 350_000])
```

**Resposta**: TIR = **12,75%** < 13,9% → **rejeite**, apesar de a soma dos recebimentos
(R$ 1,1 mi) superar o aporte (R$ 800 mil). A checagem `VPL(i*)` ≈ 0 confirma a raiz.
A mensagem: comparar **somas nominais** é o erro clássico; a TIR normaliza tudo em
taxa — e a taxa diz que o dinheiro renderia menos que a Selic. CDI rende mais.

### Exercício 3 — Refinanciamento no mês 36

Passos: (a) saldo devedor do contrato atual no mês 36 → `price.loc[35, "saldo"]`;
(b) nova parcela Price sobre esse saldo a 11,5% a.a. equivalente composto em 84 meses;
(c) juros restantes: dos meses 37-120 da tabela antiga vs 84 meses da nova tabela.

```python
saldo_36   = price.loc[35, "saldo"]              # R$ 646.170,11
i_novo     = (1.115) ** (1/12) - 1               # 0,9112% a.m.
parcela_n  = pmt_price(saldo_36, i_novo, 84)     # R$ 11.041,92
juros_ant  = price.loc[36:, "juros"].sum()       # R$ 294.274,90
# loop novo → juros_novos = R$ 281.351,36
```

**Respostas**: saldo no mês 36 = **R$ 646.170,11**; nova parcela = **R$ 11.041,92**
(antes R$ 11.195,77); juros restantes caem de R$ 294.274,90 para R$ 281.351,36 —
**economia de R$ 12.923,54**. Vale tecnicamente; a folga mensal (R$ 154) é pequena,
então o argumento forte é reduzir risco de inadimplência, não "ganhar dinheiro".
Discuta com o cliente o custo de recontratação (tarifas) antes de recomendar.

### Exercício 4 — Sensibilidade do confinamento

```python
grade = np.arange(0.08, 0.32, 0.02)
sens = pd.DataFrame({"taxa": grade, "vpl": [vpl(capex, fluxos, t) for t in grade]})
```

**Resposta**: a tabela desce monotonicamente de R$ 2.070.401 (8%) até −R$ 606.358
(30%) — curva decrescente e convexa, como previsto. O VPL cruza o zero entre 22% e 25%,
exatamente em torno da **TIR = 22,47%**: é esse o maior WACC que o projeto aguenta.
Se a Selic subir e o prêmio de risco do agro aumentar, o laudo muda de veredito sem
que o projeto tenha mudado — sensibilidade é a prova de que o risco do projeto é
**risco de taxa**.

---

*Próxima aula (16): o mesmo aparato de VPL, agora do lado do custo — comprar à vista,
financiar ou dar lease no caminhão, com IRPJ+CSLL no meio da conta.*