import type { Lesson } from '@/types';

export const lesson: Lesson = {
  id: 'fund-conversao-tipos',
  trackId: 'fundamentos',
  title: 'Conversão de tipos',
  description: 'int(), float(), str(), bool() e type casting.',
  difficulty: 1,
  xp: 15,
  estimatedMinutes: 7,
  prerequisites: ['fund-entrada-saida'],
  steps: [
    {
      id: 's1',
      type: 'explanation',
      content: 'Python oferece funções built-in para converter entre tipos: `int()`, `float()`, `str()`, `bool()`.',
      codeExample: 'int(\'42\')      # 42\nint(3.99)     # 3 (trunca)\nfloat(\'3.14\')  # 3.14\nstr(42)        # \'42\'\nbool(1)        # True',
    },
    {
      id: 's2',
      type: 'explanation',
      content: 'Conversões implícitas acontecem automaticamente. int + float resulta em float. True == 1, False == 0.',
      codeExample: '5 + 2.0   # 7.0 (float)\n42 + True # 43\n42 + False # 42',
    },
    {
      id: 's3',
      type: 'predict-output',
      prompt: 'Qual é o resultado de str(3.14) + " é pi"?',
      code: "str(3.14) + ' é pi'",
      expectedOutput: '3.14 é pi',
      hint: 'str() converte 3.14 para string, depois concatena.',
    },
    {
      id: 's4',
      type: 'quiz',
      question: 'O que acontece com int("3.14")?',
      options: ['Retorna 3', 'Retorna 3.14', 'Levanta ValueError', 'Retorna None'],
      answer: 2,
      explanation: 'int() não converte string com ponto decimal diretamente. Use float() primeiro.',
    },
    {
      id: 's5',
      type: 'code',
      prompt: 'Converta a string 1234.56 para float e depois para int.',
      starterCode: "valor_str = '1234.56'\nvalor_float = \nvalor_int = ",
      tests: [
        { expression: 'valor_float', expected: 1234.56 },
        { expression: 'valor_int', expected: 1234 },
      ],
      hint: 'Primeiro float(), depois int().',
    },
    {
      id: 's6',
      type: 'explanation',
      content: 'Erros de conversão são comuns ao processar dados econômicos. Sempre valide ou trate exceções ao converter strings de arquivos CSV ou APIs.',
      codeExample: "try:\n    preco = float(input('Preço: '))\nexcept ValueError:\n    preco = 0.0\n    print('Valor inválido!')",
    },
  ],
};
