import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-recursao', trackId: 'funcoes',
  title: 'Recursão', description: 'Funções que chamam a si mesmas.',
  difficulty: 3, xp: 15, estimatedMinutes: 7, prerequisites: ['func-decoradores'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Recursão**: uma função chama a si mesma. Toda recursão precisa de um **caso base** (condição de parada).',
      codeExample: 'def fatorial(n):\n    if n <= 1:  # caso base\n        return 1\n    return n * fatorial(n - 1)\n\nfatorial(5)  # 120' },
    { id: 's2', type: 'explanation', content: 'Recursão é natural para problemas que se dividem em subproblemas menores. Sequência de Fibonacci é um clássico.',
      codeExample: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nfib(10)  # 55' },
    { id: 's3', type: 'predict-output', prompt: 'O que retorna?', code: 'def f(n):\n    if n == 0:\n        return 0\n    return n + f(n-1)\nf(5)', expectedOutput: '15', hint: 'Soma de 1 a 5.' },
    { id: 's4', type: 'quiz', question: 'O que acontece numa recursão sem caso base?',
      options: ['Retorna 0', 'RecursionError (stack overflow)', 'Retorna None', 'Loop infinito sem erro'], answer: 1,
      explanation: 'Sem caso base, a recursão nunca para e excede o limite da pilha.' },
    { id: 's5', type: 'code', prompt: 'Defina uma função recursiva que calcula o juros composto recursivamente.',
      starterCode: 'def juros_recursivo(capital, taxa, periodos):\n    if periodos == 0:\n        return \n    return ',
      tests: [{ expression: 'juros_recursivo(1000, 0.10, 2)', expected: 1210.0000000000002 }],
      hint: 'Caso base: return capital. Recursão: juros_recursivo(capital*(1+taxa), taxa, periodos-1)' },
  ],
};
