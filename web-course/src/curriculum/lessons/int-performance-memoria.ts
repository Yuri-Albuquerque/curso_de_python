import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-performance-memoria', trackId: 'intermediario',
  title: 'Performance e memória', description: 'Otimização, profiling e modelo de memória.',
  difficulty: 3, xp: 15, estimatedMinutes: 8, prerequisites: ['int-concorrencia-async'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Python é mais lento que C/Java, mas raramente é o gargalo. Use **profiling** para identificar onde otimizar. `timeit`, `cProfile`, `line_profiler`.',
      codeExample: 'import timeit\n\ntimeit.timeit(\"sum(range(1000))\", number=10000)\n# vs\ntimeit.timeit(\"[x for x in range(1000)]\", number=10000)' },
    { id: 's2', type: 'explanation', content: 'Otimizações comuns: usar list comprehensions (mais rápidas que for+append), NumPy para operações vetoriais, evitar concatenação de strings em loops.',
      codeExample: '# Lento\nresultado = \'\'\nfor s in lista:\n    resultado += s  # cria nova string a cada iteracao\n\n# Rapido\nresultado = \'\'.join(lista)  # uma operacao' },
    { id: 's3', type: 'quiz', question: 'Qual ferramenta identifica onde o tempo está sendo gasto?',
      options: ['print()', 'cProfile', 'time.sleep()', 'assert'], answer: 1,
      explanation: 'cProfile profile o código e mostra onde o tempo é gasto.' },
  ],
};
