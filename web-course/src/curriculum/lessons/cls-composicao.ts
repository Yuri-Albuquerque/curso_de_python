import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-composicao', trackId: 'classes',
  title: 'Composição', description: 'Combinando objetos em vez de herdar.',
  difficulty: 3, xp: 20, estimatedMinutes: 8, prerequisites: ['cls-heranca'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Composição**: uma classe contém objetos de outras classes. Em geral, é mais flexível que herança.',
      codeExample: 'class Ativo:\n    def __init__(self, ticker, preco, qty):\n        self.ticker = ticker\n        self.preco = preco\n        self.qty = qty\n\nclass Carteira:\n    def __init__(self):\n        self.ativos = []  # composicao: contem Ativos\n\n    def adicionar(self, ativo):\n        self.ativos.append(ativo)\n\n    def valor_total(self):\n        return sum(a.preco * a.qty for a in self.ativos)' },
    { id: 's2', type: 'explanation', content: 'A regra de ouro: **"tem um" (composição) vs "é um" (herança)**. Uma Carteira *tem* Ativos (composição). Uma Ação *é um* Ativo (herança).',
      codeExample: '# Composicao: Carteira TEM Ativos\nclass Carteira:\n    def __init__(self):\n        self.ativos = []\n\n# Heranca: Acao E um Ativo\nclass Acao(Ativo):\n    pass' },
    { id: 's3', type: 'quiz', question: 'Quando preferir composição sobre herança?',
      options: ['Sempre que possível', 'Quando a relação é "tem um" vs "é um"', 'Nunca', 'Apenas em classes pequenas'], answer: 1,
      explanation: 'Composição é mais flexível e adequada para relações "tem um".' },
    { id: 's4', type: 'code', prompt: 'Implemente uma classe Portfólio que contém uma lista de Ativos e calcula o valor total.',
      starterCode: 'class Portfolio:\n    def __init__(self):\n        self.ativos = []\n    def adicionar(self, ticker, preco, qty):\n        self.ativos.append(Ativo(ticker, preco, qty))\n    def valor_total(self):\n        \n\np = Portfolio()\np.adicionar(\"PETR4\", 28.5, 100)\np.adicionar(\"VALE3\", 60.0, 50)',
      tests: [{ expression: 'p.valor_total()', expected: 5850.0 }],
      hint: 'sum(a.preco * a.qty for a in self.ativos)' },
  ],
};
