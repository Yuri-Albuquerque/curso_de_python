# Apostila Aula 20 — Projeto final e integração
> Curso Python para Economistas — OIKOS/UEG · Semana 10

## 1. Por que isso importa (intuição econômica)

Nos dez encontros anteriores, você aprendeu a gramática: variáveis, laços, funções,
NumPy, pandas, gráficos, séries temporais, e — na Aula 19 — regressão com
scikit-learn. Esta última aula é a prova de fogo: **entregar um produto**, não
exercícios. O formato escolhido é o mais próximo do seu futuro profissional: um
**mini-relatório de consultoria**.

Uma consultoria agro econômica raramente vende "um modelo". Vende um documento
curto, com números confiáveis, gráficos legíveis e uma recomendação: qual preço
esperar para a saca de soja em Goiás nos próximos meses, dado o câmbio e o mercado
internacional, e com que incerteza. O notebook é a ferramenta de trabalho; o
relatório (e o repositório GitHub) é o produto final que o cliente vê.

Goiás é o terceiro maior produtor nacional de soja e o preço que o produtor goiano
recebe acompanha de perto a cotação CBOT convertida para reais pela taxa de câmbio
— com basis (diferencial local) e frete. Com os CSVs do curso (futuros CBOT +
câmbio BCB), dá para construir essa análise de ponta a ponta, offline, e o
**método** — coleta → tratamento → modelagem → visualização → comunicação —
transferi-lo para qualquer commodity, PME ou série socioeconômica.

A Aula 20 também cobre a **embalagem** do trabalho: estrutura de repositório,
README que ensina a reproduzir, `requirements.txt`, notebooks limpos e publicação
no GitHub Pages. Em entrevista ou cliente, ninguém abre seu código primeiro —
abre o README.

## 2. Teoria essencial — a esteira e a arquitetura da entrega

### 2.1 A esteira de trabalho (Jansen, cap. 8)

O workflow ML completo tem quatro etapas; o projeto final percorre todas:

1. **Coleta** — carregar os CSVs brutos (aqui: `soja_cbot_usd_bushel.csv`,
   `usdbrl_diario.csv`). Em produção: APIs (BCB, yfinance), downloads manuais.
2. **Tratamento** — tipos corretos (datas!), conversão de unidade
   (US$/bu → R$/sc60kg), merge por data, tratamento de faltantes (`ffill()`).
3. **Modelagem** — features (MM21, retornos), regressão linear com treino/teste
   **sem embaralhar**, métricas honestas contra baseline.
4. **Visualização/comunicação** — gráfico com título e eixos, salvo em PNG
   (`plt.savefig(..., dpi=300)`), DataFrame-resumo executivo, texto de conclusão.

A ordem importa: tratamento mal feito contamina tudo depois. E a **validação
out-of-sample** (teste no futuro) é o padrão mínimo de honestidade — o equivalente
do backtest no ML4T workflow.

### 2.2 Conversão de unidades (o coração do tratamento)

$$\text{preço}_{R\$/sc60kg} = \text{preço}_{US\$/bu} \times \frac{60}{27{,}216} \times \text{câmbio}_{R\$/US\$}$$

1 bushel de soja = 27,216 kg (padrão CBOT); 1 saca = 60 kg. Com soja a US$ 12,9/sc
e câmbio a R$ 5,12: o futuro CBOT (US$/bu) em centavos precisa ser dividido por
100 antes de aplicar a fórmula — erro clássico de unidade que infla o preço 100×.
Sempre exiba `df.head()` e `df.describe()` depois de transformar preços.

### 2.3 Modelo do projeto

O projeto usa a regressão linear da Aula 19 em duas frentes:

- **Univariada (consultoria):** preço em R$/sc regredido no câmbio —
  coeficiente ≈ +35 R$/sc por +1 R$/US$ na amostra completa, R² ≈ 0,60. É a
  resposta "quanto o câmbio importa" que o cliente entende;
- **Multivariada (completa):** adiciona o preço internacional e o MM21 — R² de
  teste ≈ 0,95 (a identidade de conversão domina). Compare as duas e discuta
  por que a univariada, embora pior em R², é mais **explicável** para o cliente.

### 2.4 Boas práticas de repositório (GitHub)

Estrutura recomendada para o projeto final:

```
projeto_soja_goias/
├── README.md            # o cartão de visitas: pergunta, dados, resultado, como rodar
├── requirements.txt     # numpy, pandas, matplotlib, scikit-learn (com versões)
├── data/                # CSVs (ou instruções de download: BCB-SGS, yfinance)
│   ├── soja_cbot_usd_bushel.csv
│   └── usdbrl_diario.csv
├── notebooks/
│   └── 01_analise_soja.ipynb   # executado de cima a baixo, outputs limpos
├── outputs/
│   └── fig_preco_soja_sc.png   # gráficos salvos com dpi=300
└── relatorio.md         # mini-relatório de consultoria (texto final)
```

