import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-classes-instancias', trackId: 'classes',
  title: 'Classes e instâncias', description: 'Definindo classes e criando objetos.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['cls-objetos-identidade'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Uma **classe** é um molde para criar objetos. `__init__` é o construtor, executado ao criar uma instância.',
      codeExample: 'class Produto:\n    def __init__(self, nome, preco):\n        self.nome = nome\n        self.preco = preco\n\np = Produto(\"Café\", 15.50)\nprint(p.nome)   # Café\nprint(p.preco)  # 15.50' },
    { id: 's2', type: 'explanation', content: '`self` refere-se à instância atual. Todo método recebe `self` como primeiro parâmetro.',
      codeExample: 'class Ativo:\n    def __init__(self, ticker, preco):\n        self.ticker = ticker\n        self.preco = preco\n    def valor(self, qty):\n        return self.preco * qty\n\nativo = Ativo(\"PETR4\", 28.5)\nativo.valor(100)  # 2850.0' },
    { id: 's3', type: 'quiz', question: 'O que self representa em um método?',
      options: ['A classe', 'A instância atual', 'O construtor', 'Um parâmetro opcional'], answer: 1,
      explanation: 'self é a referência à instância sobre a qual o método foi chamado.' },
    { id: 's4', type: 'code', prompt: 'Defina uma classe Produto com nome e preco no construtor.',
      starterCode: 'class Produto:\n    def __init__(self, nome, preco):\n        \n\np = Produto(\"Café\", 15.50)',
      tests: [{ expression: 'p.nome', expected: 'Café' }, { expression: 'p.preco', expected: 15.5 }],
      hint: 'self.nome = nome; self.preco = preco' },
  ],
};
