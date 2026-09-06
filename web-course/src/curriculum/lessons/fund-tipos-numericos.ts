import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'fund-tipos-numericos',
  trackId: 'fundamentos',
  title: 'Tipos numéricos',
  description: 'int, float e a função type().',
  difficulty: 1,
  xp: 15,
  estimatedMinutes: 7,
  prerequisites: ['fund-variaveis'],
  steps: [
    {
      id: 's1',
      type: 'explanation',
      content: 'Python tem dois tipos numéricos principais: **int** (inteiros) e **float** (ponto flutuante). Python infere o tipo automaticamente.',
      codeExample: '# int\nidade = 25\nano = 2024\n\n# float\npreco = 19.99\ntaxa = 0.15',
    },
    {
      id: 's2',
      type: 'explanation',
      content: 'Use `type()` para descobrir o tipo. Use `int()` e `float()` para converter entre tipos.',
      codeExample: 'type(42)      # <class \'int\'>\ntype(3.14)    # <class \'float\'>\nint(3.99)     # 3 (trunca)\nfloat(5)      # 5.0',
    },
    {
      id: 's3',
      type: 'predict-output',
      prompt: 'Qual é o resultado de int(3.99)?',
      code: 'int(3.99)',
      expectedOutput: '3',
      hint: 'int() trunca — sempre arredonda para baixo.',
    },
    {
      id: 's4',
      type: 'quiz',
      question: 'Qual é o tipo de 10 / 3 em Python 3?',
      options: ['int', 'float', 'str', 'bool'],
      answer: 1,
      explanation: 'O operador / sempre retorna float em Python 3.',
    },
    {
      id: 's5',
      type: 'code',
      prompt: 'Converta o preço de string para float e calcule o total.',
      starterCode: 'preco_str = \'99.50\'\nquantidade = 4\npreco_float = \ntotal = ',
      tests: [
        { expression: 'preco_float', expected: 99.5 },
        { expression: 'total', expected: 398.0 },
      ],
      hint: 'Use float() para converter a string.',
    },
  ],
};
