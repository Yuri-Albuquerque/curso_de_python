import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-excecoes', trackId: 'intermediario',
  title: 'Tratamento de exceções', description: 'try, except, finally e raise.',
  difficulty: 2, xp: 20, estimatedMinutes: 10, prerequisites: ['int-context-managers'],
  steps: [
    { id: 's1', type: 'explanation', content: '**try/except** captura e trata erros. **finally** sempre executa. **raise** lança exceções.',
      codeExample: 'try:\n    preco = float(input(\'Preço: \'))\n    total = 100 / preco\nexcept ValueError:\n    print(\'Valor inválido!\')\nexcept ZeroDivisionError:\n    print(\'Preço não pode ser zero!\')\nfinally:\n    print(\'Operação concluída\')' },
    { id: 's2', type: 'explanation', content: 'Exceções comuns: `ValueError`, `TypeError`, `ZeroDivisionError`, `KeyError`, `IndexError`, `FileNotFoundError`. Crie suas com `class MeuErro(Exception)`.',
      codeExample: 'class SaldoInsuficiente(Exception):\n    pass\n\ndef sacar(saldo, valor):\n    if valor > saldo:\n        raise SaldoInsuficiente(\"Saldo insuficiente\")\n    return saldo - valor' },
    { id: 's3', type: 'predict-output', prompt: 'O que imprime?', code: 'try:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print(\'Erro\')\nfinally:\n    print(\'Fim\')', expectedOutput: 'Erro\nFim', hint: 'O except captura o erro e finally sempre executa.' },
    { id: 's4', type: 'quiz', question: 'O que finally faz?',
      options: ['Executa apenas se houver erro', 'Executa apenas se não houver erro', 'Sempre executa, com ou sem erro', 'Encerra o programa'], answer: 2,
      explanation: 'finally sempre executa, independentemente de exceções.' },
    { id: 's5', type: 'code', prompt: 'Use try/except para converter string em float, retornando 0.0 se falhar.',
      starterCode: 'def converter(valor_str):\n    \n',
      tests: [{ expression: "converter('abc')", expected: 0.0 }, { expression: "converter('3.14')", expected: 3.14 }],
      hint: 'try: return float(valor_str); except ValueError: return 0.0' },
  ],
};
