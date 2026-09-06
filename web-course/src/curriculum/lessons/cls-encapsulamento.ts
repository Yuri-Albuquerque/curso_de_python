import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'cls-encapsulamento', trackId: 'classes',
  title: 'Encapsulamento', description: 'Protegendo atributos com underscore.',
  difficulty: 3, xp: 15, estimatedMinutes: 7, prerequisites: ['cls-metodos'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Python usa **convenção** para encapsulamento: `_atributo` (protegido), `__atributo` (name mangling, mais privado). Não há true private.',
      codeExample: 'class Conta:\n    def __init__(self, titular, saldo):\n        self.titular = titular       # publico\n        self._saldo = saldo          # protegido (convencao)\n        self.__id = 12345            # name mangling' },
    { id: 's2', type: 'explanation', content: 'Acesso a atributos protegidos é **possível** mas desencorajado. Use métodos (getters/setters) para acessar.',
      codeExample: 'class Conta:\n    def __init__(self, saldo):\n        self._saldo = saldo\n    def get_saldo(self):\n        return self._saldo\n    def set_saldo(self, valor):\n        if valor >= 0:\n            self._saldo = valor' },
    { id: 's3', type: 'quiz', question: 'O que _saldo significa em Python?',
      options: ['Totalmente privado', 'Convenção de protegido — acessível mas desencorajado', 'Não existe', 'É constante'], answer: 1,
      explanation: '_saldo é uma convenção: acessível, mas indica que não deveria ser usado externamente.' },
  ],
};
