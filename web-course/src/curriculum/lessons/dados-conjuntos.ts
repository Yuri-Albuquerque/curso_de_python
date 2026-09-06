import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'dados-conjuntos', trackId: 'estruturas-dados',
  title: 'Conjuntos',
  description: 'Sets: coleções não ordenadas de elementos únicos.',
  difficulty: 2, xp: 10, estimatedMinutes: 5,
  prerequisites: ['dados-dicionarios'],
  steps: [
    { id: 's1', type: 'explanation',
      content: 'Conjuntos (**sets**) são coleções **não ordenadas** de elementos **únicos**. Úteis para eliminar duplicatas e operações de conjunto (união, interseção, diferença).',
      codeExample: "tickers = {'PETR4', 'VALE3', 'ITUB4', 'PETR4'}\n# {'PETR4', 'VALE3', 'ITUB4'} — remove duplicata" },
    { id: 's2', type: 'explanation',
      content: 'Operações: `|` (união), `&` (interseção), `-` (diferença), `^` (diferença simétrica).',
      codeExample: "a = {1, 2, 3}\nb = {3, 4, 5}\na | b  # {1, 2, 3, 4, 5}\na & b  # {3}\na - b  # {1, 2}" },
    { id: 's3', type: 'predict-output',
      prompt: 'Qual é o resultado?', code: "set([1, 1, 2, 2, 3, 3])",
      expectedOutput: '{1, 2, 3}', hint: 'Sets eliminam duplicatas.' },
    { id: 's4', type: 'quiz',
      question: 'Qual operador faz interseção entre dois sets?',
      options: ['|', '&', '-', '^'], answer: 1,
      explanation: '& retorna os elementos comuns aos dois sets.' },
    { id: 's5', type: 'code',
      prompt: 'Encontre os tickers que aparecem em ambas as listas (interseção).',
      starterCode: "carteira_a = {'PETR4', 'VALE3', 'ITUB4'}\ncarteira_b = {'VALE3', 'ITUB4', 'BBDC4'}\ncomuns = ",
      tests: [{ expression: 'len(comuns)', expected: 2 }],
      hint: 'Use o operador &' },
  ],
};
