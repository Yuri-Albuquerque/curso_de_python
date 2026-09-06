import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-argumentos-nomeados', trackId: 'funcoes',
  title: 'Argumentos nomeados', description: 'Chamadas explícitas com keyword arguments.',
  difficulty: 2, xp: 15, estimatedMinutes: 5, prerequisites: ['func-valores-padrao'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Argumentos nomeados deixam explícito o papel de cada valor, melhorando legibilidade e evitando erros.',
      codeExample: 'def valor_futuro(capital, taxa, periodos):\n    return capital * (1 + taxa) ** periodos\n\n# Menos legivel\nvalor_futuro(1000, 0.1, 2)\n\n# Mais legivel\nvalor_futuro(capital=1000, taxa=0.1, periodos=2)' },
    { id: 's2', type: 'quiz', question: 'Qual chamada é mais legível?',
      options: ['valor_futuro(1000, 0.1, 2)', 'valor_futuro(capital=1000, taxa=0.1, periodos=2)', 'Ambas são iguais', 'Nenhuma'], answer: 1,
      explanation: 'Argumentos nomeados deixam explícito o que cada valor significa.' },
    { id: 's3', type: 'code', prompt: 'Chame a função valor_futuro com argumentos nomeados.',
      starterCode: 'def valor_futuro(capital, taxa, periodos):\n    return capital * (1 + taxa) ** periodos\n\nresultado = ',
      tests: [{ expression: 'resultado', expected: 1210 }],
      hint: 'valor_futuro(capital=1000, taxa=0.1, periodos=2)' },
  ],
};
