import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-context-managers', trackId: 'intermediario',
  title: 'Context managers', description: 'Gerenciando recursos com with.',
  difficulty: 3, xp: 15, estimatedMinutes: 7, prerequisites: ['int-iteradores-geradores'],
  steps: [
    { id: 's1', type: 'explanation', content: 'O statement `with` garante que recursos sejam liberados, mesmo com erros. Arquivos, conexões de banco, locks usam context managers.',
      codeExample: '# Sem with\narquivo = open(\'dados.csv\', \'r\')\ntry:\n    conteudo = arquivo.read()\nfinally:\n    arquivo.close()\n\n# Com with (automatico)\nwith open(\'dados.csv\', \'r\') as arquivo:\n    conteudo = arquivo.read()\n# arquivo fechado automaticamente' },
    { id: 's2', type: 'explanation', content: 'Crie seus próprios context managers com a classe ou com `@contextmanager`.',
      codeExample: 'from contextlib import contextmanager\n\n@contextmanager\ndef cronometro():\n    import time\n    inicio = time.time()\n    yield\n    print(f\"Tempo: {time.time() - inicio:.2f}s\")\n\nwith cronometro():\n    sum(range(1000000))' },
    { id: 's3', type: 'quiz', question: 'Qual a vantagem do statement with?',
      options: ['É mais rápido', 'Garante liberação de recursos mesmo com erros', 'É obrigatório', 'Substitui try/except'], answer: 1,
      explanation: 'with garante que __exit__ seja chamado mesmo se ocorrer uma exceção.' },
  ],
};
