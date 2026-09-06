import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-iteradores-geradores', trackId: 'intermediario',
  title: 'Iteradores e geradores', description: 'Protocolo iterador e yield.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['cls-principios-projeto'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Iterador**: objeto com `__next__()` que retorna o próximo elemento ou levanta `StopIteration`. **Gerador**: função com `yield` que produz valores sob demanda.',
      codeExample: '# Gerador: produz valores sob demanda\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ngen = fibonacci()\nnext(gen)  # 0\nnext(gen)  # 1\nnext(gen)  # 1\nnext(gen)  # 2' },
    { id: 's2', type: 'explanation', content: 'Geradores são **lazy** — produzem valores apenas quando solicitados. Economizam memória em sequências grandes.',
      codeExample: '# Em vez de criar lista de 1M de numeros:\n# numeros = [x for x in range(1000000)]  # usa ~8MB\n\n# Gerador: quase nada de memoria\nnumeros = (x for x in range(1000000))\nsum(numeros)  # 499999500000' },
    { id: 's3', type: 'quiz', question: 'Qual a diferença entre return e yield?',
      options: ['Nenhuma', 'return termina; yield pausa e retoma', 'yield é mais lento', 'return só em classes'], answer: 1,
      explanation: 'yield pausa a função, retornando um valor; na próxima chamada, continua de onde parou.' },
    { id: 's4', type: 'code', prompt: 'Escreva um gerador que produz preços com desconto de uma lista.',
      starterCode: 'def descontos(precos, taxa):\n    for p in precos:\n        \n\ngen = descontos([100, 200, 300], 0.1)\nresultado = list(gen)',
      tests: [{ expression: 'resultado', expected: [90.0, 180.0, 270.0] }],
      hint: 'yield p * (1 - taxa)' },
  ],
};
