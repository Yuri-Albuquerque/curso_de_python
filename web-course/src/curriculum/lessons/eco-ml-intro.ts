import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-ml-intro', trackId: 'economia',
  title: 'Introdução a Machine Learning', description: 'scikit-learn para previsão.',
  difficulty: 3, xp: 25, estimatedMinutes: 12, prerequisites: ['eco-series-temporais'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Machine Learning** permite que computadores aprendam padrões dos dados. **scikit-learn** é a biblioteca principal para ML em Python.',
      codeExample: 'from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodelo = LinearRegression()\nmodelo.fit(X_train, y_train)\nprevisao = modelo.predict(X_test)\nacuracia = modelo.score(X_test, y_test)' },
    { id: 's2', type: 'explanation', content: 'Tipos: **supervisionado** (regressão, classificação), **não supervisionado** (clustering, PCA). Para economia: prever preços, classificar risco, segmentar clientes.',
      codeExample: 'from sklearn.ensemble import RandomForestRegressor\n\nmodelo = RandomForestRegressor(n_estimators=100)\nmodelo.fit(X_train, y_train)\nimportancias = modelo.feature_importances_' },
    { id: 's3', type: 'quiz', question: 'Qual a diferença entre aprendizado supervisionado e não supervisionado?',
      options: ['Supervisionado usa dados rotulados, não supervisionado não', 'Supervisionado é mais lento', 'Não supervisionado é mais preciso', 'Não há diferença'], answer: 0,
      explanation: 'Supervisionado: dados com rótulos (y). Não supervisionado: sem rótulos, encontra padrões.' },
    { id: 's4', type: 'explanation', content: 'Parabéns! Você completou todas as 7 trilhas do curso. Agora você domina Python desde os fundamentos até aplicações em economia!',
      codeExample: '# Proximos passos:\n# 1. Pratique com dados reais (BCB, IBGE, Yahoo Finance)\n# 2. Construa projetos completos\n# 3. Contribua para projetos open source\n# 4. Continue aprendendo!' },
  ],
};
