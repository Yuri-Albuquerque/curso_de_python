import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-indicadores', trackId: 'economia',
  title: 'Indicadores econômicos', description: 'Calculando PIB, inflação, desemprego.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['eco-series-economicas'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Indicadores econômicos são métricas que medem a saúde da economia: PIB, IPCA, taxa de desemprego, balança comercial.',
      codeExample: 'import pandas as pd\nimport numpy as np\n\n# Variação do PIB (taxa de crescimento)\npib = pd.Series([10000, 10500, 11000, 11500, 12000])\ncrescimento = pib.pct_change() * 100\n# [NaN, 5.0, 4.76, 4.55, 4.35]' },
    { id: 's2', type: 'explanation', content: '**Inflação**: variação percentual do índice de preços. IPCA no Brasil é o índice oficial.',
      codeExample: '# IPCA acumulado\nipca_mensal = pd.Series([0.42, 0.33, 0.56, 0.38])\nipca_acumulado = ((1 + ipca_mensal / 100).prod() - 1) * 100\n# Acumulado no período' },
    { id: 's3', type: 'code', prompt: 'Calcule a taxa de crescimento do PIB entre ano1 e ano2.',
      starterCode: 'pib_2023 = 10000\npib_2024 = 10500\ncrescimento = ',
      tests: [{ expression: 'crescimento', expected: 5.0 }],
      hint: '(pib_2024 / pib_2023 - 1) * 100' },
  ],
};
