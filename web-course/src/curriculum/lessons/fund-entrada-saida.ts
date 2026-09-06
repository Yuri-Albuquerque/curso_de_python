import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'fund-entrada-saida',
  trackId: 'fundamentos',
  title: 'Entrada e saída',
  description: 'print() e input() para interagir com o usuário.',
  difficulty: 1,
  xp: 10,
  estimatedMinutes: 5,
  prerequisites: ['fund-strings'],
  steps: [
    {
      id: 's1',
      type: 'explanation',
      content: 'A função `print()` exibe valores no console. Você pode imprimir múltiplos valores separados por vírgula.',
      codeExample: 'print(\'Olá, Economista!\')\nprint(\'Receita:\', 2072.0)\nprint(\'Preço:\', 25.90, \'Qtde:\', 80)',
    },
    {
      id: 's2',
      type: 'explanation',
      content: 'A função `input()` lê texto do usuário. **Sempre** retorna uma string — use `int()` ou `float()` se precisar de números.',
      codeExample: 'nome = input(\'Digite seu nome: \')\npreco = float(input(\'Preço: \'))',
    },
    {
      id: 's3',
      type: 'quiz',
      question: 'O que input() retorna quando o usuário digita 42?',
      options: ['int 42', 'float 42.0', "str '42'", 'bool True'],
      answer: 2,
      explanation: 'input() sempre retorna uma string, mesmo que o usuário digite números.',
    },
    {
      id: 's4',
      type: 'predict-output',
      prompt: 'O que o código imprime?',
      code: "print('A', 'B', 'C', sep='-')",
      expectedOutput: 'A-B-C',
      hint: 'O parâmetro sep define o separador entre valores.',
    },
    {
      id: 's5',
      type: 'code',
      prompt: 'Imprima Receita: R$ 2072.00 usando print com f-string.',
      starterCode: 'receita = 2072.0\n',
      tests: [],
      hint: 'Use print(f\'Receita: R$ {receita:.2f}\')',
    },
  ],
};
