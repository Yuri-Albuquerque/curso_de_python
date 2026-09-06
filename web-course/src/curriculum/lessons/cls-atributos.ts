import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-atributos', trackId: 'classes',
  title: 'Atributos', description: 'Atributos de instância vs de classe.',
  difficulty: 2, xp: 15, estimatedMinutes: 7, prerequisites: ['cls-classes-instancias'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Atributos de instância**: únicos para cada objeto (definidos em `__init__`). **Atributos de classe**: compartilhados por todas as instâncias.',
      codeExample: 'class Empresa:\n    pais = \"Brasil\"  # atributo de classe\n    def __init__(self, ticker):\n        self.ticker = ticker  # atributo de instancia' },
    { id: 's2', type: 'explanation', content: 'Acesse atributos com `obj.atributo`. Modifique com `obj.atributo = novo_valor`. Adicione novos dinamicamente.',
      codeExample: 'p = Produto(\"Café\", 15.5)\np.preco = 16.0\np.estoque = 100  # novo atributo' },
    { id: 's3', type: 'quiz', question: 'Atributos de classe são:',
      options: ['Únicos por instância', 'Compartilhados por todas as instâncias', 'Privados', 'Constantes'], answer: 1,
      explanation: 'Atributos de classe são compartilhados — mudar em um lugar afeta todas as instâncias.' },
    { id: 's4', type: 'code', prompt: 'Crie uma classe Conta com saldo no construtor e adicione um método para depositar.',
      starterCode: 'class Conta:\n    def __init__(self, saldo):\n        self.saldo = saldo\n    def depositar(self, valor):\n        \n\nc = Conta(100)\nc.depositar(50)',
      tests: [{ expression: 'c.saldo', expected: 150 }],
      hint: 'self.saldo += valor' },
  ],
};
