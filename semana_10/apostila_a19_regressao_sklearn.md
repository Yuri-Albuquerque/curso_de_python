# Apostila Aula 19 — Regressão linear com scikit-learn
> Curso Python para Economistas — OIKOS/UEG · Semana 10

## 1. Por que isso importa (intuição econômica)

Toda aula anterior construiu peças: NumPy para calcular, pandas para organizar,
matplotlib para mostrar. Esta aula monta a peça que transforma dados em **números
que respondem perguntas**: quanto a quantidade demandada cai quando o preço sobe?
Quanto do preço da soja em reais é explicado pelo câmbio?

A regressão linear é o cavalo de batalha da economia aplicada. É o instrumento por
trás de "a elasticidade-preço da demanda é −0,7", de "cada +1 real no câmbio
adiciona R$ 22 na saca de soja", de "essa variável explica 95% da variação". O
scikit-learn (`sklearn`) é a biblioteca padrão para isso em Python — e a mesma API
que você usou aqui para regressão serve depois para árvores, florestas aleatórias
e o que vier no mercado de trabalho.

Há um detalhe que distingue economista de "rodei `fit()` e acabou": a diferença
entre **explicar** e **prever**. Um modelo com R² de 0,95 fora da amostra é útil
para prever o preço de amanhã; um modelo com coeficiente enviesado por um problema
de identificação é inútil para dizer o efeito causal do câmbio. As duas perguntas
são legítimas — mas pedem cuidados diferentes, e a aula separa as duas.

### O caso da demanda sintetizada

Para confiar num método, primeiro o testamos num problema em que **conhecemos a
resposta**. Vamos gerar dados artificiais com uma regra exata —
$Q = 500 - 2{,}5P + 0{,}8R + \varepsilon$ — e pedir ao scikit-learn que
recupere os coeficientes só vendo os dados. Se a máquina devolve −2,4 e +0,8,
aprendemos duas coisas: o método funciona, e o ruído ($\varepsilon$) é a razão de
não recuperarmos exatamente −2,5 e 0,8. Amostra pequena + ruído = estimativas
imprecisas. Esse é o ensaio de fumaça antes do dado real.

### O parágrafo honesto sobre simultaneidade

Com dados **reais** de mercado, a demanda não é identificada dessa forma simples:
preço e quantidade são observados **juntos no equilíbrio**, e ambos se movem com a
oferta. Se uma seca desloca a oferta para a esquerda, o preço sobe e a quantidade
cai — e a regressão "demanda" sobre dados de equilíbrio mistura os dois deslocamentos,
produzindo um coeficiente de preço **enviesado** (viés de simultaneidade, o problema
clássico de identificação da curva de demanda, de Working (1927) a Angrist & Krueger).
Por isso a demanda sintetizada é gerada por nós, com preço e renda definidos **antes**
do ruído — aí a regressão recupera a verdade. Nos dados de soja, a aula muda a
pergunta: em vez de identificar demanda, **preveemos o preço em reais** a partir de
câmbio, preço internacional e momentum — um problema preditivo, legítimo, em que o
R² fora da amostra é a nota que importa.

## 2. Teoria essencial

### 2.1 O modelo e o ajuste por mínimos quadrados

O modelo linear múltiplo:

$$y_i = \beta_0 + \beta_1 x_{1,i} + \beta_2 x_{2,i} + \dots + \beta_k x_{k,i} + \varepsilon_i$$

O método de **mínimos quadrados ordinários (OLS)** escolhe os $\hat\beta$ que
minimizam a soma dos quadrados dos resíduos:

$$\min_{\hat\beta_0,\dots,\hat\beta_k} \sum_{i=1}^{n} \big(y_i - \hat\beta_0 - \hat\beta_1 x_{1,i} - \dots - \hat\beta_k x_{k,i}\big)^2$$

