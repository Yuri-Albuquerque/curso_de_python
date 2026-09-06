import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'fund-variaveis',
  trackId: 'fundamentos',
  title: 'Variáveis e atribuição',
  description: 'Armazene valores em variáveis e reutilize-os em expressões.',
  difficulty: 1,
  xp: 10,
  estimatedMinutes: 5,
  prerequisites: ['fund-expressoes'],
  steps: [
    {
      id: 's1',
      type: 'explanation',
      content: 'Uma **variável** é um nome que se refere a um valor. Você cria uma variável com o operador de atribuição `=`. O nome fica à esquerda, o valor à direita.',
      codeExample: 'preco = 25.90\nquantidade = 80\nreceita = preco * quantidade\nprint(receita)  # 2072.0',
    },
    {
      id: 's2',
      type: 'explanation',
      content: 'Regras para nomes: comece com letra ou underscore; pode conter letras, dígitos e underscores; sem espaços; distingue maiúsculas de minúsculas; não use palavras reservadas.',
      codeExample: '# Válido\npreco_unitario = 10.50\nPIB_2024 = 10000\n_taxa = 0.03\n\n# Inválido\n# 2preco = 10  # começa com número\n# pre co = 10  # contém espaço',
    },
    {
      id: 's3',
      type: 'quiz',
      question: 'Qual destes é um nome de variável válido em Python?',
      options: ['2preco', 'preco unitario', '_taxa', 'for'],
      answer: 2,
      explanation: '_taxa começa com underscore. 2preco começa com número, preco unitario tem espaço, for é palavra reservada.',
    },
    {
      id: 's4',
      type: 'fill-blank',
      prompt: 'Atribua o valor 1500 à variável custo e calcule o lucro.',
      codeTemplate: 'receita = 3000\ncusto = ___\nlucro = receita - custo',
      blanks: ['1500'],
      hint: 'Use o operador = para atribuição.',
    },
    {
      id: 's5',
      type: 'code',
      prompt: 'Crie variáveis para preco=120, quantidade=30 e calcule a receita.',
      starterCode: 'preco = \nquantidade = \nreceita = ',
      tests: [
        { expression: 'preco', expected: 120 },
        { expression: 'quantidade', expected: 30 },
        { expression: 'receita', expected: 3600 },
      ],
      hint: 'receita = preco * quantidade',
    },
    {
      id: 's6',
      type: 'explanation',
      content: 'Você pode reatribuir uma variável a qualquer momento. A atribuição múltipla permite criar várias variáveis em uma linha.',
      codeExample: 'x = 10\nx = 20  # x agora é 20\n\n# Atribuição múltipla\npreco, quantidade = 50, 100\nprint(preco, quantidade)  # 50 100',
    },
  ],
};
