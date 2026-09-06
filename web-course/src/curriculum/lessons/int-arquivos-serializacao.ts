import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-arquivos-serializacao', trackId: 'intermediario',
  title: 'Arquivos e serialização', description: 'Ler, escrever e serializar dados.',
  difficulty: 2, xp: 15, estimatedMinutes: 8, prerequisites: ['int-testes'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Leia/escreva arquivos com `open()`. Use `with` para garantir que o arquivo seja fechado.',
      codeExample: "# Escrever\nwith open('dados.txt', 'w') as f:\n    f.write('PIB,Inflacao\\n')\n    f.write('10000,0.045\\n')\n\n# Ler\nwith open('dados.txt', 'r') as f:\n    conteudo = f.read()\n    print(conteudo)" },
    { id: 's2', type: 'explanation', content: '**JSON** é o formato mais comum para dados estruturados. Use o módulo `json`.',
      codeExample: 'import json\n\ndados = {\'ticker\': \'PETR4\', \'preco\': 28.5}\n\n# Salvar\nwith open(\'dados.json\', \'w\') as f:\n    json.dump(dados, f)\n\n# Carregar\nwith open(\'dados.json\', \'r\') as f:\n    dados = json.load(f)' },
    { id: 's3', type: 'quiz', question: 'Qual formato é mais comum para serializar dados estruturados em Python?',
      options: ['CSV', 'Pickle', 'JSON', 'XML'], answer: 2,
      explanation: 'JSON é legível, universal e seguro. Pickle é Python-specific e tem riscos de segurança.' },
  ],
};
