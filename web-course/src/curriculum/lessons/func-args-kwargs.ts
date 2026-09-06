import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-args-kwargs', trackId: 'funcoes',
  title: '*args e **kwargs', description: 'Número variável de argumentos.',
  difficulty: 3, xp: 20, estimatedMinutes: 8, prerequisites: ['func-argumentos-nomeados'],
  steps: [
    { id: 's1', type: 'explanation', content: '`*args` coleta argumentos posicionais extras em uma tupla. `**kwargs` coleta argumentos nomeados extras em um dicionário.',
      codeExample: 'def somar(*args):\n    return sum(args)\n\nsomar(1, 2, 3)       # 6\nsomar(10, 20, 30, 40)  # 100\n\ndef info(**kwargs):\n    for k, v in kwargs.items():\n        print(f\"{k}: {v}\")\n\ninfo(ticker=\"PETR4\", preco=28.5)' },
    { id: 's2', type: 'explanation', content: 'A ordem correta é: parâmetros normais, *args, parâmetros com default, **kwargs.',
      codeExample: 'def f(a, b, *args, c=10, **kwargs):\n    print(a, b, args, c, kwargs)\n\nf(1, 2, 3, 4, c=50, x=99)\n# 1 2 (3, 4) 50 {x: 99}' },
    { id: 's3', type: 'predict-output', prompt: 'O que retorna?', code: 'def f(*args):\n    return len(args)\nf(1, 2, 3, 4, 5)', expectedOutput: '5', hint: 'args é uma tupla com 5 elementos.' },
    { id: 's4', type: 'quiz', question: 'O que *args coleta?',
      options: ['Argumentos nomeados', 'Argumentos posicionais extras', 'Apenas strings', 'Nada'], answer: 1,
      explanation: '*args coleta argumentos posicionais extras em uma tupla.' },
    { id: 's5', type: 'code', prompt: 'Defina uma função media que aceita qualquer número de argumentos e retorna a média.',
      starterCode: 'def media(*args):\n    ', tests: [{ expression: 'media(10, 20, 30)', expected: 20.0 }], hint: 'return sum(args) / len(args)' },
  ],
};
