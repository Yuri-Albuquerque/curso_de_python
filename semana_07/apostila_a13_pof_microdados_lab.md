# Apostila Aula 13 — Laboratório POF: Microdados do Orçamento das Famílias
> Curso Python para Economistas — OIKOS/UEG · Semana 7

## 1. Por que isso importa (intuição econômica)

Todo economista aplicado, mais cedo ou mais tarde, trabalha com **microdados**: a PNAD, o
Censo, a RAIS, a POF. São tabelas com dezenas de milhares (ou milhões) de linhas — uma por
domicílio, uma por pessoa, uma por compra. No Excel, abrir um arquivo desses já trava a
planilha. Em pandas, 58 mil linhas são **pouca coisa**: lemos, filtramos e agregamos em
segundos. A barreira técnica entre "uma pergunta de pesquisa" e "a resposta calculada" é,
quase sempre, saber manipular essa tabela.

A **Pesquisa de Orçamento Familiares (POF 2017-18)** do IBGE é o retrato mais detalhado do
consumo das famílias brasileiras: o que ganham, onde moram e em quê gastam. Nela vivem as
cestas do IPCA, os coeficientes de gastos públicos e boa parte dos estudos de desigualdade.
Nesta aula usamos uma **versão didática** em três CSVs — domicílios, respondentes e
despesas por categoria — que preserva a lógica do banco original: bases separadas que só
ganham sentido quando **combinadas por uma chave** (`household_id`).

O prêmio intelectual do lab é tocar com as mãos a **Lei de Engel**, de 1857: a participação
da alimentação no orçamento **cai** quando a renda sobe. É um dos fatos mais robustos da
economia empírica — fundou a análise de elasticidades-renda e ainda hoje estrutura cestas
inflacionárias. Quando você rodar o `groupby` e ver a fatia da comida cair de 57% para 32%,
vai estar repetindo, com dados brasileiros, o exercício que o próprio Engel fez com orçamentos
familiares belgas no século XIX. E vai fazê-lo com dez linhas de pandas.

## 2. Teoria essencial

### 2.1 Chaves, merge e a lógica relacional

Microdados oficiais sempre vêm fatiados em arquivos que se ligam por identificadores. A
operação que os junta é o `merge`, análogo ao JOIN do SQL:

$$
\text{base}_{A} \bowtie_{\text{chave}} \text{base}_{B} \quad\Rightarrow\quad
\text{uma linha por chave, com colunas de } A \text{ e de } B
$$

Tipos que importam:

- **1:1** — cada chave aparece uma vez em cada base (domicílio × domicílio). É o caso das
  nossas três bases *após* a deduplicação.
- **1:N** — uma linha de A casa com muitas de B (domicílio × todas as compras da família).
  Útil, mas multiplica linhas: cuidado com médias depois do merge.

O `how="inner"` mantém apenas chaves presentes nas duas bases; `how="left"` mantém todas as
da esquerda (com `NaN` onde não houver par). Em microdados do IBGE, as chaves normalmente
casam — mas conferir (`isin()`, contagens antes/depois) é higiene obrigatória.

**Duplicatas**: a POF registra mais de um respondente em alguns domicílios (58.039 linhas de
morador para 57.920 domicílios). Antes do merge 1:1, decida *qual* linha representa a casa.
Aqui ficamos com a de **maior renda per capita** (o respondente econômico principal):

```python
mor_unico = mor.sort_values("RENDA_PC").drop_duplicates("household_id", keep="last")
```

### 2.2 `pd.cut`: de reais a salários mínimos

Comparar renda em reais brutos mistura 2018 com 2026 e o Acre com o Distrito Federal. A
solução clássica é normalizar por um **deflator econômico** — para distribuição de renda, o
salário mínimo é a escala mais comunicável. Com `pd.cut` transformamos renda contínua em
faixas:

```python
bins   = [0, SM/2, 2*SM, 5*SM, np.inf]   # cortes em R$ (SM 2018 = 954)
rotulos = ["até 1/2 SM", "1/2 a 2 SM", "2 a 5 SM", "acima de 5 SM"]
pof["faixa_renda"] = pd.cut(pof["RENDA_PC"], bins=bins, labels=rotulos, right=False)
```

