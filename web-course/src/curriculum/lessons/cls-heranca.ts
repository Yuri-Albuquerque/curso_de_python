import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-heranca', trackId: 'classes',
  title: 'Herança', description: 'Reutilizando código com classes base.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['cls-metodos-especiais'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Herança**: uma classe herda de outra. Use `class Filha(Pai):`. A filha pode sobrescrever métodos e adicionar novos.',
      codeExample: 'class Ativo:\n    def __init__(self, ticker, preco):\n        self.ticker = ticker\n        self.preco = preco\n\nclass Acao(Ativo):\n    def __init__(self, ticker, preco, dividendos):\n        super().__init__(ticker, preco)\n        self.dividendos = dividendos' },
    { id: 's2', type: 'explanation', content: '`super()` chama o método da classe pai. É usado no construtor para reutilizar a inicialização.',
      codeExample: 'class Acao(Ativo):\n    def __init__(self, ticker, preco, dividendos):\n        super().__init__(ticker, preco)  # inicializa Ativo\n        self.dividendos = dividendos  # novo atributo' },
    { id: 's3', type: 'quiz', question: 'O que super() faz?',
      options: ['Cria uma superclasse', 'Chama o método da classe pai', 'Remove a classe pai', 'Importa a classe'], answer: 1,
      explanation: 'super() dá acesso aos métodos da classe pai, especialmente __init__.' },
    { id: 's4', type: 'explanation', content: 'Em Python, **composição normalmente é mais flexível do que herança extensiva**. Prefira composição quando possível.',
      codeExample: '# Composicao em vez de heranca\nclass Carteira:\n    def __init__(self):\n        self.ativos = []  # contem Ativos\n\n    def adicionar(self, ativo):\n        self.ativos.append(ativo)' },
  ],
};
