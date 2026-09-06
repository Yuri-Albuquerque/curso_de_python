import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-metodos', trackId: 'classes',
  title: 'Métodos', description: 'Funções definidas dentro de classes.',
  difficulty: 2, xp: 15, estimatedMinutes: 7, prerequisites: ['cls-atributos'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Métodos** são funções dentro de classes. Recebem `self` como primeiro parâmetro. Podem acessar e modificar atributos da instância.',
      codeExample: 'class Carteira:\n    def __init__(self):\n        self.ativos = []\n    def adicionar(self, ticker, qty):\n        self.ativos.append((ticker, qty))\n    def total(self):\n        return sum(qty for _, qty in self.ativos)' },
    { id: 's2', type: 'code', prompt: 'Adicione um método valor_total que retorna preco * qty.',
      starterCode: 'class Ativo:\n    def __init__(self, ticker, preco, qty):\n        self.ticker = ticker\n        self.preco = preco\n        self.qty = qty\n    def valor_total(self):\n        \n\na = Ativo(\"PETR4\", 28.5, 100)',
      tests: [{ expression: 'a.valor_total()', expected: 2850.0 }],
      hint: 'return self.preco * self.qty' },
    { id: 's3', type: 'quiz', question: 'Qual o primeiro parâmetro de um método de instância?',
      options: ['cls', 'self', 'this', 'instance'], answer: 1, explanation: 'self é a referência à instância atual.' },
  ],
};
