# Apostila Aula 12 — Seaborn Estatístico: distribuições, correlação e desigualdade
> Curso Python para Economistas — OIKOS/UEG · Semana 6

## 1. Por que isso importa (intuição econômica)

A média de renda per capita da POF 2017-18 é **R$ 1.687**; a mediana é **R$ 1.155**.
Uma diferença de R$ 532 na *mesma* distribuição não é erro de conta: é a assinatura
estatística da **desigualdade**. Poucas famílias com renda muito alta puxam a média
para cima, enquanto a maioria vive abaixo dela. Quem relata só a média mente sem
dizer mentira; quem mostra a **distribuição** (histograma, densidade, boxplot)
conta a história completa.

Esta aula apresenta o **seaborn**, a camada estatística sobre o Matplotlib que
fizemos à mão na Aula 11: em uma linha você tem histograma com densidade, boxplot
com quartis, reta de tendência sobre o dispersão e mapa de calor de correlações —
todos com eixos rotulados e estética consistente. Menos código, mais estatística.

Os exemplos usam a **POF 2017-18 (IBGE)**: renda per capita da pessoa de referência,
gasto anual por categoria (alimentação, moradia, transporte, saúde, outros) e a
situação do domicílio (urbano/rural). Três perguntas econômicas guiam a aula:
(1) como é a distribuição de renda no Brasil? (2) o gasto acompanha a renda? — aqui
entra a **Lei de Engel**: a participação da alimentação no orçamento **cai** quando
a renda sobe (na POF, de ~68% no tercil pobre para ~60% no tercil rico). (3) o
padrão urbano-rural se repete em todos os níveis de escolaridade?

## 2. Teoria essencial

### 2.1 Distribuição: histograma e densidade

O histograma divide o eixo X em **bins** (faixas) e conta quantas observações caem
em cada uma. Duas escolhas governam o resultado:

- **Poucos bins** escondem a forma (tudo vira um "bloco"); **muitos bins** viram
  ruído. Comece com `bins=40..60` e ajuste olhando.
- `stat="density"` normaliza a altura para que a **área total = 1** — útil para
  sobrepor dois grupos de tamanhos diferentes (ex.: Brasil × Goiás).

A curva de densidade (**KDE**, kernel density estimate) suaviza o histograma: cada
ponto "empresta" massa a uma janela ao redor e as janelas se somam. Em renda,
sempre passe `cut=0` (ou `clip=(0, ...)`): a curva padrão do KDE extrapola para
valores **negativos**, que para renda não existem.

### 2.2 Assimetria: por que a média mente

Se a distribuição tem cauda direita longa (assimetria positiva), observações
extremas puxam a média:

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i \qquad \text{vs} \qquad \text{mediana} = F^{-1}(0{,}5)$$

Para a RENDA_PC da POF: média **R$ 1.687**, mediana **R$ 1.155**, assimetria
(skewness) ≈ **22** — assimetria forte. Regra de bolso: $\bar{x} > \text{mediana}$
indica cauda direita. Por isso, em renda e riqueza, **relate sempre as duas**, e
prefira a mediana como "typical household".

### 2.3 Boxplot: cinco números e outliers

O boxplot resume Q1 (25%), mediana, Q3 (75%), os limites $Q_1 - 1{,}5 \times \text{IQR}$
e $Q_3 + 1{,}5 \times \text{IQR}$ (IQR = $Q_3 - Q_1$) e marca outliers além deles.
Em renda, os outliers são legítimos (famílias ricas de verdade) — mas com ~58 mil
domicílios eles achatam todas as caixas no gráfico. `showfliers=False` **não
apaga dados da análise**: só da visualização, para que a comparação das caixas
fique legível.

### 2.4 Dispersão, tendência e correlação

O scatterplot de duas variáveis mostra a relação bruta; o `regplot` adiciona a reta
de mínimos quadrados. O resumo numérico é a correlação de Pearson:

$$\rho_{X,Y} = \frac{\operatorname{cov}(X,Y)}{\sigma_X\,\sigma_Y}, \qquad -1 \le \rho \le 1$$

Na POF: $\rho(\text{renda}, \text{alimentação}) \approx 0{,}29$ — positiva, mas
moderada. O heatmap organiza todas as correlações de uma matriz em cores: use
**sempre** `vmin=-1, vmax=1` para que a escala de cor seja comparável entre
gráficos. E o aviso obrigatório: **correlação não é causalidade** — renda e gasto
em "other" correlacionam 0,26; nada disso diz o que causa o quê.

### 2.5 Facetas: o mesmo gráfico, fatiado

