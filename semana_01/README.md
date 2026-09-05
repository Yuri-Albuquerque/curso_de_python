# Semana 1 — Ambiente JupyterLab e Sintaxe Básica

> Curso Python para Economistas — OIKOS/UEG · Empresa Júnior · Ciências Econômicas

## Visão geral da semana

A Semana 1 instala o ferramental e a gramática da linguagem. A Aula 01 configura o
laboratório (Miniconda, ambiente `oikos_py`, JupyterLab) e prova que ele funciona.
A Aula 02 apresenta a gramática do Python — tipos, estruturas e operadores — já
aplicada a números reais da economia brasileira (IPCA, câmbio, preços do agro).

Metodologia: code-along no JupyterLab (2 aulas de 50 min). O aluno roda cada célula
junto com o instrutor; apostila de leitura antes da aula, notebook durante.

## Aulas

| Aula | Tema | Notebook | Apostila | Dados |
|---|---|---|---|---|
| 01 | O ecossistema Python e configuração do ambiente | `a01_ambiente_jupyterlab.ipynb` | `apostila_a01_ambiente_jupyterlab.md` | nenhum (verificação do ambiente) |
| 02 | Sintaxe básica, tipagem e variáveis econômicas | `a02_sintaxe_tipos_variaveis.ipynb` | `apostila_a02_sintaxe_tipos_variaveis.md` | leitura leve: `ipca_mensal.csv`, `usdbrl_diario.csv` (BCB-SGS) |

## Antes da Aula 01 — preparar o ambiente (guia rápido)

O guia completo, com diagnóstico de erros, está na apostila da Aula 01 (Seções 2.3–2.6).
Resumo dos comandos no terminal (macOS: Terminal; Windows: PowerShell/Anaconda Prompt):

```bash
# 1) Instale o Miniconda — https://docs.conda.io/en/latest/miniconda.html

# 2) Crie e ative o ambiente da disciplina
conda create -n oikos_py python=3.11 -y
conda activate oikos_py

# 3) Instale as bibliotecas do curso
pip install numpy pandas matplotlib jupyterlab ipykernel

# 4) Registre o ambiente como kernel do Jupyter
python -m ipykernel install --user --name oikos_py --display-name "Python (oikos_py)"

# 5) Inicie o JupyterLab
jupyter lab
```

## Como rodar os notebooks

1. Abra o terminal na pasta desta semana (`semana_01/`) e rode `jupyter lab`.
2. Abra o notebook da aula e confirme o kernel: **Python (oikos_py)** — menu *Kernel → Change Kernel*.
3. Execute as células **de cima a baixo** com `Shift+Enter`. Os notebooks da Semana 1 não exigem
   internet: tudo é offline-first.
4. Exercícios: tente antes de abrir a solução (as células `# SOLUÇÃO N` seguem logo após cada
   `# EXERCÍCIO N`).

## Dados usados na semana

- `../data/csv/ipca_mensal.csv` — IPCA mensal %, BCB-SGS 433 (ler com `sep=';'`, `decimal=','`).
- `../data/csv/usdbrl_diario.csv` — câmbio diário R$/US$, BCB-SGS 1.
- Números de referência usados nos exemplos (set/2026): câmbio ≈ 5,1253; IPCA acumulado 12m ≈ 4,44%;
  Selic ≈ 13,9% a.a.; soja ≈ US$ 12,9/saca; salário mínimo R$ 1.518 (2026).

## Checklist da semana

- [ ] Ambiente `oikos_py` criado e ativo (`conda env list` mostra o ambiente).
- [ ] Kernel `Python (oikos_py)` aparece no JupyterLab.
- [ ] A01 rodou de cima a baixo sem erro (verificação de ambiente e mágicos `%time`/`%timeit`).
- [ ] A02 rodou de cima a baixo sem erro (tipos, estruturas, IPCA e câmbio).
- [ ] Os 8 exercícios (4 por aula) feitos sem consultar o gabarito da apostila.

## Referências da semana (KB)

- `kb/02_vanderplas_python_data_science_handbook/04_chapter-1-ipython-beyond-normal-python.md`
  — VanderPlas, Cap. 1 (shell/notebook, mágicos, `%time`/`%timeit`).
- `kb/01_mckinney_python_for_data_analysis/05_chapter-3-ipython-an-interactive-computing-and-development-e.md`
  — McKinney, Cap. 3 (IPython: mágicos, timing, produtividade).
- `kb/01_mckinney_python_for_data_analysis/15_appendix-python-language-essentials.md`
  — McKinney, Apêndice (semântica da linguagem, tipos escalares, tupla/lista/dict).