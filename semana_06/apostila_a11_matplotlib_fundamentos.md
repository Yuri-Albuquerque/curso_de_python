# Apostila Aula 11 — Matplotlib Fundamentos: gráficos para relatórios econômicos
> Curso Python para Economistas — OIKOS/UEG · Semana 6

## 1. Por que isso importa (intuição econômica)

Quem lê relatório econômico não lê tabela: olha o gráfico. Uma tabela com 2.430 linhas
da Selic diária diz pouco à primeira vista; a mesma série desenhada revela em dois
segundos o ciclo de juros — a queda até 1,90% a.a. na pandemia, o aperto de 2022–23
e o patamar de 13,90% a.a. em setembro de 2026. Gráfico não é enfeite: é **argumento
condensado**. Um bom gráfico de relatório tem uma mensagem, e o título é quem a
enuncia ("A distância entre as linhas é o juro real"), não descreve o que foi plotado
("Selic e IPCA").

Para quem vai trabalhar em consultoria, empresa júnior, secretaria de fazenda ou
banco, a habilidade de produzir um gráfico limpo — com eixo em reais, fonte citada,
300 dpi prontos para impressão — é tão cobrada quanto saber rodar a regressão.
O padrão do mercado brasileiro é o PNG de alta resolução colado no Word/PDF do
relatório, com formatação de moeda `R$ 1.687,00` e rótulos que qualquer gerente
entende sem pedir legenda.

A Aula 11 usa duas fontes reais: as séries do **BCB (Selic diária e IPCA mensal)**
e a **POF 2017-18 do IBGE** (renda per capita por UF). Na próxima aula o Seaborn
acelera a parte estatística; aqui o objetivo é dominar a base — **Matplotlib** —
porque tudo no ecossistema Python (pandas `.plot`, seaborn, scikit-learn) desenha
por baixo nos mesmos objetos desta aula.

## 2. Teoria essencial

### 2.1 Anatomia: Figure, Axes, Axis

Matplotlib organiza o desenho em três camadas:

| Objeto | Papel | Analogia |
|---|---|---|
| `Figure` | a folha inteira onde tudo é desenhado e exportado | o papel |
| `Axes` | um gráfico (título, eixos, séries, legenda) | o quadro no papel |
| `Axis` | um eixo individual (ticks, rótulos, escala) | a régua do quadro |

A receita básica da interface **orientada a objetos (OO)** — a que vamos usar sempre:

```python
fig, ax = plt.subplots()   # uma folha, um quadro
ax.plot(x, y)              # desenho NO quadro (ax), não em funções globais
```

`plt.subplots()` devolve dois objetos: a `Figure` (guarde para o `savefig`) e o `Axes`
(guarde para customizar). Existe também a interface `pyplot` "de estado global"
(`plt.plot(...)`, `plt.title(...)`), útil em scripts rápidos, mas ela vira bagunça
com vários painéis; em relatório, OO vence.

### 2.2 Os métodos que resolvem 90% da customização

| O que você quer | Método no `ax` |
|---|---|
| Título do quadro | `ax.set_title("...")` |
| Rótulo dos eixos | `ax.set_xlabel(...)` / `ax.set_ylabel(...)` |
| Título da folha inteira | `fig.suptitle(...)` |
| Legenda (exige `label=` nos plots) | `ax.legend()` |
| Malha de fundo | `ax.grid(axis="x"/"y", alpha=...)` |
| Limites do eixo | `ax.set_xlim(...)` / `ax.set_ylim(...)` |
| Formato dos números do eixo | `ax.yaxis.set_major_formatter(...)` |
| Texto solto no quadro | `ax.text(x, y, "...")` / `ax.annotate(...)` |

Padrão de título em relatório: **enuncie a conclusão**. "Selic 13,90% × IPCA 4,44%
em 12 meses: juro real segue alto" comunica; "Gráfico 3" não.

### 2.3 Formatando reais no eixo: `FuncFormatter` + `brl()`

Ticks são só números (`1687.0`). Para mostrá-los como moeda brasileira usamos um
`FuncFormatter`, que aplica uma função a cada tick:

$$\text{tick} \; x \;\longmapsto\; f(x) = \text{“R\$ ” + formato(x)}$$

```python
from matplotlib.ticker import FuncFormatter
fmt_brl = FuncFormatter(lambda v, _: brl(v))   # brl() vem da célula de setup
ax.yaxis.set_major_formatter(fmt_brl)
```

O `brl()` do setup resolve o detalhe brasileiro: ponto de milhar, vírgula decimal
(`R$ 1.687,00`). Sem ele, o f-string americano escreve `R$ 1,687.00` — erro clássico
em relatório para cliente.

### 2.4 Comparar séries: mesma unidade antes do mesmo eixo

Selic é **diária, % a.a.**; IPCA do CSV é **mensal, % no mês**. Sobrepor as duas
assim é comparar reais com dólar. A ponte é acumular o IPCA em 12 meses:

$$I_{12} = \left(\prod_{t=1}^{12} (1 + i_t)\right) - 1$$

