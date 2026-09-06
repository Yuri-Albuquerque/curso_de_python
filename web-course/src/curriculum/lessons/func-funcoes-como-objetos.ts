import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-funcoes-como-objetos', trackId: 'funcoes',
  title: 'Funções como objetos', description: 'Funções são objetos de primeira classe.',
  difficulty: 3, xp: 15, estimatedMinutes: 7, prerequisites: ['func-escopo-closures'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Em Python, funções são **objetos de primeira classe**: podem ser atribuídas a variáveis, passadas como argumento, retornadas de funções.',
      codeExample: 'f = len\nf([1, 2, 3])  # 3\n\nfuncs = [len, sum, max]\n[f([1, 2, 3]) for f in funcs]  # [3, 6, 3]' },
    { id: 's2', type: 'explanation', content: 'Passar funções como argumento permite **estratégias** — padrão comum em economia e finanças.',
      codeExample: 'def aplicar(valor, operacao):\n    return operacao(valor)\n\naplicar(100, lambda x: x * 1.1)  # 110.0\naplicar(100, lambda x: x - 10)  # 90' },
    { id: 's3', type: 'quiz', question: 'O que significa "funções são objetos de primeira classe"?',
      options: ['São rápidas', 'Podem ser passadas, retornadas e atribuídas', 'Sempre retornam objetos', 'São classes'], answer: 1,
      explanation: 'Objetos de primeira classe podem ser manipulados como qualquer valor.' },
    { id: 's4', type: 'code', prompt: 'Atribua a função abs a uma variável e use-a.',
      starterCode: 'valor_abs = \nresultado = valor_abs(-42)',
      tests: [{ expression: 'resultado', expected: 42 }],
      hint: 'valor_abs = abs' },
  ],
};
