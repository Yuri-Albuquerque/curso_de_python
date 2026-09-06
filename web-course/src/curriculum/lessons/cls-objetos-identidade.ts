import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-objetos-identidade', trackId: 'classes',
  title: 'Objetos e identidade', description: 'Tudo é objeto em Python.',
  difficulty: 2, xp: 15, estimatedMinutes: 7, prerequisites: ['func-composicao'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Em Python, **tudo é objeto** — números, strings, funções, classes. Cada objeto tem identidade (`id()`), tipo (`type()`) e valor.',
      codeExample: 'x = 42\nid(x)     # identificador único\ntype(x)   # <class \'int\'>\nx         # valor' },
    { id: 's2', type: 'explanation', content: '`is` compara **identidade** (mesmo objeto na memória). `==` compara **valor**. Para números pequenos, Python reutiliza objetos.',
      codeExample: 'a = [1, 2]\nb = [1, 2]\nc = a\na == b  # True (mesmo valor)\na is b  # False (objetos diferentes)\na is c  # True (mesmo objeto)' },
    { id: 's3', type: 'quiz', question: 'Qual a diferença entre == e is?',
      options: ['Nenhuma', '== compara valor, is compara identidade', '== é mais rápido', 'is compara valor'], answer: 1,
      explanation: '== compara valores; is compara se são o mesmo objeto na memória.' },
    { id: 's4', type: 'predict-output', prompt: 'O que retorna?', code: 'a = [1,2]\nb = a\nprint(a is b)', expectedOutput: 'True', hint: 'b aponta para o mesmo objeto que a.' },
  ],
};
