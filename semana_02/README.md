# Semana 2 — Condicionais e Laços: o código que decide e repete

> Curso Python para Economistas — OIKOS/UEG · Empresa Júnior · Ciências Econômicas

## Visão geral da semana

A Semana 2 completa a **gramática de controle** do Python. Na Aula 03 o código aprende a
**decidir**: `if/elif/else` para faixas numéricas (política de crédito por score) e
`match/case` para categorias (regimes tributários, seções CNAE). Na Aula 04 o código
aprende a **repetir**: `for` para processar a carteira inteira e simular juros compostos
mês a mês; `while` para iterar até a convergência (teia de aranha do mercado agrícola);
comprehensions para transformar coleções em uma linha (deflacionar, converter moeda);
`break`/`continue` para pular dado sujo e parar na meta.

O fio condutor é a rotina de consultoria: **decidir (A03) + repetir (A04) = qualquer
análise**. Da Aula 07 em diante a repetição será vetorizada (NumPy/pandas) — mas todo
código vetorizado exige o raciocínio de laço construído aqui.

Metodologia: code-along no JupyterLab (2 aulas de 50 min). O aluno roda cada célula
junto com o instrutor; apostila de leitura antes da aula, notebook durante.

## Aulas

| Aula | Tema | Notebook | Apostila | Dados |
|---|---|---|---|---|
| 03 | Condicionais: `if/elif/else` e `match/case` | `a03_condicionais_decisao.ipynb` | `apostila_a03_condicionais_decisao.md` | nenhum (exemplos sintéticos de carteira) |
| 04 | Laços: `for`, `while` e comprehensions | `a04_lacos_comprehensions.ipynb` | `apostila_a04_lacos_comprehensions.md` | nenhum em células regulares (séries ilustrativas em memória; referências: `../data/csv/selic_diaria_aa.csv`, `usdbrl_diario.csv`, `soja_cbot_usd_bushel.csv`) |

## Antes da Aula 03 — preparar o ambiente

Se o ambiente já foi criado na Semana 1, pule para "Como rodar os notebooks". Caso
contrário, o guia completo (com diagnóstico de erros) está na apostila da Aula 01
(Seções 2.3–2.6). Resumo no terminal:

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

1. Abra o terminal **na pasta desta semana** (`semana_02/`) e rode `jupyter lab`.
2. Abra o notebook da aula e confirme o kernel: **Python (oikos_py)** — menu
   *Kernel → Change Kernel*.
3. Execute as células **de cima a baixo** com `Shift+Enter`. Os notebooks da Semana 2 não
   exigem internet: tudo é offline-first.
4. Exercícios: tente antes de abrir a solução (as células `# SOLUÇÃO N` seguem logo após
   cada bloco `# EXERCÍCIO N`).

## O que cada aula produz

- **A03:** a política de crédito da OIKOS traduzida em código — score → categoria → taxa,
  regimes tributários com teto legal (Simples: R$ 4,8 mi), seções CNAE com dado sujo
  tratado (`case _`).
- **A04:** a mesma política rodando para a **carteira inteira** (`for`), simulação de
  juros compostos com conversão geométrica anual→mensal, teia de aranha convergindo com
  tolerância `1e-6` e teto de iterações, comprehensions de deflação/câmbio e filtros de
  carteira, limpeza de receitas com `continue` e meta antecipada com `break`.

## Dados e números de referência (set/2026)

- Séries ilustradas nos exemplos vêm de `../data/csv/` (offline-first): Selic 13,90% a.a.
  (BCB-SGS 1178), câmbio R$ 5,1253/US$ (BCB-SGS 1, 04/09), soja CBOT ≈ US$ 12,9/bu.
- Números usados nos exemplos: câmbio ≈ 5,1253; Selic ≈ 13,9% a.a. (≈ 1,0905% a.m.
  geométrico); soja ≈ US$ 12,9/bu → ≈ R$ 145,76/sc60kg; salário mínimo R$ 1.518 (2026);
  teto do Simples Nacional R$ 4,8 milhões (2026).

## Checklist da semana

- [ ] Kernel `Python (oikos_py)` aparece no JupyterLab.
- [ ] A03 rodou de cima a baixo sem erro (condicionais, `match/case`, carteira classificada).
- [ ] A04 rodou de cima a baixo sem erro (juros compostos, teia de aranha convergindo,
      comprehensions, `break`/`continue`).
- [ ] Os 8 exercícios (4 por aula) feitos sem consultar o gabarito da apostila.
- [ ] Para casa da A04 feito: simulação com retirada mensal e variação de $P_0$ na teia.

## Referências da semana (KB)

- `kb/01_mckinney_python_for_data_analysis/15_appendix-python-language-essentials.md`
  — McKinney (2012), Apêndice *Python Language Essentials*: semântica, tipos escalares,
  tupla/lista/dict, **for/while loops**, **comprehensions**, **generators**.
- `kb/02_vanderplas_python_data_science_handbook/04_chapter-1-ipython-beyond-normal-python.md`
  — VanderPlas, Cap. 1 (comprehensions e loop vs. vetorizado — base do timing da A04).

---

*Material didático — Empresa Júnior OIKOS (UEG), Ciências Econômicas. Uso interno em aula.*