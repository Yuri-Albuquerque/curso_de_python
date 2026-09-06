import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-metodos-especiais', trackId: 'classes',
  title: 'Métodos especiais', description: 'Dunder methods: __init__, __str__, __repr__, __eq__.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['cls-propriedades'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Dunder methods** (double underscore) definem comportamento de operadores: `__str__` (print), `__repr__` (repr), `__eq__` (==), `__lt__` (<), `__len__`, `__add__`.',
      codeExample: 'class Ativo:\n    def __init__(self, ticker, preco):\n        self.ticker = ticker\n        self.preco = preco\n\n    def __str__(self):\n        return f\"{self.ticker}: R$ {self.preco:.2f}\ "\n\n    def __repr__(self):\n        return f\"Ativo(\'{self.ticker}\', {self.preco})\"' },
    { id: 's2', type: 'explanation', content: '`__eq__` permite comparar objetos com ==. `__lt__` permite ordenar com < ou sorted().',
      codeExample: 'class Ativo:\n    def __init__(self, ticker, preco):\n        self.ticker = ticker\n        self.preco = preco\n\n    def __eq__(self, other):\n        return self.ticker == other.ticker\n\n    def __lt__(self, other):\n        return self.preco < other.preco' },
    { id: 's3', type: 'quiz', question: 'O que __str__ define?',
      options: ['A representação para desenvolvedores', 'A string mostrada por print()', 'O construtor', 'A comparação'], answer: 1,
      explanation: '__str__ define a string amigável mostrada por print(). __repr__ é para desenvolvedores.' },
    { id: 's4', type: 'code', prompt: 'Adicione __str__ à classe Ativo que retorna "TICKER: R$ PRECO".',
      starterCode: "class Ativo:\n    def __init__(self, ticker, preco):\n        self.ticker = ticker\n        self.preco = preco\n\n    def __str__(self):\n        \n\na = Ativo('PETR4', 28.5)",
      tests: [{ expression: 'str(a)', expected: 'PETR4: R$ 28.50' }],
      hint: 'return f"{self.ticker}: R$ {self.preco:.2f}"' },
  ],
};