Intuição geométrica: no caso de uma só variável explicativa, é a reta que passa
"no meio" da nuvem de pontos, minimizando a distância vertical (ao quadrado) de
cada ponto até ela. No caso múltiplo, é o hiperplano. O scikit-learn resolve isso
numericamente; você não precisa ver a matriz, mas é bom saber que a solução fechada
existe ($\hat\beta = (X^\top X)^{-1} X^\top y$).

### 2.2 A API de estimadores do scikit-learn

Todo estimador do sklearn segue o **mesmo contrato de três verbos**:

| Verbo | O que faz | Análogo econométrico |
|---|---|---|
| `modelo = LinearRegression()` | instancia (define o método) | "vou estimar por OLS" |
| `modelo.fit(X, y)` | ajusta aos dados (aprende $\hat\beta$) | "rodar a regressão" |
| `modelo.predict(X_novo)` | gera previsões | "prever y para novos x" |
| `modelo.score(X, y)` | devolve o R² (no regressor linear) | "$R^2$ da regressão" |

Por convenção: `X` maiúsculo = matriz de features (2D, formato `[n_amostras,
n_features]`); `y` minúsculo = alvo (1D). Atributos aprendidos terminam em
underscore: `coef_` (os $\hat\beta$) e `intercept_` (o $\hat\beta_0$). Esse padrão
repete-se em **todo** o scikit-learn — aprender um estimador é aprender todos.

### 2.3 Treino e teste: por que separar?

