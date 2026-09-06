import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-protocolos-polimorfismo', trackId: 'classes',
  title: 'Protocolos e polimorfismo', description: 'Duck typing e polimorfismo.',
  difficulty: 3, xp: 15, estimatedMinutes: 7, prerequisites: ['cls-composicao'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Duck typing**: "Se anda como um pato e grasna como um pato, é um pato". Python não verifica o tipo — verifica se o objeto tem os métodos necessários.',
      codeExample: 'def calcular_valor(item):\n    return item.preco * item.qty  # nao importa o tipo, so precisa ter preco e qty' },
    { id: 's2', type: 'explanation', content: '**Polimorfismo**: diferentes classes podem responder ao mesmo método de forma diferente. Cada classe define seu próprio comportamento.',
      codeExample: 'class Acao:\n    def valor(self):\n        return self.preco * self.qty\n\nclass Titulo:\n    def valor(self):\n        return self.face / (1 + self.taxa) ** self.n\n\n# Polimorfismo: ambas tem .valor()\nfor ativo in [acao, titulo]:\n    print(ativo.valor())' },
    { id: 's3', type: 'quiz', question: 'O que é duck typing?',
      options: ['Verificar o tipo explicitamente', 'Se o objeto tem os métodos necessários, funciona', 'Apenas patos podem usar', 'Type checking em runtime'], answer: 1,
      explanation: 'Duck typing: Python usa o objeto se ele tem os métodos/atributos necessários, sem verificar o tipo.' },
  ],
};
