import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-engenharia-economica', trackId: 'economia',
  title: 'Engenharia econômica', description: 'VPL, TIR e amortização.',
  difficulty: 3, xp: 25, estimatedMinutes: 12, prerequisites: ['eco-indicadores'],
  steps: [
    { id: 's1', type: 'explanation', content: '**VPL (Valor Presente Líquido)**: traz todos os fluxos de caixa para o valor presente. VPL > 0 indica investimento viável.',
      codeExample: 'def vpl(fluxos, taxa):\n    return sum(f / (1 + taxa) ** t for t, f in enumerate(fluxos))\n\n# Investimento: -1000, retornos: 300, 400, 500\nvpl([-1000, 300, 400, 500], 0.10)  # -1000 + 272.73 + 330.58 + 375.66 = -21.03' },
    { id: 's2', type: 'explanation', content: '**TIR (Taxa Interna de Retorno)**: taxa que zera o VPL. Se TIR > custo de capital, invista.',
      codeExample: 'import numpy as np\n\n# TIR via numpy\nfluxos = [-1000, 300, 400, 500]\ntir = np.irr(fluxos)  # ou numpy_financial.irr(fluxos)' },
    { id: 's3', type: 'quiz', question: 'O que VPL > 0 indica?',
      options: ['Investimento inviável', 'Investimento viável (gera valor)', 'Taxa de juros alta', 'Prejuízo'], answer: 1,
      explanation: 'VPL positivo significa que o projeto gera valor acima do custo de capital.' },
    { id: 's4', type: 'code', prompt: 'Calcule o VPL de um investimento: -5000 inicial, retornos 2000/ano por 3 anos, taxa 8%.',
      starterCode: 'def vpl(fluxos, taxa):\n    return sum(f / (1 + taxa) ** t for t, f in enumerate(fluxos))\n\nresultado = ',
      tests: [{ expression: 'round(resultado, 2)', expected: 153.29 }],
      hint: 'vpl([-5000, 2000, 2000, 2000], 0.08)' },
  ],
};
