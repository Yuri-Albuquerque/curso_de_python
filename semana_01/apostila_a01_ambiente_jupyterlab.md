# Apostila Aula 01 — O Ecossistema Python e Configuração do Ambiente
> Curso Python para Economistas — OIKOS/UEG · Semana 1

## 1. Por que isso importa (intuição econômica)

Consultoria e pesquisa aplicada vivem de rotina repetitiva: baixar série do BCB
todo mês, atualizar planilha de custo de produção, reformatar relatório para outro
formato, recalcular projeção quando sai o IPCA. Feito à mão, cada tarefa custa
horas e gera erro de digitação — o tipo de erro que estraga um parecer. Feito por
script, custa segundos e é reproduzível: qualquer colega roda o mesmo código e
chega no mesmo número. Python é a linguagem padrão dessa automação porque tem
biblioteca pronta para quase tudo (estatística, séries temporais, regressão,
leitura de planilhas) e uma comunidade enorme de economistas e cientistas de
dados escrevendo soluções para problemas iguais aos seus.

A segunda razão é a curva de entrada. Como economista, você não vai programar
sistemas; vai **analisar dados**. O ecossistema científico Python — NumPy,
pandas, matplotlib — foi feito exatamente para isso, e o McKinney (criador do
pandas) descreve Python como uma linguagem cuja prioridade é legibilidade:
código parece quase pseudocódigo executável. Isso importa em equipe: o analista
júnior entende o script do sênior, e o professor entende o seu.

Nesta aula o objetivo é modesto e crucial: **terminar com um ambiente
funcionando**. Instalar Miniconda, criar um ambiente isolado `oikos_py`,
registrar o kernel no JupyterLab e rodar a primeira célula. É a infraestrutura
de todas as outras 19 aulas — se o ambiente estiver certo hoje, o resto do
curso é sobre economia e dados, não sobre conserto de instalação.

## 2. Teoria essencial

### 2.1 O que é o "ecossistema Python"

A linguagem Python é só a base. O valor está nos pacotes que se instalam sobre
ela, cada um cobrindo uma etapa do trabalho do economista:

| Camada | Pacote | Papel no fluxo de trabalho |
|---|---|---|
| Linguagem | Python 3.11 | gramática, tipos, estruturas |
| Cálculo numérico | NumPy | arrays e operação vetorizada (base de tudo) |
| Dados tabulares | pandas | DataFrames: séries do BCB, POF, DRE |
| Gráficos | matplotlib | visualização estática (base do seaborn) |
| Laboratório | JupyterLab | onde você escreve e executa célula por célula |

O VanderPlas organiza o Python para ciência de dados em dois níveis: o que é
**da linguagem** (pacotes embutidos) e o que é **de pacotes** — e deixa claro que
a forma de usar o IPython/Jupyter muda o fluxo de trabalho: em vez de escrever
um programa inteiro e rodar, você desenvolve **interativamente**, explorando os
dados célula a célula. É o modo natural do trabalho de consultoria: você não
sabe de antemão qual filtro aplicar na POF, você explora e decide no caminho.

### 2.2 Por que o notebook e não um script?

Dois modos de usar Python (VanderPlas, Cap. 1, "Shell or Notebook?"):

- **IPython shell / script `.py`**: bom para código final e reutilizável.
- **Jupyter notebook**: bom para análise exploratória — mistura texto, código,
  saídas e gráficos num documento único que outra pessoa pode executar.

No curso usamos notebook para aprender e analisar; no mercado, você vai
transferir a lógica validada no notebook para scripts e módulos. Os dois modos
compartilham o mesmo **kernel**: o processo Python que executa o código. O
notebook é a interface; o kernel é o motor. "Reiniciar o kernel" é ligar o
motor de novo: tudo que estava na memória desaparece.

### 2.3 Ambientes virtuais: o problema que eles resolvem

Um projeto precisa de versões específicas de biblioteca; outro projeto (ou o
sistema) precisa de outras. Instalar tudo no mesmo lugar gera conflito de
versão — o clássico "funcionava na minha máquina". A solução é o **ambiente
virtual**: um Python separado, com seus próprios pacotes, sem tocar no resto da
máquina. Com o conda (Miniconda/Anaconda) você ganha junto o gerenciador de
pacotes e o `jupyter lab`.

