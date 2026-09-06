import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-series-temporais', trackId: 'economia',
  title: 'Séries temporais', description: 'ARIMA, decomposição e previsão.',
  difficulty: 3, xp: 25, estimatedMinutes: 12, prerequisites: ['eco-otimizacao'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Séries temporais são dados ordenados no tempo. Ferramentas: decomposição (tendência + sazonalidade + resíduo), ARIMA, suavização exponencial.',
      codeExample: 'import pandas as pd\n\n# Decomposicao\nfrom statsmodels.tsa.seasonal import seasonal_decompose\n\n# serie = pd.Series(...) com indice temporal\nresultado = seasonal_decompose(serie, model=\'additive\', period=12)\nresultado.plot()' },
    { id: 's2', type: 'explanation', content: '**ARIMA(p, d, q)**: p = AR (autorregressivo), d = diferenciação, q = MA (média móvel). Use `auto_arima` para encontrar os melhores parâmetros.',
      codeExample: 'from statsmodels.tsa.arima.model import ARIMA\n\nmodelo = ARIMA(serie, order=(1, 1, 1))\nresultado = modelo.fit()\nprevisao = resultado.forecast(steps=12)  # 12 periodos' },
    { id: 's3', type: 'quiz', question: 'O que o parâmetro d em ARIMA(p,d,q) representa?',
      options: ['Número de termos AR', 'Ordem de diferenciação', 'Tamanho da janela', 'Número de previsões'], answer: 1,
      explanation: 'd é o número de vezes que a série é diferenciada para torná-la estacionária.' },
  ],
};
