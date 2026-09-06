import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-econometria', trackId: 'economia',
  title: 'Econometria', description: 'Regressão linear e inferência estatística.',
  difficulty: 3, xp: 25, estimatedMinutes: 12, prerequisites: ['eco-engenharia-economica'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Regressão linear** estima a relação entre variáveis. Mínimos quadrados ordinários (MQO) minimiza a soma dos resíduos ao quadrado.',
      codeExample: 'import numpy as np\n\n# Dados: consumo vs renda\nrenda = np.array([1000, 2000, 3000, 4000, 5000])\nconsumo = np.array([800, 1500, 2200, 2900, 3600])\n\n# Regressao linear (y = a + b*x)\ncoef = np.polyfit(renda, consumo, 1)\n# coef = [0.71, 70] -> consumo = 70 + 0.71 * renda' },
    { id: 's2', type: 'explanation', content: 'Use **statsmodels** para regressão com testes estatísticos completos (p-valores, R², intervalos de confiança).',
      codeExample: 'import statsmodels.api as sm\n\nX = sm.add_constant(renda)  # intercepto\nmodelo = sm.OLS(consumo, X).fit()\nprint(modelo.summary())' },
    { id: 's3', type: 'quiz', question: 'O que o R² mede?',
      options: ['A precisão dos coeficientes', 'A proporção da variância explicada pelo modelo', 'O número de variáveis', 'A significância estatística'], answer: 1,
      explanation: 'R² indica quanto da variância da variável dependente é explicada pelo modelo.' },
  ],
};
