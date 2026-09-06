import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'dados-iteracao-desempacotamento', trackId: 'estruturas-dados',
  title: 'Iteração e desempacotamento',
  description: 'Percorrer estruturas e desempacotar valores.',
  difficulty: 2, xp: 15, estimatedMinutes: 7,
  prerequisites: ['dados-mutabilidade'],
  steps: [
    { id: 's1', type: 'explanation',
      content: '**Desempacotamento** atribui elementos de uma sequência a variáveis em uma única linha. Use `*` para capturar o restante.',
      codeExample: 'ticker, preco, qty = \'PETR4\', 28.5, 100\nprimeiro, *resto = [10, 20, 30, 40]\n# primeiro=10, resto=[20, 30, 40]' },
    { id: 's2', type: 'explanation',
      content: 'Itere sobre dicionários com `.items()` para obter chave e valor simultaneamente. Use `zip()` para percorrer múltiplas listas em paralelo.',
      codeExample: "for ticker, preco in {'PETR4': 28.5, 'VALE3': 60.0}.items():\n    print(f'{ticker}: R$ {preco}')\n\nfor ticker, preco in zip(['PETR4', 'VALE3'], [28.5, 60.0]):\n    print(ticker, preco)" },
    { id: 's3', type: 'predict-output',
      prompt: 'O que o código imprime?', code: "a, b, c = [1, 2, 3]\nprint(b)",
      expectedOutput: '2', hint: 'Desempacotamento por posição.' },
    { id: 's4', type: 'quiz',
      question: 'O que zip([1,2], [3,4]) produz ao iterar?',
      options: ['[(1,3), (2,4)]', '[(1,2), (3,4)]', '[1,2,3,4]', '[(1,2,3,4)]'], answer: 0,
      explanation: 'zip emparelha elementos por posição: (1,3), (2,4).' },
    { id: 's5', type: 'code',
      prompt: 'Use zip e desempacotamento para calcular o lucro de cada produto.',
      starterCode: 'receitas = [100, 200, 150]\ncustos = [60, 180, 120]\nlucros = [r - c for ',
      tests: [{ expression: 'lucros', expected: [40, 20, 30] }],
      hint: 'r, c in zip(receitas, custos)]' },
  ],
};
