# Python para Economistas: Do Básico às Aplicações Reais

**Universidade Estadual de Goiás (UEG) — Empresa Júnior OIKOS, Ciências Econômicas**

Curso de 10 semanas (2 aulas de 50 min/semana — 20 encontros) com metodologia de
*code-along* no JupyterLab, focado em tomada de decisão econômica, valuation,
agronegócio e dados socioeconômicos brasileiros.

## Como usar este material

Cada semana tem uma pasta `semana_XX/` com:

- `README.md` — visão da semana (objetivos, resumo das aulas, checklist)
- `apostila_aNN_slug.md` — apostila de leitura (teoria, roteiro, erros comuns, gabarito)
- `aNN_slug.ipynb` — notebook executável da aula (material de apoio à ministração e estudo)

Os notebooks rodam 100% offline: todos os dados estão em `data/csv/` (séries do BCB,
futuros de commodities, microdados amostrais da POF 2017-18/IBGE).

## Ambiente (kernel `oikos_py`)

```bash
# 1. Instale o Miniconda: https://docs.conda.io/en/latest/miniconda.html
conda create -n oikos_py python=3.11 -y
conda activate oikos_py

# 2. Pacotes do curso
pip install numpy pandas matplotlib seaborn scikit-learn yfinance openpyxl jupyterlab ipykernel

# 3. Registre o kernel no JupyterLab
python -m ipykernel install --user --name oikos_py --display-name "Python (oikos_py)"

# 4. Abra o JupyterLab na raiz do curso
cd curso_de_python
jupyter lab
```

## Grade curricular

| Semana | Módulo | Aulas | Notebooks |
|---|---|---|---|
| 1 | M1 · Ambiente e Fundamentos | A1 Ecossistema Python e JupyterLab · A2 Sintaxe, tipos e variáveis econômicas | `a01`, `a02` |
| 2 | M1 · Controle de fluxo | A3 Condicionais (`if/elif/else`, `match/case`) · A4 Laços e comprehensions | `a03`, `a04` |
| 3 | M2 · Funções e POO | A5 Funções e exceções · A6 Classes aplicadas a finanças | `a05`, `a06` |
| 4 | M3 · NumPy | A7 Arrays e indexação · A8 UFuncs, broadcasting e estatística | `a07`, `a08` |
| 5 | M3 · Pandas | A9 Series/DataFrame, `loc/iloc`, dados faltantes · A10 Filtros, groupby, merge | `a09`, `a10` |
| 6 | M4 · Visualização | A11 Matplotlib p/ relatórios · A12 Seaborn estatístico | `a11`, `a12` |
| 7 | M5 · Economia Aplicada I | A13 Laboratório POF/IBGE · A14 Valuation, DRE e balanço | `a13`, `a14` |
| 8 | M5 · Engenharia econômica | A15 VPL, TIR, SAC vs Price · A16 Comprar vs Leasing | `a15`, `a16` |
| 9 | M6 · Séries temporais e agro | A17 Séries temporais financeiras · A18 Commodities (soja, milho, boi) e futuros | `a17`, `a18` |
| 10 | M7 · ML e projeto | A19 Regressão e Scikit-Learn · A20 Projeto final e integração | `a19`, `a20` |

## Estrutura do repositório

```
curso_de_python/
  README.md                  <- este arquivo
  semana_01 ... semana_10/   <- material das aulas (apostilas + notebooks)
  data/
    csv/                     <- bases prontas p/ os notebooks (offline-first)
    download_bcb.py          <- atualiza séries do BCB-SGS
    make_pof_samples.py      <- regera amostras da POF 2017-18
  kb/                        <- base de conhecimento: 3 livros de referência em Markdown
  references/                <- convenções de estilo e scripts de validação
```

## Referências centrais

- **Python Data Science Handbook** — Jake VanderPlas (O'Reilly, 2017)
- **Python for Data Analysis** — Wes McKinney (O'Reilly, 2012)
- **Machine Learning for Algorithmic Trading**, 2ª ed. — Stefan Jansen (Packt, 2020)

As três obras estão extraídas em Markdown em `kb/` (um arquivo por capítulo) e são
citadas aula a aula nas apostilas, com o capítulo exato para aprofundamento.

## Dados (data/csv/)

| base | fonte | uso principal |
|---|---|---|
| `ipca_mensal.csv`, `selic_diaria_aa.csv`, `usdbrl_diario.csv` | BCB-SGS (API aberta) | aulas 2, 11, 12, 15, 17 |
| `soja_cbot_usd_bushel.csv`, `milho_cbot_usd_bushel.csv`, `boi_gordo_cme_usd_lbs.csv` | CBOT/CME via yfinance (futuros) | aulas 11, 12, 17, 18 |
| `pof_domicilio.csv`, `pof_morador.csv`, `pof_despesa_categoria.csv` | POF 2017-18 (IBGE), amostra agregada | aula 13 |

Atualizar as séries: `python data/download_bcb.py` (e yfinance p/ commodities, ver script).