- **README.md**: pergunta de pesquisa, fontes de dados, principais números
  (R², coeficiente do câmbio), como reproduzir em 3 comandos;
- **requirements.txt**: gerado com `pip freeze > requirements.txt` no ambiente
  limpo — ou escrito à mão com as versões usadas;
- **Notebooks limpos**: reiniciar kernel e rodar tudo de cima a baixo antes de
  commit (*Restart Kernel and Run All Cells*); saída de erro nunca deve ficar
  salva; `git` não versiona outputs pesados (adicionar `outputs/` se grande).
- **GitHub Pages**: nas configurações do repositório (*Settings → Pages*), publique
  o `relatorio.md` (ou uma página simples) como site estático — o relatório fica
  acessível por link, sem o cliente abrir código.

### 2.5 Rubrica e checklist de entrega OIKOS

O projeto será avaliado em 4 eixos (100 pontos):

| Eixo | Peso | Critério |
|---|---|---|
| Reprodutibilidade | 30 | roda de cima a baixo sem erro; ambiente documentado; dados locais |
| Análise | 30 | tratamento correto de unidades e datas; modelo com treino/teste; métricas contra baseline |
| Comunicação | 25 | gráficos com título/eixos, PNG dpi=300; resumo executivo; conclusão com recomendação |
| Embalagem | 15 | README claro; requirements.txt; estrutura de pastas; commits descritivos |

Checklist antes do envio:

- [ ] O notebook roda do primeiro ao último `Run All` sem erro?
- [ ] Datas convertidas com formato explícito? Merge soja×câmbio sem duplicatas?
- [ ] Conversão US$/bu → R$/sc60kg com o fator 60/27,216 correto?
- [ ] `train_test_split(..., shuffle=False)`? Métricas comparadas a um baseline?
- [ ] Gráfico salvo em PNG com `dpi=300`?
- [ ] DataFrame-resumo executivo (última linha com data, preço, câmbio, MM21)?
- [ ] README com pergunta, dados, resultado e modo de reproduzir?
- [ ] `requirements.txt` presente? Commits com mensagens descritivas?

## 3. Roteiro do notebook (`a20_projeto_final_integracao.ipynb`)

| Seção | Conteúdo | O que observar |
|---|---|---|
| Setup | imports + `brl()` + rcParams | célula padrão do curso |
| 1 | A esteira coleta→tratamento→modelagem→visualização | mapa do projeto |
| 2 | Coleta e tratamento (soja CBOT × câmbio BCB) | datas explícitas; merge por data; fator 60/27,216 |
| 3 | Indicador: MM21 (média móvel de 21 pregões) | `rolling(21).mean()`; ~1 mês de mercado |
| 4 | Modelagem: regressão câmbio → preço (univariada) | coef ≈ +35 R$/sc; R² ≈ 0,60 |
| 5 | Modelo completo (câmbio + US$ + MM21) com treino/teste | R² teste ≈ 0,95; `shuffle=False` |
| 6 | DataFrame-resumo executivo | últimas linhas: data, preço, câmbio, MM21, previsto |
| 7 | Gráfico final salvo em PNG (dpi=300) | realizado + MM21 + previsto |
| 8 | Empacotando no GitHub + GitHub Pages + rubrica | markdown de boas práticas |
| 📝 Exercícios | 4 exercícios com solução (inclui o integrador guiado) | o Ex. 4 é o encerramento do curso |

**Números esperados**: preço final da soja ≈ **R$ 146/sc** (câmbio ≈ 5,13, preço
CBOT ≈ 1294 US cents/bu em 04/09/2026); MM21 ≈ R$ 139/sc; coeficiente da
univariada câmbio→preço ≈ +35; R² ≈ 0,60 (univariada) e ≈ 0,95 (completa, treino).

## 4. Erros comuns e diagnóstico

| Erro | Causa provável | Correção |
|---|---|---|
| Preço da saca ≈ 14.600 em vez de ≈ 146 | esqueceu de dividir CBOT centavos por 100 | `usd_sc = usd_bu/100 * 60/27.216` |
| `savefig` salva imagem em branco | chamou depois de `plt.show()` sem figure explícita | salve **antes** do `show()`, ou use `fig.savefig(...)` com o objeto `fig` |
| PNG borrado no relatório/PDF | dpi padrão (100) | `plt.savefig('fig.png', dpi=300, bbox_inches='tight')` |
| Merge explode nº de linhas | chaves duplicadas (datas repetidas em um dos lados) | `drop_duplicates('data')` antes do merge |
| MM21 com 20 NaN no início | janela incompleta | use `mm21 = df['rs_sc'].rolling(21).mean()` e `dropna()` depois |
| Regressão com R² = 1 suspeito | alvo vazou para as features (ex.: incluiu `rs_sc` em X) | X nunca pode conter o alvo ou transformação direta dele |
| README sem instruções | foco só no código | siga o checklist: pergunta, dados, resultado, reprodução |
| `ModuleNotFoundError: sklearn` | ambiente errado | ativar `oikos_py` e selecionar o kernel no JupyterLab |