- `right=False` → intervalos **fechados à esquerda**: `[0, 477)` — quem ganha exatamente
  R$ 477 entra em "1/2 a 2 SM". Sem isso, o corte fica ambíguo.
- `np.inf` no último corte garante que toda renda alta caia em "acima de 5 SM".
- Como a renda da base é **per capita**, a faixa mede SM **por pessoa**: uma casa de 4 com
  R$ 3.816 totais vive com 1 SM por cabeça. Escolha consciente: mede bem-estar individual,
  não tamanho de família.

### 2.3 Lei de Engel e elasticidade-renda

Engel (1857) observou em orçamentos familiares belgas que **a participação da alimentação
no gasto total cai com a renda**. A formalização: seja $w_f$ a participação da comida,

$$
w_{food} = \frac{p_f \cdot q_f}{\sum_i p_i q_i}, \qquad
\varepsilon_{food} = \frac{\partial \ln(p_f q_f)}{\partial \ln Y} < 1
$$

A elasticidade-renda da demanda por alimentação é **positiva, mas menor que 1** (bens de
primeira necessidade): quando a renda $Y$ dobra, o gasto com comida sobe — se come melhor,
com proteína animal, fora de casa — mas **menos que proporcionalmente**. A fatia excedente
vai para moradia melhor, transporte, educação, saúde, lazer: os bens cujo consumo responde
mais que proporcionalmente (elasticidade > 1, "bens de luxo" no sentido técnico).

Nos nossos dados: $w_{food}$ cai de **0,57** (até ½ SM) para **0,32** (acima de 5 SM).
Dois cuidados de interpretação:

1. **Participação ≠ valor absoluto.** O gasto em R$ com comida **sobe** de R$ 1.909
   (até ½ SM) para R$ 6.361/ano (acima de 5 SM). Engel é sobre a *fatia*, não o valor.
2. **Correlação transversal ≠ dinâmica da mesma família.** Estamos comparando famílias
   diferentes em um corte (2027-18). A inferência sobre "o que acontece quando a família
   fica rica" é aproximada — painel responderia melhor.

### 2.4 Urbano × rural e o papel da produção para consumo próprio

A situação censitária (`SITUACAO` 1 = urbano, 2 = rural) carrega estrutura econômica. No
rural brasileiro há **produção para consumo próprio**: alimentos que não passam pelo
mercado, logo não entram no gasto monetário registrado. Isso pode **reduzir** a participação
medida de `food` mesmo com renda baixa — o gasto de mercado subestima o consumo efetivo.
É a razão pela qual, na nossa amostra, a participação média de alimentação no rural (0,41)
fica **abaixo** da urbana (0,50), embora a renda rural média também seja menor. Os dois
efeitos puxam em direções opostas; a leitura correta é sempre condicional.

### 2.5 Escolaridade e o prêmio do capital humano

O modelo de **Mincer** relaciona log da renda com anos de escola e experiência:

$$
\ln Y = \beta_0 + \beta_1 \cdot \text{anos de estudo} + \beta_2 \cdot \text{experiência} + \varepsilon
$$

$\beta_1$ é o **retorno da escolaridade** — tipicamente 8-12% a.a. no Brasil. Nossa versão
didática usa apenas a **correlação de Pearson** entre `ANOS_EST` e `RENDA_PC`:

$$
r = \frac{\text{cov}(X, Y)}{\sigma_X \sigma_Y} \in [-1, 1]
$$

Na base, $r \approx 0{,}27$: positiva, moderada. Por que não maior? Porque correlação par a
par ignora **variáveis omitidas** (idade, região, setor, origem familiar) e porque renda tem
cauda longa — poucos casos de renda altíssima puxam a média sem alargar o nuvem de pontos.
Correlação **não é causalidade**: é a porta de entrada, não o veredito.

### 2.6 Por que "não-ponderada" importa

A POF é uma **amostra estratificada**: domicílios entram com pesos (`fator de expansão`)
que fazem a amostra reconstituir a população. Esta versão didática **não traz pesos** —
todas as médias são não-ponderadas. Consequências práticas:

