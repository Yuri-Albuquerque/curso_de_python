import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-modulos-pacotes', trackId: 'intermediario',
  title: 'Módulos e pacotes', description: 'Organizando código em arquivos e diretórios.',
  difficulty: 2, xp: 15, estimatedMinutes: 7, prerequisites: ['int-excecoes'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Um **módulo** é um arquivo .py. Um **pacote** é um diretório com `__init__.py`. Use `import` para trazer código de outros arquivos.',
      codeExample: '# Arquivo: financas.py\n# def calcular_juros(...): ...\n\n# Em outro arquivo:\nimport financas\nfinancas.calcular_juros(1000, 0.05, 3)\n\n# Ou importar específico:\nfrom financas import calcular_juros\ncalcular_juros(1000, 0.05, 3)' },
    { id: 's2', type: 'explanation', content: '`from modulo import *` importa tudo (não recomendado). Use aliases: `import numpy as np`.',
      codeExample: 'import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt' },
    { id: 's3', type: 'quiz', question: 'O que um pacote Python precisa ter?',
      options: ['Um arquivo setup.py', 'Um arquivo __init__.py', 'Um arquivo README.md', 'Nada especial'], answer: 1,
      explanation: 'Um diretório com __init__.py é tratado como pacote em Python.' },
  ],
};
