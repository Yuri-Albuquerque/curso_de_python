import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-definicao-chamada', trackId: 'funcoes',
  title: 'Definição e chamada', description: 'Criando e usando funções.',
  difficulty: 2, xp: 15, estimatedMinutes: 7, prerequisites: ['dados-iteracao-desempacotamento'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Funções são blocos de código reutilizáveis. Use `def nome(parâmetros):` para definir e `nome(args)` para chamar.',
      codeExample: "def calcular_receita(preco, quantidade):\n    return preco * quantidade\n\nreceita = calcular_receita(25.90, 80)\nprint(receita)  # 2072.0" },
    { id: 's2', type: 'explanation', content: 'Funções sem `return` retornam `None`. Funções podem retornar qualquer tipo de valor.',
      codeExample: 'def saudar(nome):\n    print(f\"Ola, {nome}\")\n\nresultado = saudar(\"Yuri\")  # imprime, retorna None' },
    { id: 's3', type: 'predict-output', prompt: 'O que retorna?', code: 'def f(x):\n    return x * 2\nf(5)', expectedOutput: '10', hint: '5 * 2 = 10' },
    { id: 's4', type: 'code', prompt: 'Defina uma função media que recebe dois números e retorna a média.',
      starterCode: 'def media(a, b):\n    ', tests: [{ expression: 'media(10, 20)', expected: 15.0 }], hint: 'return (a + b) / 2' },
    { id: 's5', type: 'quiz', question: 'O que uma função sem return retorna?',
      options: ['Erro', '0', 'None', 'Empty string'], answer: 2, explanation: 'Toda função retorna algo; sem return, retorna None.' },
  ],
};