**Facetas** (*small multiples*) repetem o mesmo gráfico variando um grupo: a
comparação fica na posição, não na memória do leitor. `sns.catplot(col=...)`
gera um painel por grupo (ex.: urbano/rural dentro de cada nível de escolaridade).
É a resposta visual para "o padrão se mantém nos subgrupos?" — pergunta diária de
economista.

### 2.6 A ponte com a Aula 11

Seaborn **é** Matplotlib: `sns.histplot(data=pof, x="RENDA_PC", ax=ax)` desenha
no mesmo `ax` da Aula 11, e todo o arsenal (formatter de reais, `set_title`,
`savefig`) continua valendo. Com FacetGrid, formate os eixos iterando
`for ax in g.axes.flat:`.

## 3. Roteiro do notebook

`a12_seaborn_estatistica.ipynb` — execute de cima a baixo no kernel **Python (oikos_py)**.

| Seção | O que faz | O que observar |
|---|---|---|
| Setup | imports + `sns.set_theme(style="whitegrid")` + `brl()` | o tema do seaborn reformata todos os gráficos seguintes |
| 1. Por que estatístico | média × mediana da POF como gancho | — |
| 2. `histplot` RENDA_PC | histograma linear e depois `log_scale=True` | a cauda direita domina a escala linear; log revela o "corpo" da distribuição |
| 3. `kdeplot` + média/mediana | densidade com `axvline` nas duas medidas | a média (R$ 1.687) cai à direita da mediana (R$ 1.155) |
| 4. `boxplot` por escolaridade | NIVEL_INST 1–7 mapeados em rótulos | gradiente monotônico: cada nível sobe a mediana |
| 5. scatter renda × gasto | merge com despesas, amostra de 4.000 domicílios, `regplot` da participação da alimentação | Lei de Engel: reta da participação **desce** com a renda |
| 6. heatmap de correlação | matriz 5×5 entre categorias de gasto | todas positivas (efeito renda/tamanho da família); `vmin/vmax` fixos |
| 7. urbano × rural | `boxplot` + `catplot` com facetas por escolaridade | a diferença urbano-rural repete-se em todos os níveis |
| Exercícios | 4 exercícios com solução | tente antes do gabarito |
| Resumo | recapitulação + referências KB | — |

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| Histograma em "escada" ou tudo numa barra | bins mal escolhidos | `bins=50` (ou `binrange=`); teste 2–3 valores |
| KDE negativa antes de zero | curva extrapolada | `cut=0` ou `clip=(0, quantil)` no `kdeplot` |
| Boxplots achatados, caixas ilegíveis | outliers extremos de renda | `showfliers=False` (só visual; análise continua com todos) |
| Eixo de correlação "mentindo" | heatmap sem escala fixa | `sns.heatmap(..., vmin=-1, vmax=1, cmap="RdBu_r")` |
| Gráfico demora/engasga | 57 mil pontos no scatter | `df.sample(4000, random_state=42)` + `alpha=0.3` |
| `KeyError: 'SITUACAO'` | esqueceu o merge com `pof_domicilio.csv` | `morador.merge(domicilio, on="household_id")` |
| Barras do boxplot em ordem errada | categorias como texto solto | passe `order=` explícita (ex.: níveis 1→7) |
| `NaN` no boxplot por escolaridade | `NIVEL_INST` com missing | `dropna(subset=["NIVEL_INST"])` antes de rotular |
| Formatter não aplica no `catplot` | FacetGrid tem vários eixos | `for ax in g.axes.flat: ax.yaxis.set_major_formatter(fmt_brl)` |
| "Renda alta causa gasto em X" no relatório | confundir correlação com causalidade | correlação descreve; causalidade exige desenho/identificação |

## 5. Glossário

| Termo (en) | Em pt | Significado |
|---|---|---|
| histogram / bins | histograma / faixas | contagem por faixa de valores |
| KDE (kernel density) | densidade suavizada | estimativa contínua da distribuição |
| skewness | assimetria | > 0: cauda à direita (média > mediana) |
| boxplot | diagrama de caixa | Q1, mediana, Q3, limites 1,5×IQR, outliers |
| IQR | amplitude interquartil | Q3 − Q1, dispersão do "miolo" |
| outlier | valor atípico | observação além dos limites do boxplot |
| scatterplot | diagrama de dispersão | cada ponto = uma observação (x, y) |
| regplot | reta de tendência | scatter + regressão linear simples |
| Pearson correlation | correlação de Pearson | ρ ∈ [−1, 1], relação linear |
| heatmap | mapa de calor | matriz codificada em cores |
| facet / small multiples | facetas | mesmo gráfico repetido por subgrupo |
| `showfliers` | mostrar atípicos | controla desenho (não a análise) dos outliers |

