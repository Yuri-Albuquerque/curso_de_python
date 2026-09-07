import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-engenharia-economica', trackId: 'economia',
  title: 'Engenharia econômica', description: 'VPL, TIR e amortização.',
  difficulty: 3, xp: 25, estimatedMinutes: 12, prerequisites: ['eco-indicadores'],
  steps: [
    { id: 's1', type: 'explanation', content: '**VPL (Valor Presente Líquido)**: traz todos os fluxos de caixa para o valor presente. VPL > 0 indica investimento viável.',
      codeExample: 'def vpl(fluxos, taxa):\n    return sum(f / (1 + taxa) ** t for t, f in enumerate(fluxos))\n\n# Investimento: -1000, retornos: 300, 400, 500\nvpl([-1000, 300, 400, 500], 0.10)  # -1000 + 272.73 + 330.58 + 375.66 = -21.04' },
    { id: 's2', type: 'explanation', content: '**TIR (Taxa Interna de Retorno)**: taxa que zera o VPL. Se TIR > custo de capital, invista.',
      codeExample: 'def vpl(fluxos, taxa):\n    return sum(f / (1 + taxa) ** t for t, f in enumerate(fluxos))\n\n# TIR por bisseccao: a taxa que zera o VPL\ndef tir(fluxos, lo=-0.99, hi=10.0):\n    for _ in range(200):\n        meio = (lo + hi) / 2\n        if vpl(fluxos, meio) > 0:\n            lo = meio\n        else:\n            hi = meio\n    return (lo + hi) / 2\n\nfluxos = [-1000, 300, 400, 500]\ntir(fluxos)  # 0.0890 -> 8,90% ao ano\n\n# Atencao: np.irr foi REMOVIDO do NumPy (1.20). Hoje existe em\n# numpy-financial (npf.irr), pacote que nao vem no navegador.' },
    { id: 's3', type: 'quiz', question: 'O que VPL > 0 indica?',
      options: ['Investimento inviável', 'Investimento viável (gera valor)', 'Taxa de juros alta', 'Prejuízo'], answer: 1,
      explanation: 'VPL positivo significa que o projeto gera valor acima do custo de capital.' },
    { id: 's4', type: 'code', prompt: 'Calcule o VPL de um investimento: -5000 inicial, retornos 2000/ano por 3 anos, taxa 8%.',
      starterCode: 'def vpl(fluxos, taxa):\n    return sum(f / (1 + taxa) ** t for t, f in enumerate(fluxos))\n\nresultado = ',
      tests: [{ expression: 'round(resultado, 2)', expected: 154.19 }],
      hint: 'vpl([-5000, 2000, 2000, 2000], 0.08)' },
  ],
};
