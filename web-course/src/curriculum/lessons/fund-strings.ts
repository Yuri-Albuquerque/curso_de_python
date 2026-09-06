import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'fund-strings',
  trackId: 'fundamentos',
  title: 'Strings',
  description: 'Texto em Python: aspas, concatenação, f-strings e métodos.',
  difficulty: 1,
  xp: 15,
  estimatedMinutes: 8,
  prerequisites: ['fund-variaveis'],
  steps: [
    {
      id: 's1',
      type: 'explanation',
      content: '**Strings** são sequências de texto. Crie com aspas simples ou duplas. Para múltiplas linhas, use aspas triplas.',
      codeExample: '\'Python para Economistas\'\n"UEG - Economia"\n\'\'\'Linha 1\nLinha 2\'\'\'',
    },
    {
      id: 's2',
      type: 'explanation',
      content: '**f-strings** permitem incorporar expressões dentro de strings usando `{...}`. São a forma mais legível de interpolar valores.',
      codeExample: 'ticker = \'PETR4\'\npreco = 28.50\nf\'O preço de {ticker} é R$ {preco:.2f}\'\n# O preço de PETR4 é R$ 28.50',
    },
    {
      id: 's3',
      type: 'predict-output',
      prompt: 'Qual é o resultado da f-string abaixo?',
      code: 'ticker = \'VALE3\'\npreco = 60.0\nf\'{ticker}: R$ {preco:.2f}\'',
      expectedOutput: 'VALE3: R$ 60.00',
      hint: '.2f formata com exatamente 2 casas decimais.',
    },
    {
      id: 's4',
      type: 'fill-blank',
      prompt: 'Complete a f-string para mostrar o PIB com 2 casas decimais.',
      codeTemplate: 'pib = 10000.5\nf\'PIB 2024: R$ {pib:___}\'',
      blanks: ['.2f'],
      hint: 'Use o formato :.2f para 2 casas decimais.',
    },
    {
      id: 's5',
      type: 'code',
      prompt: 'Use uma f-string para criar: A receita foi R$ 5000.00',
      starterCode: 'receita = 5000\nmensagem = ',
      tests: [{ expression: 'mensagem', expected: 'A receita foi R$ 5000.00' }],
      hint: 'Use f\'...\' com {receita:.2f}',
    },
    {
      id: 's6',
      type: 'quiz',
      question: 'Como você cria uma string com aspas simples E duplas dentro?',
      options: ['Usando apenas aspas simples', 'Usando apenas aspas duplas', 'Aspas triplas ou escapar com \\', 'Não é possível'],
      answer: 2,
      explanation: 'Aspas triplas ou escape com barra invertida permitem incluir ambos os tipos.',
    },
  ],
};
