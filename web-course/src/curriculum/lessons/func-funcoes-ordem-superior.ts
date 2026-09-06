import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-funcoes-ordem-superior', trackId: 'funcoes',
  title: 'Funções de ordem superior', description: 'map, filter e funções que recebem funções.',
  difficulty: 3, xp: 20, estimatedMinutes: 8, prerequisites: ['func-funcoes-como-objetos'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Funções de ordem superior** recebem ou retornam funções. `map(f, seq)` aplica f a cada elemento. `filter(f, seq)` filtra.',
      codeExample: 'precos = [10, 20, 30]\nlist(map(lambda p: p * 1.1, precos))  # [11.0, 22.0, 33.0]\nlist(filter(lambda p: p > 15, precos))  # [20, 30]' },
    { id: 's2', type: 'explanation', content: '`lambda` cria funções anônimas de uma linha. Úteis para operações simples.',
      codeExample: 'soma = lambda a, b: a + b\nsoma(3, 4)  # 7\n\n# Equivalente:\ndef soma(a, b):\n    return a + b' },
    { id: 's3', type: 'predict-output', prompt: 'O que retorna?', code: 'list(map(lambda x: x ** 2, [1, 2, 3]))', expectedOutput: '[1, 4, 9]', hint: 'Cada elemento elevado ao quadrado.' },
    { id: 's4', type: 'quiz', question: 'O que filter(lambda x: x > 0, [-1, 0, 1, 2]) retorna?',
      options: ['[-1, 0]', '[1, 2]', '[0, 1, 2]', '[-1, 0, 1, 2]'], answer: 1,
      explanation: 'filter mantém apenas os elementos onde a função retorna True.' },
    { id: 's5', type: 'code', prompt: 'Use map para aplicar 10% de desconto a cada preço.',
      starterCode: 'precos = [100, 200, 300]\ndescontados = list(map(\n',
      tests: [{ expression: 'descontados', expected: [90.0, 180.0, 270.0] }],
      hint: 'lambda p: p * 0.9, precos)' },
  ],
};
