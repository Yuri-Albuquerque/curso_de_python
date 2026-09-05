# Semana 4 — NumPy: Arrays e Cálculo Vetorial

> Curso Python para Economistas — OIKOS/UEG · Empresa Júnior · Ciências Econômicas

## Visão geral da semana

Nas Semanas 1–3 o trabalho numérico foi feito com listas, laços e funções. Esta semana
introduz o **NumPy**, a fundação de todo o ecossistema de dados em Python (pandas,
matplotlib, scikit-learn). A mudança de mentalidade é uma só: **opere a tabela inteira
de uma vez, elemento a elemento, sem laço**.

A Aula 07 constrói o objeto central (`np.ndarray`): criação, `dtype`, indexação/slicing
e o cuidado crítico com **views vs cópias**. A Aula 08 explora as **ufuncs**, as regras
de **broadcasting** (deflacionar 36 meses de faturamento pelo IPCA com uma única linha)
e as agregações estatísticas com `axis`.

O fio condutor é uma empresa do agronegócio goiano com **6 filiais** (Goiânia Campinas,
Goiânia Bueno, Anápolis, Rio Verde, Jataí, Catalão) e **36 meses de faturamento nominal**
(ago/2023 → jul/2026). Na Aula 08 esses valores são convertidos a reais de jul/2026
usando o IPCA real do BCB (`ipca_mensal.csv`).

## Aulas

| Aula | Tema | Notebook | Apostila | Dados |
|---|---|---|---|---|
| 07 | `ndarray`, criação, dtype, indexação, views vs cópias | `a07_numpy_arrays_indexacao.ipynb` | `apostila_a07_numpy_arrays_indexacao.md` | sintéticos (rng semente 42) |
| 08 | Ufuncs, broadcasting, agregações, máscaras booleanas | `a08_numpy_ufuncs_broadcasting.ipynb` | `apostila_a08_numpy_ufuncs_broadcasting.md` | `ipca_mensal.csv` (BCB-SGS 433) |

## Como rodar os notebooks

1. Abra o terminal na pasta desta semana (`semana_04/`) e rode `jupyter lab`.
2. Confirme o kernel: **Python (oikos_py)** — menu *Kernel → Change Kernel*.
3. Execute as células **de cima a baixo** com `Shift+Enter`. Nada exige internet:
   o IPCA vem do CSV local (`../data/csv/ipca_mensal.csv`), offline-first.
4. Exercícios: tente antes de abrir a solução (as células `# SOLUÇÃO N` seguem logo
   após cada `# EXERCÍCIO N`).
5. Células com `%timeit` demoram alguns segundos — normais; em produção use `%time -n 1 -r 1`.

## Dados usados na semana

- `../data/csv/ipca_mensal.csv` — IPCA mensal %, BCB-SGS 433
  (`pd.read_csv(sep=';', decimal=',')`, `pd.to_datetime(..., dayfirst=True)`).
  Janela usada: **ago/2023 → jul/2026** (últimos 36 meses); inflação acumulada do
  período ≈ **14,8%**.
- Faturamento das filiais: **sintético** (gerado com `np.random.default_rng(42)` para
  reprodutibilidade), calibrado com números plausíveis: rede fatura ~R$ 3,7 mi/mês
  no início, ~R$ 4,6 mi no fim; Catalão é a filial pequena (~R$ 90–130 mil/mês).
- Números de referência (jul/2026): IPCA acumulado 12m ≈ 3,4%; Selic ≈ 13,9% a.a.;
  câmbio ≈ R$ 5,12/US$; salário mínimo R$ 1.518 (2026).

## Checklist da semana

- [ ] A07 rodou de cima a baixo sem erro (criação de arrays, slicing, demonstração view vs cópia).
- [ ] A08 rodou de cima a baixo sem erro (IPCA lido do CSV, deflator acumulado, máscaras).
- [ ] Você sabe explicar, com suas palavras, por que `real = fat * fator` é uma linha
      e não um laço de 216 iterações.
- [ ] Você sabe dizer quando um slicing devolve **view** e por que `.copy()` salva análises.
- [ ] Os 8 exercícios (4 por aula) feitos sem consultar o gabarito da apostila.

## Referências da semana (KB)

- `kb/02_vanderplas_python_data_science_handbook/05_chapter-2-introduction-to-numpy.md`
  — VanderPlas, Cap. 2: arrays, ufuncs, agregações, broadcasting, máscaras.
- `kb/01_mckinney_python_for_data_analysis/06_chapter-4-numpy-basics-arrays-and-vectorized-computation.md`
  — McKinney, Cap. 4: ndarray na prática, dtype, indexação, funções universais.
- `kb/01_mckinney_python_for_data_analysis/14_chapter-12-advanced-numpy.md`
  — McKinney, Cap. 12 (Aula 08): visão mais profunda de broadcasting e layout de memória.