Vantagens práticas para você:

1. **Isolamento** — quebrar o ambiente do curso não afeta seu computador.
2. **Reprodutibilidade** — a EJ pode compartilhar a lista de pacotes e qualquer
   estagiário recria o mesmo ambiente.
3. **Versões controladas** — fixamos Python 3.11 e bibliotecas conhecidas.

### 2.4 O terminal em 90 segundos

O terminal é a tela onde você digita comandos direto para o sistema. É onde os
comandos desta apostila serão executados. O básico:

| Ação | macOS/Linux | Windows (PowerShell) |
|---|---|---|
| saber em que pasta estou | `pwd` | `pwd` (ou `cd` sem argumento) |
| listar arquivos da pasta | `ls` | `ls` (ou `dir`) |
| entrar numa pasta | `cd pasta` | `cd pasta` |
| voltar uma pasta | `cd ..` | `cd ..` |
| limpar a tela | `clear` | `clear` (ou `cls`) |

No Windows, use o **Anaconda Prompt** (instalado junto com o Miniconda) ou o
PowerShell — ele já tem o `conda` no caminho.

### 2.5 Instalação: Miniconda + ambiente `oikos_py`

Passo a passo completo. Cada bloco é um comando (ou sequência) a ser digitado
**no terminal**, com Enter ao final. O `$` não faz parte do comando — indica o
prompt.

**Passo 1 — Instalar o Miniconda.** Baixe o instalador em
<https://docs.conda.io/en/latest/miniconda.html> (escolha o do seu sistema).
Miniconda instala só o essencial: o `conda` + Python. (Anaconda é a versão com
250 pacotes pré-instalados; pesada, desnecessária aqui.) No macOS:

```bash
# macOS (Apple Silicon) — alternativamente, instale pela interface gráfica
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh
bash Miniconda3-latest-MacOSX-arm64.sh
```

No Windows: execute o instalador `.exe`, marcando "Add Miniconda to my PATH"
quando a opção aparecer (ou use o Anaconda Prompt, que já vem configurado).

Feche e reabra o terminal. Teste:

```bash
$ conda --version
conda 24.x.x
```

**Passo 2 — Criar o ambiente da disciplina.**

```bash
$ conda create -n oikos_py python=3.11 -y
$ conda activate oikos_py
(oikos_py) $ python --version
Python 3.11.x
```

O que aconteceu: `-n oikos_py` batiza o ambiente; `python=3.11` fixa a versão
(importante: o curso usa 3.11); `-y` aceita tudo sem perguntar. `conda activate`
"entra" no ambiente — o prompt muda para `(oikos_py)`. Daqui para frente, sempre
que abrir o terminal para trabalhar no curso, comece com `conda activate oikos_py`.

**Passo 3 — Instalar as bibliotecas do curso.**

```bash
(oikos_py) $ pip install numpy pandas matplotlib jupyterlab ipykernel
```

**Passo 4 — Registrar o ambiente como kernel do Jupyter.** Este é o passo que
mais aluno pula e depois não acha o kernel:

```bash
(oikos_py) $ python -m ipykernel install --user --name oikos_py --display-name "Python (oikos_py)"
Installed kernelspec oikos_py in /Users/voce/Library/Jupyter/kernels/oikos_py/
```

O que isso faz: cria um "cartão de visita" do ambiente numa pasta de
configuração do Jupyter. Assim, quando o JupyterLab abrir (mesmo iniciado de
outro ambiente), ele lista `Python (oikos_py)` entre os kernels disponíveis — e
roda o código usando as bibliotecas do **nosso** ambiente, não de outro.

**Passo 5 — Iniciar o JupyterLab.**

```bash
(oikos_py) $ jupyter lab
```

O navegador abre em `http://localhost:8888/` (o endereço pode variar; é local,
não internet). Você vê o gerenciador de arquivos da pasta em que o comando foi
rodado. Para encerrar: volte ao terminal e pressione `Ctrl+C` duas vezes.

> **Dica do dia a dia:** crie o hábito de abrir o terminal **dentro da pasta do
> curso** (`cd` até `curso_de_python/semana_01/`) antes do `jupyter lab`. Assim o
> JupyterLab já abre mostrando os notebooks da semana.

