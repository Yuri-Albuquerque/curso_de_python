import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'fluxo-comparacoes', trackId: 'fluxo',
  title: 'Comparações',
  description: 'Operadores de comparação e seu retorno booleano.',
  difficulty: 1, xp: 10, estimatedMinutes: 5,
  prerequisites: ['fund-booleanos'],
  steps: [
    { id: 's1', type: 'explanation',
      content: 'Operadores de comparação comparam valores e retornam `True` ou `False`: `==` (igual), `!=` (diferente), `<` (menor), `>` (maior), `<=` (menor ou igual), `>=` (maior ou igual).',
      codeExample: 'preco = 50\npreco > 30    # True\npreco < 30    # False\npreco == 50   # True\npreco != 50   # False' },
    { id: 's2', type: 'explanation',
      content: 'Comparações podem ser encadeadas em Python, o que é útil para verificar se um valor está em um intervalo.',
      codeExample: 'inflacao = 0.045\n0.03 < inflacao < 0.06  # True\n# Equivalente: inflacao > 0.03 and inflacao < 0.06' },
    { id: 's3', type: 'predict-output',
      prompt: 'Qual é o resultado?', code: '10 <= 10', expectedOutput: 'True',
      hint: '<= significa menor ou igual.' },
    { id: 's4', type: 'quiz',
      question: 'Qual operador verifica se dois valores são iguais?',
      options: ['=', '==', '!=', '==='], answer: 1,
      explanation: '== compara igualdade. = é atribuição. Python não tem ===.' },
    { id: 's5', type: 'code',
      prompt: 'Verifique se a inflação está entre 2% e 5% (inclusive).',
      starterCode: 'inflacao = 0.03\ndentro_meta = ',
      tests: [{ expression: 'dentro_meta', expected: true }],
      hint: 'Use encadeamento: 0.02 <= inflacao <= 0.05' },
  ],
};
