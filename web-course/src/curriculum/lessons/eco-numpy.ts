import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-numpy', trackId: 'economia',
  title: 'NumPy', description: 'Arrays vetoriais para computação numérica.',
  difficulty: 2, xp: 20, estimatedMinutes: 10, prerequisites: ['int-organizacao-projetos'],
  steps: [
    { id: 's1', type: 'explanation', content: '**NumPy** é a base da computação científica em Python. Arrays NumPy são mais rápidos que listas para operações numéricas.',
      codeExample: 'import numpy as np\n\nprecos = np.array([28.5, 60.0, 32.0])\nquantidades = np.array([100, 50, 200])\n\n# Operacao vetorial\nvalores = precos * quantidades  # [2850. 3000. 6400.]\ntotal = valores.sum()  # 12250.0' },
    { id: 's2', type: 'explanation', content: 'NumPy suporta indexação, fatiamento e operações estatísticas eficientes.',
      codeExample: 'precos = np.array([10, 20, 30, 40, 50])\nprecos.mean()  # 30.0\nprecos.std()   # 14.14\nprecos[1:4]   # array([20, 30, 40])\nprecos[precos > 25]  # array([30, 40, 50])' },
    { id: 's3', type: 'quiz', question: 'Qual a principal vantagem de arrays NumPy sobre listas Python?',
      options: ['Suportam tipos mistos', 'Operações vetoriais mais rápidas', 'Usam menos linhas de código', 'São mais flexíveis'], answer: 1,
      explanation: 'NumPy usa C por baixo, fazendo operações vetoriais muito mais rápidas.' },
  ],
};