Em pandas: `((1 + valor/100).rolling(12).apply(np.prod, raw=True) - 1) * 100`.
Com as duas séries em "% a.a.", a distância vertical entre as linhas aproxima o
**juro real ex-post** (relação de Fisher: $1+r \approx \frac{1+i}{1+\pi}$).

### 2.5 Subplots: painéis na mesma folha

`fig, axes = plt.subplots(nrows, ncols)` devolve um **array NumPy de Axes**.
Com 1 linha, `axes` é um array 1-D — acesse `axes[0]`, `axes[1]`. Com grade 2×2,
acesse `axes[0, 0]` etc. Use `sharex=True`/`sharey=True` quando os painéis devem
ser comparáveis, e `fig.suptitle()` para o título geral.

### 2.6 Salvando: `savefig` com dpi

```python
fig.savefig("figura.png", dpi=300, bbox_inches="tight")
```

- `dpi=300` é o padrão editorial (impressão nítida em Word/PDF);
  `dpi=150` só para rascunho.
- `bbox_inches="tight"` remove a margem branca excessiva.
- Para documento vetorial (zoom sem pixelizar): `.pdf` ou `.svg`.
- Chame `savefig` **antes** de `plt.show()` em scripts `.py` (no Jupyter a ordem
  importa menos, mas o hábito certo é salvar primeiro).

## 3. Roteiro do notebook

`a11_matplotlib_fundamentos.ipynb` — execute de cima a baixo no kernel **Python (oikos_py)**.

| Seção | O que faz | O que observar |
|---|---|---|
| Setup | imports, rcParams, `brl()`, `DATA = Path("../data/csv")` | o rcParams já deixa toda figura 9×4.5 com grid suave |
| 1. Por que gráficos | intuição: gráfico = argumento | — |
| 2. Anatomia OO | `fig, ax = plt.subplots()`; inspeciona Figure/Axes/Axis | o "papel" e o "quadro" são objetos separados |
| 3. Linhas: Selic × IPCA | carrega BCB, acumula IPCA 12m, sobrepõe as séries + zoom 2022→2026 | distância entre linhas ≈ juro real; `annotate` marca a Selic de set/2026 |
| 4. Barras: renda por UF | merge POF morador+domicílio, média por UF, Goiás destacado | 27 barras; DF (53) lidera, GO (52) é 11ª — destaque de cor faz o olho achar |
| 5. Customização | `FuncFormatter` com `brl()`, título-enunciado, valores nas barras | o mesmo gráfico vira "figura de relatório" |
| 6. Subplots | painéis 1×2 (Selic \| IPCA) e 2×1 com `sharex` | `axes` é array; `fig.suptitle` dá o título geral |
| 7. `savefig` | exporta PNG 300 dpi | arquivo aparece na pasta da semana |
| Exercícios | 4 exercícios com solução | tente antes de olhar o gabarito |
| Resumo | recapitulação + referências KB | — |

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| Figura não aparece no Jupyter | faltou `plt.show()` ou o objeto não está na última linha | termine a célula com `plt.show()` (ou deixe `fig` como última expressão) |
| `ValueError: could not convert string to float: '13,65'` | CSV do BCB lido sem `decimal=","` | `pd.read_csv(..., sep=";", decimal=",")` |
| Datas viram números/ordem errada no eixo | coluna como texto | `pd.to_datetime(df["data"], format="%d/%m/%Y", dayfirst=True)` |
| Rótulos do eixo X sobrepostos | muitas categorias/datas em figura pequena | aumente `figsize`, use `fig.tight_layout()` ou gire ticks (`rotation=45`) |
| Barras em ordem "aleatória" | `groupby` não ordenado | `.sort_values(ascending=False)` antes de plotar |
| Eixo Y com `1,687.00` | separadores americanos | `FuncFormatter(lambda v, _: brl(v))` |
| Merge devolveu mais linhas que a tabela original | chave duplicada nas duas tabelas | verifique com `validate="one_to_one"`; `drop_duplicates` na chave |
| Duas séries sem sentido no mesmo gráfico | unidades diferentes (% mensal × % a.a.) | acumule o IPCA em 12 meses antes de sobrepor |
| PNG borrado no Word | dpi baixo | `fig.savefig("f.png", dpi=300, bbox_inches="tight")` |
| Figura anterior reaparece "suja" na nova | reusable figure | crie `fig, ax = plt.subplots()` de novo a cada gráfico |

## 5. Glossário

| Termo (en) | Em pt | Significado |
|---|---|---|
| Figure | figura/folha | objeto-mestre que contém tudo e é exportado |
| Axes | quadro/gráfico | um gráfico individual dentro da Figure |
| Axis | eixo | régua de um Axes (ticks, rótulos, escala) |
| Artist | elemento de desenho | qualquer coisa desenhável (linha, texto, barra) |
| OO interface | interface OO | estilo `fig, ax` (recomendado) vs `plt.plot()` global |
| subplots | subgráficos | grade de Axes na mesma Figure |
| formatter | formatador | função que transforma tick numérico em texto (`R$ 1.687`) |
| locator | localizador | escolhe *quais* ticks aparecem |
| DPI | ppp | pontos por polega — densidade do PNG exportado |
| raster vs vetorial | matricial vs vetorial | PNG pixela ao dar zoom; PDF/SVG não |
| tight_layout | — | reorganiza elementos para não sobreporem |
| FuncFormatter | formatador funcional | aplica sua função a cada tick |

