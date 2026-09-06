import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-parametros-argumentos', trackId: 'funcoes',
  title: 'Parâmetros e argumentos', description: 'Como passar dados para funções.',
  difficulty: 2, xp: 15, estimatedMinutes: 7, prerequisites: ['func-definicao-chamada'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Parâmetros** são variáveis na definição. **Argumentos** são os valores passados na chamada.',
      codeExample: 'def juros_compostos(capital, taxa, periodos):\n    return capital * (1 + taxa) ** periodos\n\n# capital, taxa, periodos = parametros\n# 1000, 0.05, 3 = argumentos\njuros_compostos(1000, 0.05, 3)  # 1157.625' },
    { id: 's2', type: 'explanation', content: 'Python passa argumentos por **posição** ou por **nome** (keyword). Argumentos nomeados melhoram a legibilidade.',
      codeExample: '# Por posicao\njuros_compostos(1000, 0.05, 3)\n\n# Por nome (mais legivel)\njuros_compostos(capital=1000, taxa=0.05, periodos=3)' },
    { id: 's3', type: 'quiz', question: 'Qual a vantagem de argumentos nomeados?',
      options: ['Mais rápido', 'Mais legível e menos propenso a erros', 'Permite mais argumentos', 'É obrigatório'], answer: 1,
      explanation: 'Argumentos nomeados deixam explícito o papel de cada valor.' },
    { id: 's4', type: 'code', prompt: 'Defina uma função descontar que recebe receita e custos e retorna o lucro.',
      starterCode: 'def descontar(receita, custos):\n    ', tests: [{ expression: 'descontar(5000, 3000)', expected: 2000 }], hint: 'return receita - custos' },
  ],
};