Avaliar o modelo nos mesmos dados usados para ajustá-lo é corrigir a prova no
gabarito: com coeficientes suficientes, qualquer conjunto fica bem ajustado
(**overfitting**). O padrão é dividir os dados:

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, shuffle=False)
```

- `test_size=0.25`: 75% treina, 25% testa;
- `random_state=42`: reprodutibilidade (a divisão é sempre a mesma);
- `shuffle=False`: **crucial em séries temporais**. O padrão é embaralhar; com
  dados datados, embaralhar põe 2025 no treino e 2020 no teste — o modelo "viu o
  futuro". Com `shuffle=False`, o treino é o passado e o teste é o futuro recente,
  como numa previsão real. Jansen (cap. 8) chama isso de evitar vazamento de dados
  (*data leakage*).

### 2.4 Métricas: R², MSE, RMSE, MAE

Com o modelo ajustado no treino e avaliado no teste:

$$R^2 = 1 - \frac{\sum_i (y_i - \hat{y}_i)^2}{\sum_i (y_i - \bar{y})^2} \qquad \text{MSE} = \frac{1}{n}\sum_i (y_i - \hat{y}_i)^2 \qquad \text{RMSE} = \sqrt{\text{MSE}} \qquad \text{MAE} = \frac{1}{n}\sum_i |y_i - \hat{y}_i|$$

| Métrica | Unidade | Leitura econômica | Ponto forte |
|---|---|---|---|
| R² | adimensional | % da variância de y explicada | compara modelos, baseline = 0 |
| MSE | (unidade de y)² | erro quadrático médio | penaliza erros grandes |
| RMSE | unidade de y | "erro típico" da previsão | comparável ao preço em R$/sc |
| MAE | unidade de y | erro absoluto médio | robusto a outliers, fácil de ler |

Regra de bolso: **RMSE ≥ MAE** sempre; quanto maior a diferença, mais erros grandes
(outliers) o modelo comete. E sempre compare com um **baseline tolo** — por exemplo,
prever "o preço de ontem" ou "a média do treino". Se o seu modelo não vence o tolo,
ele não é útil.

### 2.5 O que os coeficientes dizem (e o que não dizem)

No modelo de soja $\text{preço}_{R\$/sc} = \beta_0 + \beta_1 \cdot \text{câmbio} +
\beta_2 \cdot \text{preço}_{US\$/sc} + \beta_3 \cdot \text{ret}_{21d} + \varepsilon$:

- $\beta_1$ = "segurando o preço em US$ constante, cada +1 R$/US$ no câmbio
  eleva o preço da saca em $\beta_1$ reais" — espere um valor próximo de
  $\text{US\$/sc} \times$ algo, pois o preço em reais é (quase) preço em dólares
  vezes câmbio;
- $\beta_2$ = pass-through do preço internacional;
- $\beta_3$ = momentum: retorno recente pressionando o preço atual.

Coeficiente **não é causalidade**. Os coeficientes resumem associação multivariada
na amostra de treino; inferência causal exige identificar o mecanismo (exógena,
instrumento, experimento). Para previsão, isso é secundário; para política
econômica, é tudo.

## 3. Roteiro do notebook (`a19_regressao_sklearn.ipynb`)

| Seção | Conteúdo | O que observar |
|---|---|---|
| Setup | imports + `brl()` + rcParams | célula padrão do curso |
| 1 | API de estimadores: `fit`/`predict`/`score` | o mesmo verbo serve para qualquer modelo |
| 2 | Caso 1 — demanda sintetizada (`default_rng(42)`) | coeficientes recuperados ≈ −2,5 e +0,8; ruído explica o desvio |
| 3 | Parágrafo sobre simultaneidade | por que demanda sobre dados reais é enviesada |
| 4 | Caso 2 (dados reais) — montagem do dataset | conversão US$/bu → R$/sc60kg; merge soja × câmbio por data |
| 5 | Feature engineering: retorno de 21 dias | `pct_change(21)`; janela ~1 mês de pregões |
| 6 | Treino/teste com `shuffle=False` | 75/25; treino = passado, teste = 2025+ |
| 7 | Ajuste, métricas e interpretação | R², RMSE, MAE vs baseline; coeficientes em reais |
| 8 | Gráfico: realizado vs previsto no teste | visualizar onde o modelo erra |
| 📝 Exercícios | 4 exercícios com solução | faça antes de olhar o gabarito |

**Números esperados** (para você se checar): com o recorte do notebook, o modelo
com 3 features atinge R² de treino ≈ 0,998 e R² de teste ≈ 0,95 — o preço em reais
é quase determinístico dado o preço em dólares e o câmbio (é uma identidade de
conversão, com ruído do retardo entre fechamentos). Coeficiente do câmbio ≈ +22
R$/sc por +1 R$/US$; coeficiente do preço em US$ ≈ +4,9 R$/sc por +1 US$/sc
(≈ 5,1, o câmbio médio). Se o seu R² de teste der muito abaixo disso, procure
vazamento ou erro de merge.

## 4. Erros comuns e diagnóstico

| Erro | Causa provável | Correção |
|---|---|---|
| `ValueError: Expected 2D array, got 1D array` | passou `X` como Series/array 1D | use `df[['col']]` (DataFrame com colchetes duplos) ou `.values.reshape(-1, 1)` |
| `NameError: LinearRegression is not defined` | não importou | `from sklearn.linear_model import LinearRegression` |
| R² de teste negativo | modelo pior que prever a média | verifique split sem shuffle, ordem das colunas de X, ou baseline |
| Coeficientes absurdos (ex.: câmbio com sinal negativo) | multicolinearidade extrema ou merge duplicado | confira `df.describe()` e se o merge gerou linhas duplicadas |
| `KeyError: 'valor'` ao ler o câmbio | separador/decimal errados | `pd.read_csv(..., sep=';', decimal=',')` (BCB) |
| Datas desalinhadas após merge | formatos distintos (BCB `dd/mm/aaaa` vs CBOT `aaaa-mm-dd`) | `pd.to_datetime(..., format=..., dayfirst=True)` antes do merge |
| MSE enorme sem sentido | y em centavos vs reais misturados | padronize unidades antes de montar X e y |
| Métrica de treino ótima e de teste péssima | overfitting / vazamento | confira `shuffle=False` e features que só existem no futuro |

## 5. Glossário

| Termo (pt) | Termo (en) | Significado |
|---|---|---|
| estimador | estimator | objeto que aprende parâmetros a partir de dados (`fit`) |
| variável-alvo | target / label | o `y` que se quer explicar/prever |
| atributos / features | features | as colunas de `X` usadas como entrada |
| ajustar | fit | estimar os parâmetros do modelo nos dados de treino |
| previsão | prediction | saída de `predict` para novos dados |
| resíduo | residual | $y_i - \hat{y}_i$, o que o modelo errou |
| sobreajuste | overfitting | memorizar ruído do treino e falhar fora dele |
| vazamento de dados | data leakage | informação do futuro/teste entrando no treino |
| simultaneidade | simultaneity | preço e quantidade determinados juntos no equilíbrio |
| mínimos quadrados | OLS | critério de ajuste: minimizar soma dos resíduos ao quadrado |
| coeficiente de determinação | R² | fração da variância explicada |
| erro quadrático médio | MSE / RMSE | média do erro ao quadrado (e sua raiz) |
| erro absoluto médio | MAE | média do módulo do erro |
| baseline | dummy model | modelo tolo de referência (ex.: prever a média) |
| pass-through | pass-through | transmissão de preço internacional/dólar para preço local |

## 6. Referências

- `kb/02_vanderplas_python_data_science_handbook/08_chapter-5-machine-learning.md`
  — VanderPlas, *Python Data Science Handbook*, cap. 5 (Introducing Scikit-Learn:
  API de estimadores, `fit`/`predict`/`score`; seção de regressão linear);
- `kb/03_jansen_ml_for_algorithmic_trading/13_chapter-7-linear-models-from-risk-factors-to-return-forecast.md`
  — Jansen, *Machine Learning for Algorithmic Trading*, 2e, cap. 7 (OLS,
  Gauss–Markov, pressupostos, regressão como baseline preditivo);
- Documentação: scikit-learn — `LinearRegression`, `train_test_split`,
  `sklearn.metrics` (`r2_score`, `mean_squared_error`, `mean_absolute_error`).

## 7. Gabarito comentado

> Soluções completas também estão no notebook (células `# SOLUÇÃO N`). Aqui vai a
> discussão de cada uma.