### 2.6 Verificação de que está tudo certo

Se os quatro itens abaixo são verdadeiros, seu ambiente está pronto:

1. `conda activate oikos_py` funciona (prompt muda).
2. `python --version` mostra `3.11.x` **com o ambiente ativo**.
3. `jupyter lab` abre o navegador.
4. No JupyterLab, o kernel `Python (oikos_py)` aparece em *Kernel → Change Kernel*.

O notebook desta aula (`a01_ambiente_jupyterlab.ipynb`) tem uma célula que faz a
verificação fina: versão do Python, versões de numpy/pandas/matplotlib. Rode-a
depois de concluir a instalação — ela é o "teste de fumaça" do ambiente.

## 3. Roteiro do notebook

O notebook `a01_ambiente_jupyterlab.ipynb` assume o ambiente **já instalado** —
a instalação é feita no terminal (Seção 2.5), nunca dentro do notebook. O que
ele faz, seção por seção:

1. **Setup e verificação do ambiente** — célula de setup padrão do curso
   (imports, `brl()`), depois `sys.version` e versões de numpy/pandas/matplotlib
   com tabela comparando com o alvo do curso (Python 3.11). Observar: se alguma
   versão divergir muito, o kernel errado está selecionado.
2. **JupyterLab em 5 minutos** — células markdown explicando célula vs kernel,
   modos Comando/Edição, atalhos essenciais (`Shift+Enter`, `A`, `B`, `DD`,
   `M`, `Y`, `0-0`) e onde trocar o kernel. É a única seção sem código.
3. **Ajudas e mágicos essenciais** — o que significa o `%` nos mágicos
   (VanderPlas Cap. 1); demonstração de `?`/`??` no objeto `brl`; `%who`,
   `%xdel`, `%run`, `%lsmagic`.
4. **Cronometrando código: `%time` vs `%timeit`** — comparação `sum(lista de
   1.000.000 de valores)` vs `np.sum(array)`. Observar dois pontos: (i) NumPy é
   ordens de grandeza mais rápido; (ii) `%timeit` roda várias vezes e reporta a
   melhor estimativa, `%time` roda uma vez — cada um para um uso (McKinney,
   Cap. 3, "Timing Code: %time and %timeit").
5. **Exercícios** — 4 exercícios: verificação própria, docstring via `?`,
   `%whos`/`%who`, comparação própria com `%timeit`.
6. **Resumo e para casa** — bullets do que foi visto e leitura da KB.

## 4. Erros comuns e diagnóstico

| Erro / sintoma | Causa provável | Correção |
|---|---|---|
| `conda: command not found` (macOS/Linux) | Miniconda não está no PATH | Reabra o terminal; se persistir, reinstale marcando a opção de PATH; no macOS use `source ~/miniconda3/bin/activate` |
| `conda : O termo... não é reconhecido` (Windows) | terminal comum sem PATH do conda | Use o **Anaconda Prompt** em vez do PowerShell |
| `python --version` mostra 3.9/3.12, não 3.11 | ambiente `oikos_py` não está ativo | Rode `conda activate oikos_py` e verifique o `(oikos_py)` no prompt |
| Kernel `Python (oikos_py)` não aparece no JupyterLab | passo do `ipykernel install` não foi rodado (ou rodou em outro ambiente) | Ative o ambiente e rode `python -m ipykernel install --user --name oikos_py --display-name "Python (oikos_py)"`, depois reinicie o JupyterLab |
| `ModuleNotFoundError: No module named 'pandas'` no notebook | kernel errado selecionado (não é o `oikos_py`) | *Kernel → Change Kernel → Python (oikos_py)*; se não aparecer, refaça o passo 4 |
| `ModuleNotFoundError` com kernel certo | biblioteca não instalada no ambiente | `conda activate oikos_py && pip install <biblioteca>` |
| Notebook abre mas não executa (relógio no canto, sem saída) | kernel não conectado / sessão morta | *Kernel → Restart Kernel* e rode de novo |
| `jupyter lab` abre página em branco ou não abre | navegador antigo ou cache | Copie a URL com o token do terminal e abra em navegador atualizado |

## 5. Glossário

