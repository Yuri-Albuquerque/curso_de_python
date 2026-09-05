# Semana 3 — Funções, Tratamento de Exceções e Noções de POO

**Módulo 2 · Aulas 5 e 6 · 2×50 min**

## 🎯 Objetivos da semana

Ao final da semana, você será capaz de:

- Escrever funções puras com parâmetros posicionais, nomeados e valores padrão
- Implementar cálculos financeiros reutilizáveis: elasticidade-preço da demanda, parcelas SAC/Price, VPL
- Tratar erros com `try`/`except`/`finally` e sanitizar entradas "sujas" de planilhas de clientes
- Criar classes simples voltadas a finanças (`ProjetoInvestimento`) com métodos e `__repr__` executivo

## 📚 Aulas

| Aula | Notebook | Apostila | Tema |
|---|---|---|---|
| A5 | `a05_funcoes_excecoes.ipynb` | `apostila_a05_funcoes_excecoes.md` | `def`, parâmetros, `try-except`, sanitização |
| A6 | `a06_classes_poo_financas.ipynb` | `apostila_a06_classes_poo_financas.md` | Classes, métodos, `__repr__`, projeto de investimento agro |

## 💻 Como rodar

```bash
cd semana_03
jupyter lab   # selecione o kernel "Python (oikos_py)"
```

Não há dependência de dados externos nesta semana — os exemplos são autossuficientes.

## 📖 Referências

- `kb/01_mckinney_python_for_data_analysis/15_appendix-python-language-essentials.md` (funções, classes, exceções)
- Capítulos citados nas apostilas.

## 📝 Para casa

- Terminar os exercícios dos dois notebooks
- Rascunhar a classe `ProjetoInvestimento` com um projeto real que você conheça (silo, irrigação, lacticínio) — usaremos VPL/TIR programáticos na Semana 8