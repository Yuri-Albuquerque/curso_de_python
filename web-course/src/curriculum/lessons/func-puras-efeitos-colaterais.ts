import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-puras-efeitos-colaterais', trackId: 'funcoes',
  title: 'Funções puras e efeitos colaterais', description: 'Transparência referencial e imutabilidade.',
  difficulty: 3, xp: 15, estimatedMinutes: 7, prerequisites: ['func-recursao'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Função pura**: mesmo input sempre produz mesmo output, sem efeitos colaterais. Mais fáceis de testar e raciocinar.',
      codeExample: '# Pura\ndef descontar(preco, taxa):\n    return preco * (1 - taxa)\n\n# Impura (modifica estado global)\nsaldo = 1000\ndef sacar(valor):\n    global saldo\n    saldo -= valor' },
    { id: 's2', type: 'explanation', content: '**Efeito colateral**: qualquer modificação observable fora da função — alterar variáveis globais, modificar argumentos mutáveis, I/O.',
      codeExample: 'def adicionar_item(lista, item):\n    lista.append(item)  # efeito colateral!\n    return lista\n\n# Melhor: retornar nova lista\ndef adicionar_item_puro(lista, item):\n    return lista + [item]' },
    { id: 's3', type: 'quiz', question: 'Qual função é pura?',
      options: ['def f(x): print(x); return x', 'def f(x): return x * 2', 'def f(x): global y; y = x', 'def f(lst): lst.append(1)'],
      answer: 1, explanation: 'return x * 2 não tem efeitos colaterais e sempre retorna o mesmo resultado.' },
    { id: 's4', type: 'code', prompt: 'Escreva uma versão pura de adicionar_item que não modifica a lista original.',
      starterCode: 'def adicionar_item(lista, item):\n    ',
      tests: [],
      hint: 'return lista + [item] (cria nova lista)' },
  ],
};
