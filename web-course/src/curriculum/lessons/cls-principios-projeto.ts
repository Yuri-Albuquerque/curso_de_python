import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-principios-projeto', trackId: 'classes',
  title: 'Princípios de projeto', description: 'Boas práticas de POO em Python.',
  difficulty: 3, xp: 15, estimatedMinutes: 8, prerequisites: ['cls-dataclasses'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Princípios SOLID adaptados para Python:\n- **S**ingle Responsibility: cada classe faz uma coisa\n- **O**pen/Closed: aberto para extensão, fechado para modificação\n- **L**iskov: subtipos substituíveis\n- **I**nterface Segregation: interfaces específicas\n- **D**ependency Inversion: dependa de abstrações',
      codeExample: '# SRP: Classe que so calcula impostos\nclass CalculadoraImposto:\n    def calcular(self, receita, aliquota):\n        return receita * aliquota\n\n# NAO fazer: classe que calcula e imprime e salva' },
    { id: 's2', type: 'explanation', content: 'Em Python, **composição normalmente é mais flexível do que criar hierarquias extensas de herança**. Prefira "tem um" sobre "é um" quando houver dúvida.',
      codeExample: '# EVITAR: hierarquia profunda\n# class Ativo -> class RendaFixa -> class Titulo -> class CDB\n\n# PREFERIR: composicao\nclass CDB:\n    def __init__(self):\n        self.ativo = Ativo(...)\n        self.tipo = \"Renda Fixa\"' },
    { id: 's3', type: 'quiz', question: 'O que o princípio SRP recomenda?',
      options: ['Uma classe por arquivo', 'Cada classe tem uma única responsabilidade', 'Classes pequenas', 'Herança simples'], answer: 1,
      explanation: 'SRP: Single Responsibility Principle — cada classe deve ter apenas um motivo para mudar.' },
    { id: 's4', type: 'explanation', content: 'Use type hints e docstrings para documentar suas classes. Python não exige, mas melhora muito a legibilidade.',
      codeExample: 'class Calculadora:\n    \"\"\"Calcula métricas financeiras.\"\"\"\n\n    def margem(self, lucro: float, receita: float) -> float:\n        \"\"\"Retorna a margem de lucro em %.\"\"\"\n        return (lucro / receita) * 100' },
  ],
};
