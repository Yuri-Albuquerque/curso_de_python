import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-escopo-closures', trackId: 'funcoes',
  title: 'Escopo e closures', description: 'Regras de acesso a variáveis.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['func-args-kwargs'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Escopo** determina onde uma variável é acessível. Python usa a regra LEGB: Local → Enclosing → Global → Built-in.',
      codeExample: 'x = 10  # global\ndef f():\n    x = 20  # local\n    print(x)\n\nf()       # 20\nprint(x)  # 10 (global não mudou)' },
    { id: 's2', type: 'explanation', content: 'Use `global` para modificar uma variável global dentro de uma função. Use `nonlocal` para modificar variável de função externa.',
      codeExample: 'contador = 0\ndef incrementar():\n    global contador\n    contador += 1' },
    { id: 's3', type: 'explanation', content: '**Closure**: função interna que lembra variáveis da função externa, mesmo após a externa terminar.',
      codeExample: 'def multiplicador(fator):\n    def interna(x):\n        return x * fator  # lembra fator\n    return interna\n\ndobrar = multiplicador(2)\ntriplicar = multiplicador(3)\ndobrar(5)    # 10\ntriplicar(5) # 15' },
    { id: 's4', type: 'predict-output', prompt: 'O que imprime?', code: 'def f():\n    x = 10\n    def g():\n        return x\n    return g()\nprint(f())', expectedOutput: '10', hint: 'g() acessa x do escopo externo.' },
    { id: 's5', type: 'quiz', question: 'O que a regra LEGB descreve?',
      options: ['Ordem de importação', 'Ordem de resolução de nomes', 'Ordem de execução', 'Ordem de herança'], answer: 1,
      explanation: 'LEGB descreve a ordem em que Python busca nomes: Local, Enclosing, Global, Built-in.' },
    { id: 's6', type: 'code', prompt: 'Crie uma closure que retorna uma função para aplicar desconto.',
      starterCode: 'def criar_desconto(taxa):\n    def aplicar(preco):\n        \n    return aplicar\n\ndesconto10 = criar_desconto(0.10)',
      tests: [{ expression: 'desconto10(100)', expected: 90.0 }],
      hint: 'return preco * (1 - taxa)' },
  ],
};
