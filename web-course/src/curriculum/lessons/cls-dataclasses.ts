import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-dataclasses', trackId: 'classes',
  title: 'dataclasses', description: 'Classes de dados com menos boilerplate.',
  difficulty: 2, xp: 20, estimatedMinutes: 8, prerequisites: ['cls-protocolos-polimorfismo'],
  steps: [
    { id: 's1', type: 'explanation', content: '`@dataclass` gera automaticamente `__init__`, `__repr__` e `__eq__`. Ideal para classes que principalmente armazenam dados.',
      codeExample: 'from dataclasses import dataclass\n\n@dataclass\nclass Ativo:\n    ticker: str\n    preco: float\n    quantidade: int\n\n    @property\n    def valor_posicao(self):\n        return self.preco * self.quantidade\n\na = Ativo(\"PETR4\", 28.5, 100)\nprint(a)  # Ativo(ticker=\'PETR4\', preco=28.5, quantidade=100)\na.valor_posicao  # 2850.0' },
    { id: 's2', type: 'explanation', content: 'Dataclasses suportam valores padrão, `frozen=True` (imutável) e `field(default_factory=list)` para defaults mutáveis.',
      codeExample: '@dataclass(frozen=True)\nclass Moeda:\n    codigo: str\n    taxa: float\n\n@dataclass\nclass Carteira:\n    nome: str\n    ativos: list = field(default_factory=list)' },
    { id: 's3', type: 'quiz', question: 'O que @dataclass gera automaticamente?',
      options: ['Apenas __init__', '__init__, __repr__ e __eq__', 'Todos os métodos', 'Nada'], answer: 1,
      explanation: '@dataclass gera __init__, __repr__ e __eq__ automaticamente.' },
    { id: 's4', type: 'code', prompt: 'Crie uma dataclass Ativo com ticker, preco e quantidade, e uma propriedade valor_posicao.',
      starterCode: 'from dataclasses import dataclass\n\n@dataclass\nclass Ativo:\n    ticker: str\n    preco: float\n    quantidade: int\n\n    @property\n    def valor_posicao(self):\n        \n\na = Ativo(\"PETR4\", 28.5, 100)',
      tests: [{ expression: 'a.valor_posicao', expected: 2850.0 }],
      hint: 'return self.preco * self.quantidade' },
  ],
};