- Regiões com amostragem mais intensa (SP, MG, DF) pesam mais do que representam;
- Estimativas de **totais** (ex.: gasto total do Brasil) ficam sem sentido;
- Estimativas de **médias e proporções** continuam informativas — mas com erro amostral
  desconhecido.

Regra profissional: com dados amostrais, sempre pergunte *"onde está o peso?"* antes de
publicar um número.

## 3. Roteiro do notebook

`a13_pof_microdados_lab.ipynb` — 39 células, kernel `oikos_py`, dados em `../data/csv/`.

| § | Seção | O que observar |
|---|---|---|
| — | Objetivos | o contrato da aula: 4 habilidades + a limitação de pesos |
| setup | Célula padrão | trio científico + `brl()` + `DATA = Path("../data/csv")` |
| 1 | Conhecendo as bases | 57.920 × 58.039 × 57.799 linhas; o ritual de inspeção (`shape`, `describe`, `value_counts`); despesa_total criada como soma das categorias |
| 2 | O merge | 58.039 → 57.920 na deduplicação (119 duplicatas); merge 1:1 em cadeia; 57 rendas negativas descartadas (déficit de contas na POF); base final **57.742** |
| 3 | `pd.cut` | faixas em SM 2018 (R$ 954); distribuição: 8.179 até ½ SM, 35.229 entre ½-2 SM, 11.465 entre 2-5 SM, 2.871 acima de 5 SM |
| 4 | Lei de Engel | participação de food: **0,571 → 0,540 → 0,453 → 0,319**; Gráficos 1 e 2 (participação cai, valor absoluto sobe — a distinção que a aula exige) |
| 5 | Goiás (UF 52) | 2.223 domicílios após a limpeza (55% urbanos); Engel goiano; Gráfico 3 Brasil × Goiás |
| 6 | Urbano × rural | urbano: renda PC R$ 1.819, part. food 0,50; rural: R$ 1.257 e 0,41 — discutir produção para consumo próprio |
| 7 | Escolaridade × renda | renda média sobe de R$ 1.077 (sem instrução) a R$ 4.034 (superior completo) — 3,7× |
| 📝 | Exercícios (4) | housing por faixa (E1); renda urbano×rural em GO (E2); top 5 UFs acima de 5 SM (E3); correlação estudo×renda (E4) |
| 📌 | Resumo & para casa | pipeline de microdados, limitação de pesos, referências da KB |

Sugestão de ritmo em 50 min: §§1-2 (15 min) → §3 (5) → §§4-5 (15, o coração) → §6 (5) →
exercícios em dupla (10, E2 e E4 são rápidos).

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| `KeyError: 'faixa_renda'` | `pd.cut` executado antes do merge, ou nome diferente | rode as células em ordem; a coluna nasce depois do merge |
| `TypeError: cut() got multiple values for argument 'right'` | labels passados como 2º argumento posicional | use `bins=` e `labels=` por nome |
| Merge devolve menos linhas que o esperado | `how="inner"` + chave com tipo diferente (`str` vs `int`) | verifique `df["household_id"].dtype` nas duas bases |
| Merge devolve **mais** linhas | chave duplicada na base da direita (morador sem deduplicar) | `drop_duplicates("household_id")` antes do merge |
| `groupby` sem a coluna `faixa_renda` no resultado | categoria vazia omitida no pandas 3 | passe `observed=True` e leia apenas categorias com dados |
| `NaN` na faixa "até 1/2 SM" | renda negativa fora dos bins | filtro `RENDA_PC >= 0` antes do `pd.cut` |
| `ax.set_ylim` "não funciona" | executado depois do `plt.show()` | configurar o eixo **antes** de mostrar |
| Média "estranha" em NIVEL_INST 4 | grupo pequeno (2.910 obs.) e renda dispersa | olhe `n_respondentes` antes de interpretar |

## 5. Glossário

