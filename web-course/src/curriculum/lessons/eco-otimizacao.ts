import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-otimizacao', trackId: 'economia',
  title: 'Otimização', description: 'Maximização/minimização com scipy.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['eco-econometria'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Otimização** encontra o melhor valor de uma função. Em economia: maximizar lucro, minimizar custo, otimizar portfólio.',
      codeExample: 'from scipy.optimize import minimize\n\n# Minimizar funcao custo\ndef custo(x):\n    return x[0]**2 + 2*x[1]**2 + x[0]*x[1]\n\nresultado = minimize(custo, [0, 0])\nprint(resultado.x)  # ponto otimo' },
    { id: 's2', type: 'explanation', content: 'Para otimização de portfólio (Markowitz), minimize a variância sujeito a retorno alvo.',
      codeExample: 'from scipy.optimize import minimize\nimport numpy as np\n\n# Matriz de covariancia\ncov = np.array([[0.04, 0.01], [0.01, 0.09]])\n\ndef variancia(w):\n    return w @ cov @ w\n\n# Minimizar variancia com w1 + w2 = 1\nconstraints = {\'type\': \'eq\', \'fun\': lambda w: w[0] + w[1] - 1}' },
    { id: 's3', type: 'quiz', question: 'O que scipy.optimize.minimize faz?',
      options: ['Encontra o valor mínimo de uma função', 'Remove o menor valor', 'Acelera a função', 'Calcula derivadas'], answer: 0,
      explanation: 'minimize encontra o ponto onde a função tem seu menor valor.' },
  ],
};