| Termo (en) | Tradução / equivalente | Significado |
|---|---|---|
| kernel | kernel (motor) | processo Python que executa o código do notebook |
| shell | terminal / linha de comando | interface de texto com o sistema operacional |
| environment (virtual) | ambiente virtual | instalação isolada de Python + pacotes |
| conda | conda | gerenciador de ambientes e pacotes (Miniconda/Anaconda) |
| pip | pip | gerenciador de pacotes do Python (instala de bibliotecas) |
| package | pacote / biblioteca | conjunto de código pronto para importar (`pandas` etc.) |
| magic command | comando mágico | comando especial do IPython, prefixado por `%` |
| cell | célula | unidade de execução do notebook (código ou markdown) |
| markdown | markdown | sintaxe de texto formatado usado nas células de texto |
| path | caminho | endereço de arquivo/pasta no sistema (ex.: `../data/csv`) |
| REPL | REPL | loop leitor-avaliador-imprime: modo interativo do Python |
| `localhost` | localhost | "esta máquina": servidor rodando localmente no seu computador |

## 6. Referências

- `kb/02_vanderplas_python_data_science_handbook/04_chapter-1-ipython-beyond-normal-python.md`
  — VanderPlas, *Python Data Science Handbook*, Cap. 1: seções "Shell or
  Notebook?", "IPython Magic Commands" e "Profiling and Timing Code" (%time/
  %timeit).
- `kb/01_mckinney_python_for_data_analysis/05_chapter-3-ipython-an-interactive-computing-and-development-e.md`
  — McKinney, *Python for Data Analysis* (2012), Cap. 3: "IPython Basics",
  "Magic Commands" (Tabela 3-2) e "Timing Code: %time and %timeit".
- Livro-base (PDF na raiz do projeto): VanderPlas, J. *Python Data Science
  Handbook*, O'Reilly, Cap. 1.

## 7. Gabarito comentado

Soluções dos 4 exercícios do notebook `a01_ambiente_jupyterlab.ipynb`.

**Exercício 1 — Impressão digital do seu ambiente.** Objetivo: confirmar que
você está no kernel certo. A comparação é o ponto: a versão do `sys.version`
deve começar com `3.11` e a origem do executável deve conter `oikos_py`.

```python
import sys
print(sys.version)              # primeira linha deve começar com 3.11
print(sys.executable)           # caminho deve conter "oikos_py" (ou "envs")
```

**Exercício 2 — A documentação está a um `?` de distância.** Objetivo: habituar
o uso da ajuda integrada. Rodar `len?` mostra a docstring da função embutida
`len`. `len??` tentaria mostrar o código-fonte — em funções da linguagem, o
Python mostra só a documentação (o código não está disponível). O hábito vale
mais que a resposta: ninguém decora API, todo mundo consulta.

```python
len?
```

**Exercício 3 — Auditoria da sessão com `%whos`.** Objetivo: ver o que está na
memória do kernel. `%whos` lista nome, tipo e conteúdo-resumo de cada variável
— a versão detalhada do `%who`. Depois de `x = 27.216`, aparece uma linha com
`x  float  27.216`. Se tivesse executado `del x` (ou `%xdel x`), a variável
sairia da lista — o kernel esquece o que você pede para esquecer.

```python
x = 27.216  # kg por bushel de soja
%whos
```

**Exercício 4 — Sua própria corrida de `%timeit`.** Objetivo: medir e comparar
duas formas de somar 1 a 100.000 (loop `for` com acumulador vs `sum()` embutida).
A leitura esperada: `sum()` é bem mais rápida que o loop manual em Python puro,
porque o `for` do Python paga o custo de interpretar cada passo, enquanto
`sum()` é implementada em C. Na aula 7 (NumPy) a diferença fica gigantesca.
O ponto de consultoria: antes de otimizar, cronometre — intuição sobre "o que é
lento" erra muito.

```python
numeros = range(1, 100_001)
```

```python
# célula própria: %%timeit precisa ser a PRIMEIRA linha da célula
%%timeit
total_loop = 0
for n in numeros:
    total_loop += n
```

```python
%timeit sum(numeros)
```

*(Observação: `%timeit` de linha cronometra apenas aquela linha; para o bloco do
loop usamos a forma de célula `%%timeit`, que deve abrir a célula — também
demonstrada no notebook.)*