| Termo (pt) | Termo (en) | Significado |
|---|---|---|
| Microdados | microdata | base com uma linha por unidade (domicílio/pessoa), sem agregação |
| Chave de linkagem | merge/join key | coluna que identifica a mesma unidade em bases distintas |
| Pessoa de referência | reference person | respondente cuja renda define o domicílio na POF |
| Renda per capita | per capita income | renda total ÷ moradores |
| Faixa de renda | income bracket | classe de renda (aqui, em múltiplos do SM per capita) |
| Fator de expansão | survey weight | peso que reconstitui a população a partir da amostra |
| Lei de Engel | Engel's law | participação da alimentação cai com a renda |
| Elasticidade-renda da demanda | income elasticity of demand | % de variação do gasto por 1% de variação da renda |
| Produção para consumo próprio | own-production | consumo que não passa pelo mercado (comum no rural) |
| Situação censitária | urban/rural status | classificação geográfica do domicílio (1=urbano, 2=rural) |
| Correlação de Pearson | Pearson correlation | medida linear de associação entre duas variáveis contínuas |
| Variável omitida | omitted variable | fator relevante fora do modelo que distorce a associação |

## 6. Referências

- `kb/01_mckinney_python_for_data_analysis/07_chapter-5-getting-started-with-pandas.md` —
  McKinney, *Python for Data Analysis* (2012), Cap. 5: objetos Series/DataFrame, indexação
  booleana — a espinha dorsal de todas as operações do lab.
- `kb/01_mckinney_python_for_data_analysis/08_chapter-6-data-loading-storage-and-file-formats.md` —
  Cap. 6: `read_csv`, tipos, opções de leitura — a seção 1 do notebook é este capítulo em ação.
- `kb/01_mckinney_python_for_data_analysis/11_chapter-9-data-aggregation-and-group-operations.md` —
  Cap. 9: `groupby`, `agg`, tabelas dinâmicas e `cut` — seções 3, 4 e 6.
- IBGE, *POF 2017-2018: microdados* (documentação original, para quem quiser a base
  completa com pesos).

## 7. Gabarito comentado

**E1 — Participação da moradia por faixa.** Receita idêntica à da seção 4, trocando
`food` por `housing`. Resultado: **0,112 → 0,103 → 0,115 → 0,149**. A participação
**não é monotônica**: cai um pouco no meio da distribuição e sobe forte no topo
(0,11 → 0,15). Interpretação: moradia combina um componente de necessidade (todo mundo
precisa de teto) com um componente de qualidade que se expande com renda (aluguel melhor,
condomínio, manutenção). Compare com a comida, que cai ininterruptamente — a curva de
Engel da moradia é "em U invertido deitado", não a descida contínua da alimentação.

**E2 — Renda urbano × rural em Goiás.** `go.groupby("SITUACAO")["RENDA_PC"].mean()`:
urbano ≈ **R$ 1.758**, rural ≈ **R$ 1.640** per capita — diferença de apenas ~7%, muito
menor que no Brasil (R$ 1.819 vs R$ 1.257, gap de ~45%). Interpretação: no Cerrado
granoleiro o campo **produz e monetiza** (soja, milho, pecuária), o que aproxima a renda
monetária rural da urbana — diferentemente do rural de subsistência do Norte/Nordeste.

**E3 — Top 5 UFs com renda per capita acima de 5 SM.** A técnica: criar a série booleana
`(pof["RENDA_PC"] > 5 * SM_2018)`, agregá-la com `.groupby("UF")...mean()` (média de
True/False = proporção) e ordenar. Resultado: **DF 19,4% · SP 9,9% · RS 8,5% · RJ 8,0% ·
SC 6,9%**. Goiás fica com **3,8%** — fora do top 5, coerente com uma economia puxada por
agro e serviços médios, com classe média robusta mas poucos domicílios de renda alta; o DF,
casa do funcionalismo federal, lidera disparado.

**E4 — Correlação anos de estudo × renda.** `pof[["ANOS_EST", "RENDA_PC"]].corr()`:
**r ≈ 0,27** — positiva e moderada. O que ela NÃO diz: causalidade. Famílias de origem
mais ricas dão mais escola **e** mais rede; idade e setor confundem; e a relação pode ser
não-linear (o salto do superior completo é maior que o do fundamental). O prêmio de
Mincer (regressão com controles) viria depois — aqui, a correlação só certifica que a
associação bruta existe e aponta para cima.

---

*Material didático — os números citados podem variar levemente conforme o filtro de
duplicatas escolhido; a lógica da análise não muda.*