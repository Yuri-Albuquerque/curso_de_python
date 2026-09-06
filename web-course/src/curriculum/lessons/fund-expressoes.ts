import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'fund-expressoes',
  trackId: 'fundamentos',
  title: 'Expressões e valores',
  description: 'Aprenda como Python avalia expressões e produz valores.',
  difficulty: 1,
  xp: 10,
  estimatedMinutes: 5,
  prerequisites: [],
  steps: [
    {
      id: 's1',
      type: 'explanation',
      content: 'Em Python, uma **expressão** é qualquer trecho de código que produz um valor. O número `42` é uma expressão. `2 + 3` também é — Python avalia e produz `5`.',
      codeExample: '# Expressões simples\n42\n2 + 3\n10 * 4\n\'Python\' + \' para Economistas\'',
    },
    {
      id: 's2',
      type: 'explanation',
      content: 'Expressões podem usar **operadores aritméticos**: `+` (soma), `-` (subtração), `*` (multiplicação), `/` (divisão), `//` (divisão inteira), `%` (módulo/resto) e `**` (potência). Em economia, calculamos receitas, custos e lucros com essas operações.',
      codeExample: 'preco = 25.90\nquantidade = 80\nreceita = preco * quantidade  # 2072.0\ncusto = 1500\nlucro = receita - custo  # 572.0',
    },
    {
      id: 's3',
      type: 'predict-output',
      prompt: 'Qual é o resultado da expressão abaixo?',
      code: '100 / 8',
      expectedOutput: '12.5',
      hint: 'O operador / sempre retorna um float em Python 3.',
    },
    {
      id: 's4',
      type: 'predict-output',
      prompt: 'Qual é o resultado da expressão abaixo?',
      code: '100 // 8',
      expectedOutput: '12',
      hint: 'O operador // faz divisão inteira, descartando a parte decimal.',
    },
    {
      id: 's5',
      type: 'quiz',
      question: 'Qual operador calcula o resto de uma divisão?',
      options: ['/', '//', '%', '**'],
      answer: 2,
      explanation: 'O operador % retorna o resto da divisão. Por exemplo, 10 % 3 = 1.',
    },
    {
      id: 's6',
      type: 'code',
      prompt: 'Calcule o valor futuro de um investimento de R$ 1000 a uma taxa de 5% por 2 períodos. Use: VF = capital * (1 + taxa) ** periodos',
      starterCode: 'capital = 1000\ntaxa = 0.05\nperiodos = 2\nvalor_futuro = ___',
      tests: [{ expression: 'valor_futuro', expected: 1102.5 }],
      hint: 'Use o operador ** para potência.',
    },
  ],
};
