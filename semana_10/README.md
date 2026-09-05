# Semana 10 — Regressão com scikit-learn e Projeto Final

> Curso Python para Economistas — OIKOS/UEG · Empresa Júnior · Ciências Econômicas

## Visão geral da semana

A Semana 10 fecha o curso conectando tudo o que foi aprendido à prática de
modelagem preditiva. A Aula 19 apresenta a API de estimadores do **scikit-learn**
(`fit` / `predict` / `score`) com dois casos: uma **demanda sintetizada** (para ver
o método recuperar parâmetros conhecidos) e a **previsão do preço da soja em
R$/sc60kg** com dados REAIS (futuros CBOT + câmbio BCB). A Aula 20 é o **projeto
final**: um mini-relatório de consultoria sobre a soja em Goiás, construindo a
esteira completa coleta → tratamento → modelagem → visualização, além de boas
práticas de entrega no GitHub.

Metodologia: code-along no JupyterLab (2 aulas de 50 min). O aluno roda cada célula
junto com o instrutor; apostila de leitura antes da aula, notebook durante.

## Aulas

| Aula | Tema | Notebook | Apostila | Dados |
|---|---|---|---|---|
| 19 | Regressão linear com scikit-learn | `a19_regressao_sklearn.ipynb` | `apostila_a19_regressao_sklearn.md` | `soja_cbot_usd_bushel.csv` + `usdbrl_diario.csv` (+ dado sintetizado com `numpy`) |
| 20 | Projeto final e integração | `a20_projeto_final_integracao.ipynb` | `apostila_a20_projeto_final_integracao.md` | `soja_cbot_usd_bushel.csv`, `usdbrl_diario.csv` (+ `boi_gordo_cme_usd_lbs.csv` nos exercícios) |

## Objetivos da semana

Ao final da semana, o aluno será capaz de:

- Usar a API do scikit-learn: instanciar estimador, `fit`, `predict`, `score`;
- Separar treino e teste com `train_test_split` (e entender por que `shuffle=False`
  em séries temporais — princípio de não vazamento de dados futuros);
- Interpretar coeficientes de regressão em unidades econômicas (R$/sc por +1 R$/US$,
 elasticidade de quantidade em relação a preço e renda);
- Avaliar um modelo com R², MSE/RMSE e MAE e comparar contra um baseline tolo;
- Construir um mini-relatório de consultoria: gráficos salvos em PNG (`savefig`,
  `dpi=300`), DataFrame-resumo executivo e conclusões escritas;
- Empacotar o projeto no GitHub (estrutura de pastas, `README.md`,
  `requirements.txt`, notebooks limpos) e publicar no GitHub Pages.

## Como rodar

```bash
# 1) Ative o ambiente do curso (criado na Semana 1)
conda activate oikos_py

# 2) Suba o JupyterLab a partir da raiz do curso
cd curso_de_python/
jupyter lab

# 3) Abra semana_10/a19_regressao_sklearn.ipynb
#    e execute as células de cima a baixo (Shift+Enter)
```

Requisito novo desta semana: **scikit-learn** (já instalado no `oikos_py`).
Se estiver em outra máquina: `pip install scikit-learn`.

## Estudo da semana (antes das aulas)

1. Ler a **apostila da Aula 19** (Seções 1–2 antes da aula; 4–7 depois).
2. Rodar o notebook A19 e terminar os 4 exercícios.
3. Ler a **apostila da Aula 20** (Seção 2 traz o roteiro do projeto; Seção 7 traz
   a rubrica de entrega OIKOS).
4. **Projeto final (entrega)**: seguir a rubrica da Aula 20 — repositório no GitHub
   com o mini-relatório de consultoria sobre a soja em Goiás.

## Convenções usadas nos notebooks

- Kernel: `oikos_py` (Python 3.11) — *Kernel → Change Kernel* se necessário;
- Dados: `DATA = Path("../data/csv")` — o notebook mora em `semana_10/`;
- Preço da soja em R$/sc60kg: `US$/bu × 60/27,216 × câmbio` (1 bushel = 27,216 kg;
  saca = 60 kg);
- Moeda formatada com `brl(x)` (definida na célula de setup de todo notebook);
- pandas 3.x: `ffill()`/`bfill()` (nunca `fillna(method=...)`), `pd.concat`
  (nunca `.append()`), sem `inplace=True`.

## Referências da semana (KB)

- `kb/02_vanderplas_python_data_science_handbook/08_chapter-5-machine-learning.md`
  (cap. 5 — Machine Learning, API de estimadores, bias–variância);
- `kb/03_jansen_ml_for_algorithmic_trading/13_chapter-7-linear-models-from-risk-factors-to-return-forecast.md`
  (Aula 19 — modelos lineares, Gauss–Markov, treino/teste);
- `kb/03_jansen_ml_for_algorithmic_trading/14_chapter-8-the-ml4t-workflow-from-ml-model-to-strategy-backte.md`
  (Aula 20 — workflow de ponta a ponta e armadilhas de backtest/vazamento).