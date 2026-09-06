import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-funcional', trackId: 'intermediario',
  title: 'Programação funcional', description: 'map, filter, reduce, lambdas e imutabilidade.',
  difficulty: 3, xp: 15, estimatedMinutes: 8, prerequisites: ['int-arquivos-serializacao'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Programação funcional enfatiza funções puras, imutabilidade e composição. Ferramentas: `map`, `filter`, `reduce`, `lambda`.',
      codeExample: 'from functools import reduce\n\nprecos = [10, 20, 30, 40]\n\n# map: transforma cada elemento\ndobrados = list(map(lambda x: x * 2, precos))  # [20, 40, 60, 80]\n\n# filter: seleciona\naltos = list(filter(lambda x: x > 20, precos))  # [30, 40]\n\n# reduce: acumula\ntotal = reduce(lambda a, b: a + b, precos)  # 100' },
    { id: 's2', type: 'quiz', question: 'O que reduce faz?',
      options: ['Filtra elementos', 'Acumula elementos em um único valor', 'Transforma elementos', 'Conta elementos'], answer: 1,
      explanation: 'reduce aplica uma função acumuladora, reduzindo a sequência a um único valor.' },
    { id: 's3', type: 'predict-output', prompt: 'O que retorna?', code: 'from functools import reduce\nreduce(lambda a, b: a + b, [1, 2, 3, 4])', expectedOutput: '10', hint: 'Soma acumulada: 1+2=3, 3+3=6, 6+4=10.' },
  ],
};