## 5. Glossário

| Termo (pt) | Termo (en) | Significado |
|---|---|---|
| esteira / pipeline | pipeline | sequência coleta→tratamento→modelagem→visualização |
| mini-relatório | mini-report | documento curto com números, gráficos e recomendação |
| resumo executivo | executive summary | quadro/texto inicial com os resultados-chave |
| média móvel | moving average (MM21) | média dos últimos 21 pregões; suaviza ruído |
| basis | basis | diferencial entre preço local e o futuro de referência |
| dpi | dots per inch | resolução da imagem salva (`savefig(dpi=300)`) |
| reprodutibilidade | reproducibility | terceiro consegue rodar e obter os mesmos números |
| requirements.txt | requirements file | lista de pacotes/versões do ambiente |
| GitHub Pages | GitHub Pages | publicação de site estático a partir do repositório |
| commit | commit | registro de alteração com mensagem descritiva |
| ceteris paribus | ceteris paribus | "mantido o resto constante" — leitura de coeficientes |
| identidade de conversão | unit identity | preço em reais ≈ preço em US$ × câmbio |

## 6. Referências

- `kb/02_vanderplas_python_data_science_handbook/08_chapter-5-machine-learning.md`
  — VanderPlas, cap. 5 (API scikit-learn, usada no modelo do projeto);
- `kb/03_jansen_ml_for_algorithmic_trading/14_chapter-8-the-ml4t-workflow-from-ml-model-to-strategy-backte.md`
  — Jansen, *Machine Learning for Algorithmic Trading*, 2e, cap. 8 (o workflow
  ML4T: do modelo ao backtest; armadilhas de vazamento e validação out-of-sample);
- Documentação: GitHub Docs — *Creating a GitHub Pages site*; pip —
  *requirements.txt*; matplotlib — `savefig`.

## 7. Rubrica / gabarito comentado

> O Exercício 4 é o **exercício final integrador** — é a entrega-capstone da
> disciplina. Soluções completas no notebook (células `# SOLUÇÃO N`).

**Exercício 1 — Boi gordo em R$/arroba (outra commodity, mesmo método).**
Ler `boi_gordo_cme_usd_lbs.csv` (US$/lb) e `usdbrl_diario.csv`; converter com
$US\$/lb \times 33{,}069 = R\$/\text{arroba}$ (1 arroba = 15 kg carcaça = 33,069 lb);
merge por data; regressão do preço da arroba no câmbio. Espere padrão parecido com
a soja: coeficiente positivo e grande (a arroba em reais é quase identidade com
câmbio × US$/lb), R² elevado. O ponto pedagógico: **o método é commodity-agnóstico**
— muda a fórmula de conversão, não a esteira.

**Exercício 2 — Cenários de câmbio para o relatório.** Com o modelo univariado da
aula (câmbio → preço da saca), gerar tabela de cenários: câmbio em 4,75 (alta
commodity), 5,12 (central), 5,60 (estresse) → preço previsto da saca. É o quadro
"tabela de cenários" que aparece em todo relatório de consultoria; reforça a leitura
*ceteris paribus* do coeficiente (+35 R$/sc por +1 R$/US$).

**Exercício 3 — Checklist de reprodutibilidade aplicado.** Rodar *Restart Kernel
and Run All* no seu notebook do projeto e listar qualquer célula que quebre sem os
CSVs de dados — depois consertar com caminho relativo `Path('../data/csv')` e
mensagens de erro amigáveis (`try/except FileNotFoundError` com instrução de onde
baixar). Esse exercício É a rubrica de reprodutibilidade (30 pts) em ação.

**Exercício 4 (integrador final) — Mini-relatório de consultoria completo.**
Pipeline completo em um bloco: (i) carregar soja + câmbio; (ii) converter para
R$/sc60kg; (iii) calcular MM21; (iv) ajustar regressão câmbio→preço (e a completa);
(v) construir o DataFrame-resumo executivo (data, preço, câmbio, MM21, R², coef. do
câmbio); (vi) salvar `fig_soja_goias.png` com dpi=300 (preço, MM21 e janela de 6
meses em destaque); (vii) escrever 5 linhas de conclusão de consultoria em markdown
com os números que o código produziu. Gabarito no notebook executa tudo e imprime o
resumo — o aluno compara com os seus próprios números (esperado: preço ≈ R$ 146/sc,
MM21 ≈ R$ 139/sc, R² ≈ 0,60/0,95).