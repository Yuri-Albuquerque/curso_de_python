import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-pandas', trackId: 'economia',
  title: 'pandas', description: 'DataFrames para análise de dados.',
  difficulty: 2, xp: 20, estimatedMinutes: 10, prerequisites: ['eco-numpy'],
  steps: [
    { id: 's1', type: 'explanation', content: '**pandas** é a ferramenta principal para análise de dados em Python. `DataFrame` é uma tabela (como uma planilha).',
      codeExample: 'import pandas as pd\n\ndados = {\n    \'ticker\': [\'PETR4\', \'VALE3\', \'ITUB4\'],\n    \'preco\': [28.5, 60.0, 32.0],\n    \'qty\': [100, 50, 200]\n}\ndf = pd.DataFrame(dados)\ndf[\'valor\'] = df[\'preco\'] * df[\'qty\']\nprint(df)' },
    { id: 's2', type: 'explanation', content: 'pandas pode ler CSV, Excel, JSON e bases de dados diretamente.',
      codeExample: "# Ler CSV\ndf = pd.read_csv('pib_brasil.csv')\n\n# Filtrar\ndf_2024 = df[df['ano'] == 2024]\n\n# Agrupar e somar\ndf.groupby('setor')['valor'].sum()" },
    { id: 's3', type: 'quiz', question: 'O que um DataFrame pandas representa?',
      options: ['Um array 1D', 'Uma tabela de dados (linhas e colunas)', 'Um dicionário', 'Um gráfico'], answer: 1,
      explanation: 'DataFrame é uma estrutura tabular bidimensional, como uma planilha.' },
  ],
};
