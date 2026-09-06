import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-organizacao-projetos', trackId: 'intermediario',
  title: 'Organização de projetos', description: 'Estrutura, venv, requirements e boas práticas.',
  difficulty: 2, xp: 15, estimatedMinutes: 8, prerequisites: ['int-performance-memoria'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Estrutura típica de um projeto Python: `src/` para código, `tests/` para testes, `requirements.txt` ou `pyproject.toml` para dependências, `README.md`.',
      codeExample: 'projeto/\n├── src/\n│   ├── __init__.py\n│   ├── financas.py\n│   └── dados.py\n├── tests/\n│   ├── test_financas.py\n│   └── test_dados.py\n├── requirements.txt\n├── pyproject.toml\n└── README.md' },
    { id: 's2', type: 'explanation', content: '**Ambientes virtuais** isolam dependências por projeto. Use `venv` (built-in) ou `conda`.',
      codeExample: '# Criar venv\npython -m venv .venv\n\n# Ativar (macOS/Linux)\nsource .venv/bin/activate\n\n# Instalar dependencias\npip install -r requirements.txt' },
    { id: 's3', type: 'quiz', question: 'Por que usar ambientes virtuais?',
      options: ['É mais rápido', 'Isola dependências por projeto, evitando conflitos', 'É obrigatório', 'Substitui o pip'], answer: 1,
      explanation: 'venv isola as bibliotecas de cada projeto, evitando conflitos de versão.' },
  ],
};
