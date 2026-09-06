import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-decoradores', trackId: 'funcoes',
  title: 'Decoradores', description: 'Modificando funções com @decorator.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['func-funcoes-ordem-superior'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Decoradores** são funções que envolvem outras funções para adicionar comportamento. Use `@nome` acima da função.',
      codeExample: 'def cronometro(f):\n    def wrapper(*args, **kwargs):\n        print(\"Iniciando...\")\n        resultado = f(*args, **kwargs)\n        print(\"Concluído!\")\n        return resultado\n    return wrapper\n\n@cronometro\ndef calcular(x):\n    return x * 2' },
    { id: 's2', type: 'explanation', content: 'Decoradores comuns: `@property` (getters), `@staticmethod`, `@classmethod`, `@dataclass`. Bibliotecas como Flask e Django usam decoradores extensivamente.',
      codeExample: 'from dataclasses import dataclass\n\n@dataclass\nclass Produto:\n    nome: str\n    preco: float' },
    { id: 's3', type: 'quiz', question: 'O que @decorator faz?',
      options: ['Renomeia a função', 'Passa a função como argumento para decorator', 'Importa a função', 'Copia a função'], answer: 1,
      explanation: '@decorator é açúcar sintático para: func = decorator(func)' },
    { id: 's4', type: 'explanation', content: 'Você pode encadear múltiplos decoradores: `@a` `@b` `def f()` é equivalente a `f = a(b(f))`.',
      codeExample: '@upper_case\n@strip_spaces\ndef texto():\n    return \"  olá  \"' },
  ],
};
