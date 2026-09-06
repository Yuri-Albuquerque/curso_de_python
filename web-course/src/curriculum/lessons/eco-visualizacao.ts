import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-visualizacao', trackId: 'economia',
  title: 'Visualização', description: 'Gráficos com matplotlib e seaborn.',
  difficulty: 2, xp: 15, estimatedMinutes: 8, prerequisites: ['eco-pandas'],
  steps: [
    { id: 's1', type: 'explanation', content: '**matplotlib** é a biblioteca base de gráficos. **seaborn** adiciona gráficos estatísticos com melhor estética.',
      codeExample: 'import matplotlib.pyplot as plt\n\nanos = [2020, 2021, 2022, 2023, 2024]\npib = [10000, 10500, 11000, 11500, 12000]\n\nplt.plot(anos, pib, marker=\'o\')\nplt.title(\'PIB do Brasil\')\nplt.xlabel(\'Ano\')\nplt.ylabel(\'PIB (R$ bi)\')\nplt.show()' },
    { id: 's2', type: 'explanation', content: 'Tipos comuns: `plt.plot` (linha), `plt.bar` (barras), `plt.scatter` (dispersão), `plt.hist` (histograma).',
      codeExample: 'plt.bar([\'A\', \'B\', \'C\'], [10, 20, 15])\nplt.title(\'Vendas por Categoria\')' },
    { id: 's3', type: 'quiz', question: 'Qual função cria um gráfico de linha?',
      options: ['plt.line()', 'plt.plot()', 'plt.bar()', 'plt.scatter()'], answer: 1,
      explanation: 'plt.plot() cria gráficos de linha.' },
  ],
};
