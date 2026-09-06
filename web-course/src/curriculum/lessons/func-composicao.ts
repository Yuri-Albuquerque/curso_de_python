import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-composicao', trackId: 'funcoes',
  title: 'Composição de funções', description: 'Combinando funções simples em complexas.',
  difficulty: 3, xp: 20, estimatedMinutes: 8, prerequisites: ['func-puras-efeitos-colaterais'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Composição**: passar a saída de uma função como entrada de outra. É a base da programação funcional.',
      codeExample: 'def calcular_receita(preco, quantidade):\n    return preco * quantidade\n\ndef descontar_custos(receita, custos):\n    return receita - custos\n\nreceita = calcular_receita(120, 50)  # 6000\nlucro = descontar_custos(receita, 3800)  # 2200\n# Composicao: descontar_custos(calcular_receita(120, 50), 3800)' },
    { id: 's2', type: 'explanation', content: 'Você pode criar uma função `compor` que combina duas funções em uma nova.',
      codeExample: 'def compor(f, g):\n    return lambda x: f(g(x))\n\n# Aplicar desconto depois de calcular receita\ndef aplicar_desconto(receita):\n    return receita * 0.9\n\nreceita_com_desconto = compor(aplicar_desconto, calcular_receita)' },
    { id: 's3', type: 'predict-output', prompt: 'O que retorna?', code: 'def f(x):\n    return x + 1\ndef g(x):\n    return x * 2\nf(g(5))', expectedOutput: '11', hint: 'g(5)=10, f(10)=11' },
    { id: 's4', type: 'quiz', question: 'O que é composição de funções?',
      options: ['Juntar duas funções em uma classe', 'Passar a saída de uma como entrada da outra', 'Chamar duas funções ao mesmo tempo', 'Sobrescrever uma função'], answer: 1,
      explanation: 'Composição encadeia funções: f(g(x)).' },
    { id: 's5', type: 'code', prompt: 'Componha: calcule a receita (preco * qty) e depois aplique 10% de desconto.',
      starterCode: 'def receita(p, q):\n    return p * q\n\ndef desconto(r):\n    return r * 0.9\n\nresultado = ',
      tests: [{ expression: 'resultado', expected: 4320.0 }],
      hint: 'desconto(receita(120, 40))' },
  ],
};