## 6. Referências

- `kb/02_vanderplas_python_data_science_handbook/07_chapter-4-visualization-with-matplotlib.md`
  — VanderPlas, *Python Data Science Handbook*, Cap. 4: anatomia Figure/Axes,
  interface OO, line plots, bar charts, subplots, customização de ticks.
- `kb/01_mckinney_python_for_data_analysis/10_chapter-8-plotting-and-visualization.md`
  — McKinney, *Python for Data Analysis*, Cap. 8: Figuras e Subplots, cores,
  rótulos, legendas, exportação de imagens.
- Dados: `data/csv/selic_diaria_aa.csv` (BCB-SGS 1178), `data/csv/ipca_mensal.csv`
  (BCB-SGS 433), `data/csv/pof_morador.csv` + `pof_domicilio.csv` (POF 2017-18, IBGE).

## 7. Gabarito comentado

**Exercício 1 — Renda urbano × rural em barras.** A ideia é reaproveitar o `pof`
já mesclado, agregar por `SITUACAO` (1 = urbano, 2 = rural) e usar o formatter de
reais. O título enuncia a conclusão (a diferença calculada, ~R$ 562/mês), não o
conteúdo do eixo.

```python
media_sit = pof.groupby("SITUACAO")["RENDA_PC"].mean()   # 1=urbano, 2=rural
fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(["Urbano", "Rural"], media_sit.values, color=["#4c72b0", "#8e6c3f"], width=0.55)
ax.yaxis.set_major_formatter(fmt_brl)
ax.set_title(f"Renda per capita urbana supera a rural em "
             f"R$ {media_sit[1] - media_sit[2]:,.0f}/mês")
ax.set_ylabel("R$ / mês (per capita)")
for i, v in enumerate(media_sit.values):
    ax.text(i, v + 25, brl(v), ha="center", fontsize=10)
plt.show()
```

**Exercício 2 — O pico do IPCA mensal (2024→2026) em barras.** Três passos:
filtrar a janela, achar o mês do máximo com `idxmax()`, e pintar **só** a barra do
pico de vermelho. A comparação de cor é mais rápida de ler do que qualquer tabela.

```python
i3 = ipca[ipca["data"] >= "2024-01-01"]
imax = i3["valor"].idxmax()
cores = ["#c0392b" if idx == imax else "#4c72b0" for idx in i3.index]
pico_txt = f"{i3.loc[imax, 'valor']:.2f}".replace(".", ",")
fig, ax = plt.subplots(figsize=(10, 4))
ax.bar(i3["data"].dt.strftime("%m/%Y"), i3["valor"], color=cores)
ax.set_title(f"Pico do IPCA mensal: {i3.loc[imax, 'data'].strftime('%m/%Y')} "
             f"({pico_txt}%)")
ax.set_ylabel("IPCA no mês (%)")
ax.tick_params(axis="x", rotation=90)
plt.show()
```

**Exercício 3 — Média vs mediana nas 5 UFs mais ricas.** O ponto econômico: mesmo
nas UFs ricas a média fica **acima** da mediana — sinal de assimetria (cauda de
renda alta). Com `sharey=True` os painéis são comparáveis de verdade.

```python
est = pof.groupby("UF")["RENDA_PC"].agg(["mean", "median"]).loc[renda_uf.head(5).index]
siglas = [UF_SIGLA[u] for u in est.index]
fig, axes = plt.subplots(1, 2, figsize=(11, 4), sharey=True)
axes[0].bar(siglas, est["mean"], color="#1f4e79")
axes[0].set_title("Média")
axes[1].bar(siglas, est["median"], color="#27ae60")
axes[1].set_title("Mediana")
for ax in axes:
    ax.yaxis.set_major_formatter(fmt_brl)
fig.suptitle("A média fica acima da mediana — renda é assimétrica até nas UFs ricas",
             y=1.04)
fig.tight_layout()
plt.show()
```

**Exercício 4 — Exportar o gráfico Selic × IPCA a 300 dpi.** Refaça o overlay da
seção 3 e salve com `dpi=300, bbox_inches="tight"`. O `print` confirma o tamanho
do arquivo — verificação mínima de que o PNG existe.

```python
fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(selic["data"], selic["valor"], color="#1f4e79", lw=1.6, label="Selic (% a.a.)")
ax.plot(ipca["data"], ipca["acum12"], color="#c0392b", lw=1.2,
        label="IPCA acumulado 12m (%)")
ax.set_title("Juro nominal vs inflação — Brasil, 2017 a 2026")
ax.set_ylabel("% a.a.")
ax.legend()
fig.savefig("fig_a11_ex4_juro_inflacao.png", dpi=300, bbox_inches="tight")
plt.show()
print("PNG salvo:", Path("fig_a11_ex4_juro_inflacao.png").stat().st_size // 1024, "KB")
```