## 6. Referências

- `kb/02_vanderplas_python_data_science_handbook/07_chapter-4-visualization-with-matplotlib.md`
  — VanderPlas, Cap. 4: estilos, gráficos de densidade/contorno, histogramas,
  customização de legendas e eixos (a base que o seaborn automatiza).
- Leitura complementar: `kb/01_mckinney_python_for_data_analysis/10_chapter-8-plotting-and-visualization.md`
  — McKinney, Cap. 8 (visão geral de plotting com pandas/Matplotlib).
- Dados: `data/csv/pof_morador.csv` (RENDA_PC, NIVEL_INST, ANOS_EST),
  `data/csv/pof_domicilio.csv` (UF, SITUACAO), `data/csv/pof_despesa_categoria.csv`
  (gasto anual por categoria). Estatísticas **não-ponderadas** (esta amostra da POF
  não traz pesos).

## 7. Gabarito comentado

**Exercício 1 — Brasil × Goiás sobrepostos.** Sobrepor dois `histplot` exige
`stat="density"` (as áreas viram 1, então escalas diferentes não quebram a
comparação) e `label=` para a legenda. Goiás acompanha o padrão nacional — na
mediana, até um pouco acima (GO: R$ 1.313 vs BR: R$ 1.155).

```python
go = pof[pof["UF"] == 52]
fig, ax = plt.subplots()
sns.histplot(data=pof, x="RENDA_PC", bins=50, stat="density",
             color="#4c72b0", alpha=0.4, label="Brasil", ax=ax)
sns.histplot(data=go, x="RENDA_PC", bins=50, stat="density",
             color="#e67e22", alpha=0.5, label="Goiás (52)", ax=ax)
ax.xaxis.set_major_formatter(fmt_brl)
ax.set_title("Goiás acompanha o padrão nacional de renda — cauda direita idêntica")
ax.legend()
plt.show()
```

**Exercício 2 — Renda por faixa de anos de estudo.** `pd.cut` cria as faixas
(até 4 anos, 5–11, 12 ou mais) e o boxplot mostra o gradiente educacional
(monotônico). `showfliers=False` deixa as caixas legíveis.

```python
pof["ESTUDO_FAIXA"] = pd.cut(pof["ANOS_EST"], bins=[-1, 4, 11, np.inf],
                             labels=["Até 4 anos", "5 a 11", "12 ou mais"])
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.boxplot(data=pof, x="ESTUDO_FAIXA", y="RENDA_PC", showfliers=False, ax=ax)
ax.yaxis.set_major_formatter(fmt_brl)
ax.set_title("Cada faixa de estudo eleva a renda mediana — gradiente monotônico")
ax.set_xlabel("Anos de estudo (pessoa de referência)")
plt.show()
```

**Exercício 3 — Transporte: o gasto que cresce rápido com a renda.** Repita o
`regplot` da seção 5 com `transport`. A inclinação da reta é positiva e forte:
transporte (veículo, combustível) comporta-se como bem cujo consumo acelera com
renda — quase o oposto da Lei de Engel da alimentação.

```python
amostra = pof_desp.sample(4000, random_state=42)
fig, ax = plt.subplots()
sns.regplot(data=amostra, x="RENDA_PC", y="transport",
            scatter_kws={"s": 12, "alpha": 0.3}, line_kws={"color": "#c0392b"}, ax=ax)
ax.xaxis.set_major_formatter(fmt_brl)
ax.yaxis.set_major_formatter(fmt_brl)
ax.set_title("Gasto anual com transporte cresce rapidamente com a renda")
plt.show()
print("Correlação renda × transporte:",
      round(pof_desp["RENDA_PC"].corr(pof_desp["transport"]), 3))
```

**Exercício 4 — Matriz de correlações urbano × rural, lado a lado.** Dois
heatmaps em `subplots(1, 2)` com a **mesma escala** (`vmin=-1, vmax=1,
cbar=False`) para que as cores sejam comparáveis. O miolo das correlações é
parecido; as diferenças (ex.: food×housing) merecem uma frase no relatório.

```python
cats = ["food", "housing", "transport", "health", "other"]
fig, axes = plt.subplots(1, 2, figsize=(13, 5), sharey=True)
for ax, sit, titulo in [(axes[0], 1, "Urbano"), (axes[1], 2, "Rural")]:
    sub = pof_desp[pof_desp["SITUACAO"] == sit]
    sns.heatmap(sub[cats].corr(), annot=True, fmt=".2f", cmap="RdBu_r",
                vmin=-1, vmax=1, square=True, cbar=False, ax=ax)
    ax.set_title(f"{titulo} (n = {len(sub):,})")
plt.show()
```