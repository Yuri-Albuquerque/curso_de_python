import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'fund-booleanos',
  trackId: 'fundamentos',
  title: 'Booleanos',
  description: 'True, False e expressões lógicas básicas.',
  difficulty: 1,
  xp: 10,
  estimatedMinutes: 5,
  prerequisites: ['fund-tipos-numericos'],
  steps: [
    {
      id: 's1',
      type: 'explanation',
      content: 'O tipo **bool** representa valores lógicos: `True` e `False` (inicial maiúscula). Comparações produzem booleanos: `==`, `!=`, `<`, `>`, `<=`, `>=`.',
      codeExample: 'True\nFalse\n5 > 3       # True\n10 == 10    # True',
    },
    {
      id: 's2',
      type: 'explanation',
      content: 'Use `bool()` para converter. Valores vazios (0, \'\', [], None) são False; o resto é True.',
      codeExample: 'bool(0)     # False\nbool(\'\')    # False\nbool(42)    # True\nbool(\'Oi\')  # True',
    },
    {
      id: 's3',
      type: 'predict-output',
      prompt: 'Qual é o resultado?',
      code: 'bool(0.0)',
      expectedOutput: 'False',
      hint: '0.0 é um valor zero, que é falsy.',
    },
    {
      id: 's4',
      type: 'quiz',
      question: 'Qual destes valores é False quando convertido para bool?',
      options: ['1', '\'False\'', '0', '\'0\''],
      answer: 2,
      explanation: '0 é falsy. A string \'False\' não é vazia, então é True.',
    },
    {
      id: 's5',
      type: 'code',
      prompt: 'Crie uma variável lucro_positivo que é True se lucro > 0.',
      starterCode: 'lucro = 500\nlucro_positivo = ',
      tests: [{ expression: 'lucro_positivo', expected: true }],
      hint: 'Use o operador > para comparar.',
    },
  ],
};
