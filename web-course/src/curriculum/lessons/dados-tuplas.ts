import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'dados-tuplas', trackId: 'estruturas-dados',
  title: 'Tuplas',
  description: 'Sequências imutáveis e seus usos.',
  difficulty: 2, xp: 10, estimatedMinutes: 5,
  prerequisites: ['dados-listas'],
  steps: [
    { id: 's1', type: 'explanation',
      content: 'Tuplas são como listas, mas **imutáveis** — não podem ser modificadas após criadas. Use parênteses `()`.',
      codeExample: 'preco = (10.5, 20.0, 30.0)\npreco[0]    # 10.5\n# preco[0] = 15  # TypeError! Tuplas são imutáveis' },
    { id: 's2', type: 'explanation',
      content: 'Tuplas são usadas para agrupar dados relacionados que não devem mudar. Também para retornar múltiplos valores de funções.',
      codeExample: 'def calcular(preco, qty):\n    return preco * qty, preco, qty\n\nreceita, p, q = calcular(50, 4)\n# receita=200, p=50, q=4' },
    { id: 's3', type: 'quiz',
      question: 'O que acontece ao tentar modificar um elemento de uma tupla?',
      options: ['Modifica normalmente', 'Levanta TypeError', 'Cria uma nova tupla', 'Levanta IndexError'],
      answer: 1, explanation: 'Tuplas são imutáveis; qualquer tentativa de modificação levanta TypeError.' },
    { id: 's4', type: 'predict-output',
      prompt: 'Qual é o resultado?', code: 't = (1, 2, 3)\nprint(len(t))',
      expectedOutput: '3', hint: 'len() funciona em tuplas também.' },
    { id: 's5', type: 'code',
      prompt: 'Crie uma tupla com 3 valores: ticker, preco, quantidade.',
      starterCode: "ativo = \n",
      tests: [{ expression: 'ativo', expected: ['PETR4', 28.5, 100] }],
      hint: 'Use parênteses: (ticker, preco, qty)' },
  ],
};
