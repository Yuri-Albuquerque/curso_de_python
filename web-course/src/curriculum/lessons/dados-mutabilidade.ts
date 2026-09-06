import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'dados-mutabilidade', trackId: 'estruturas-dados',
  title: 'Mutabilidade',
  description: 'Diferença entre objetos mutáveis e imutáveis.',
  difficulty: 2, xp: 15, estimatedMinutes: 7,
  prerequisites: ['dados-indexacao-fatiamento'],
  steps: [
    { id: 's1', type: 'explanation',
      content: '**Mutáveis**: listas, dicionários, sets — podem ser modificados após criados.\n**Imutáveis**: int, float, str, tuple, bool — não podem ser modificados.',
      codeExample: '# Mutável\nlista = [1, 2, 3]\nlista[0] = 99  # OK\n\n# Imutável\ntupla = (1, 2, 3)\n# tupla[0] = 99  # TypeError!' },
    { id: 's2', type: 'explanation',
      content: 'Cuidado: ao atribuir uma lista a outra variável, **ambas apontam para o mesmo objeto**. Use `copy()` ou `list()` para criar uma cópia independente.',
      codeExample: 'a = [1, 2, 3]\nb = a         # mesma lista!\nb[0] = 99\nprint(a)  # [99, 2, 3]\n\nc = a.copy()  # cópia independente\nc[0] = 0\nprint(a)  # [99, 2, 3] (não mudou)' },
    { id: 's3', type: 'predict-output',
      prompt: 'O que o código imprime?', code: 'a = [1, 2]\nb = a\nb.append(3)\nprint(len(a))',
      expectedOutput: '3', hint: 'a e b apontam para a mesma lista.' },
    { id: 's4', type: 'quiz',
      question: 'Como criar uma cópia independente de uma lista?',
      options: ['b = a', 'b = a.copy()', 'b = list(a)', 'Ambas B e C estão corretas'], answer: 3,
      explanation: 'copy() e list() criam cópias independentes. Atribuição direta não.' },
    { id: 's5', type: 'fix-bug',
      prompt: 'O código modifica a lista original por enguso. Corrija.',
      buggyCode: 'original = [1, 2, 3]\ncopia = original\ncopia.append(4)',
      tests: [],
      hint: 'Use .copy() ao atribuir.' },
  ],
};
