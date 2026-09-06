import { lesson as cls_atributos } from './cls-atributos';
import { lesson as cls_classes_instancias } from './cls-classes-instancias';
import { lesson as cls_composicao } from './cls-composicao';
import { lesson as cls_dataclasses } from './cls-dataclasses';
import { lesson as cls_encapsulamento } from './cls-encapsulamento';
import { lesson as cls_heranca } from './cls-heranca';
import { lesson as cls_metodos_especiais } from './cls-metodos-especiais';
import { lesson as cls_metodos } from './cls-metodos';
import { lesson as cls_objetos_identidade } from './cls-objetos-identidade';
import { lesson as cls_principios_projeto } from './cls-principios-projeto';
import { lesson as cls_propriedades } from './cls-propriedades';
import { lesson as cls_protocolos_polimorfismo } from './cls-protocolos-polimorfismo';
import { lesson as dados_conjuntos } from './dados-conjuntos';
import { lesson as dados_dicionarios } from './dados-dicionarios';
import { lesson as dados_indexacao_fatiamento } from './dados-indexacao-fatiamento';
import { lesson as dados_iteracao_desempacotamento } from './dados-iteracao-desempacotamento';
import { lesson as dados_listas } from './dados-listas';
import { lesson as dados_mutabilidade } from './dados-mutabilidade';
import { lesson as dados_tuplas } from './dados-tuplas';
import { lesson as eco_econometria } from './eco-econometria';
import { lesson as eco_engenharia_economica } from './eco-engenharia-economica';
import { lesson as eco_indicadores } from './eco-indicadores';
import { lesson as eco_ml_intro } from './eco-ml-intro';
import { lesson as eco_numpy } from './eco-numpy';
import { lesson as eco_otimizacao } from './eco-otimizacao';
import { lesson as eco_pandas } from './eco-pandas';
import { lesson as eco_series_economicas } from './eco-series-economicas';
import { lesson as eco_series_temporais } from './eco-series-temporais';
import { lesson as eco_visualizacao } from './eco-visualizacao';
import { lesson as fluxo_break_continue_range } from './fluxo-break-continue-range';
import { lesson as fluxo_comparacoes } from './fluxo-comparacoes';
import { lesson as fluxo_comprehensions } from './fluxo-comprehensions';
import { lesson as fluxo_for } from './fluxo-for';
import { lesson as fluxo_if_elif_else } from './fluxo-if-elif-else';
import { lesson as fluxo_operadores_logicos } from './fluxo-operadores-logicos';
import { lesson as fluxo_while } from './fluxo-while';
import { lesson as func_args_kwargs } from './func-args-kwargs';
import { lesson as func_argumentos_nomeados } from './func-argumentos-nomeados';
import { lesson as func_composicao } from './func-composicao';
import { lesson as func_decoradores } from './func-decoradores';
import { lesson as func_definicao_chamada } from './func-definicao-chamada';
import { lesson as func_escopo_closures } from './func-escopo-closures';
import { lesson as func_funcoes_como_objetos } from './func-funcoes-como-objetos';
import { lesson as func_funcoes_ordem_superior } from './func-funcoes-ordem-superior';
import { lesson as func_parametros_argumentos } from './func-parametros-argumentos';
import { lesson as func_puras_efeitos_colaterais } from './func-puras-efeitos-colaterais';
import { lesson as func_recursao } from './func-recursao';
import { lesson as func_valores_padrao } from './func-valores-padrao';
import { lesson as fund_booleanos } from './fund-booleanos';
import { lesson as fund_conversao_tipos } from './fund-conversao-tipos';
import { lesson as fund_entrada_saida } from './fund-entrada-saida';
import { lesson as fund_expressoes } from './fund-expressoes';
import { lesson as fund_strings } from './fund-strings';
import { lesson as fund_tipos_numericos } from './fund-tipos-numericos';
import { lesson as fund_variaveis } from './fund-variaveis';
import { lesson as int_arquivos_serializacao } from './int-arquivos-serializacao';
import { lesson as int_concorrencia_async } from './int-concorrencia-async';
import { lesson as int_context_managers } from './int-context-managers';
import { lesson as int_excecoes } from './int-excecoes';
import { lesson as int_funcional } from './int-funcional';
import { lesson as int_iteradores_geradores } from './int-iteradores-geradores';
import { lesson as int_modulos_pacotes } from './int-modulos-pacotes';
import { lesson as int_organizacao_projetos } from './int-organizacao-projetos';
import { lesson as int_performance_memoria } from './int-performance-memoria';
import { lesson as int_testes } from './int-testes';
import { lesson as int_type_hints } from './int-type-hints';

import type { Lesson } from '@/types';

export const allLessons: Lesson[] = [
  cls_atributos,
  cls_classes_instancias,
  cls_composicao,
  cls_dataclasses,
  cls_encapsulamento,
  cls_heranca,
  cls_metodos_especiais,
  cls_metodos,
  cls_objetos_identidade,
  cls_principios_projeto,
  cls_propriedades,
  cls_protocolos_polimorfismo,
  dados_conjuntos,
  dados_dicionarios,
  dados_indexacao_fatiamento,
  dados_iteracao_desempacotamento,
  dados_listas,
  dados_mutabilidade,
  dados_tuplas,
  eco_econometria,
  eco_engenharia_economica,
  eco_indicadores,
  eco_ml_intro,
  eco_numpy,
  eco_otimizacao,
  eco_pandas,
  eco_series_economicas,
  eco_series_temporais,
  eco_visualizacao,
  fluxo_break_continue_range,
  fluxo_comparacoes,
  fluxo_comprehensions,
  fluxo_for,
  fluxo_if_elif_else,
  fluxo_operadores_logicos,
  fluxo_while,
  func_args_kwargs,
  func_argumentos_nomeados,
  func_composicao,
  func_decoradores,
  func_definicao_chamada,
  func_escopo_closures,
  func_funcoes_como_objetos,
  func_funcoes_ordem_superior,
  func_parametros_argumentos,
  func_puras_efeitos_colaterais,
  func_recursao,
  func_valores_padrao,
  fund_booleanos,
  fund_conversao_tipos,
  fund_entrada_saida,
  fund_expressoes,
  fund_strings,
  fund_tipos_numericos,
  fund_variaveis,
  int_arquivos_serializacao,
  int_concorrencia_async,
  int_context_managers,
  int_excecoes,
  int_funcional,
  int_iteradores_geradores,
  int_modulos_pacotes,
  int_organizacao_projetos,
  int_performance_memoria,
  int_testes,
  int_type_hints,
];

export const lessonsById: Record<string, Lesson> = Object.fromEntries(
  allLessons.map(l => [l.id, l])
);
