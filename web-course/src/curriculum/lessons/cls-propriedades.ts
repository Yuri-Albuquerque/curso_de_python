import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-propriedades', trackId: 'classes',
  title: 'Propriedades', description: 'Getters e setters elegantes com @property.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['cls-encapsulamento'],
  steps: [
    { id: 's1', type: 'explanation', content: '`@property` cria um getter elegante — acesso como atributo, mas com lógica. `@nome.setter` define o setter.',
      codeExample: 'class Ativo:\n    def __init__(self, ticker, preco, qty):\n        self.ticker = ticker\n        self._preco = preco\n        self.qty = qty\n\n    @property\n    def valor_posicao(self):\n        return self._preco * self.qty' },
    { id: 's2', type: 'explanation', content: 'Propriedades permitem validação sem mudar a interface. O usuário acessa `obj.preco` sem saber que há validação.',
      codeExample: 'class Produto:\n    @property\n    def preco(self):\n        return self._preco\n\n    @preco.setter\n    def preco(self, valor):\n        if valor < 0:\n            raise ValueError(\"Preco nao pode ser negativo\")\n        self._preco = valor' },
    { id: 's3', type: 'quiz', question: 'Qual a vantagem de @property sobre um getter normal?',
      options: ['É mais rápido', 'Permite acesso como atributo (obj.x) com lógica', 'É obrigatório', 'Funciona apenas em herança'], answer: 1,
      explanation: '@property permite acessar como atributo, mantendo a possibilidade de adicionar lógica.' },
    { id: 's4', type: 'code', prompt: 'Use @property para criar valor_posicao em uma classe Ativo.',
      starterCode: 'class Ativo:\n    def __init__(self, preco, qty):\n        self.preco = preco\n        self.qty = qty\n\n    @property\n    def valor_posicao(self):\n        \n\na = Ativo(28.5, 100)',
      tests: [{ expression: 'a.valor_posicao', expected: 2850.0 }],
      hint: 'return self.preco * self.qty' },
  ],
};