**Exercício 1 — Demanda com outro ruído.** Gerando
$Q = 500 - 2{,}5P + 0{,}8R + \varepsilon$, $\varepsilon \sim \mathcal{N}(0,\,150)$
(ruído 2,5× maior que o da aula), com `default_rng(42)`: os coeficientes continuam
próximos de −2,5 e +0,8, mas **mais longe** do valor verdadeiro — com o mesmo n,
mais ruído significa estimativas menos precisas. Moral: nem todo desvio do modelo
é "erro de código"; parte é variância amostral.

**Exercício 2 — Um preditor só (univariada).** Prever o preço em R$/sc usando
**apenas o câmbio**: `X = df[['cambio']]`. O R² cai para ≈ 0,60 (contra ≈ 0,95 do
modelo completo) — o câmbio sozinho ignora o preço internacional, que é a maior
fonte de variação. Ainda assim é útil como referência; a comparação
univariada → multivariada é a forma mais simples de ver o ganho marginal de cada
feature.

**Exercício 3 — Baseline tolo.** Prever no teste "o último preço do treino"
(persistência) e comparar RMSE/MAE com o modelo. O modelo linear vence com
folga: o baseline não sabe que o preço em reais é dólar × câmbio, e erra muito
quando o câmbio se move. Lição: **todo modelo deve ser comparado a um tolo** —
se não vence, não serve.

**Exercício 4 — Previsão de cenário.** Com preço internacional fixado em
US$ 12,9/sc e retorno de 21 dias em 0,0 (cenário neutro), prever o preço da saca
para câmbio em R$ 5,00, 5,50 e 6,00: os valores crescem quase linearmente, com
inclinação ≈ $\beta_1$ ≈ +22 R$/sc por +1 R$/US$. É o instrumento de cenários que
uma consultoria entrega: "se o dólar for a X, a saca tende a Y, dado o resto
constante" (*ceteris paribus* feito código).