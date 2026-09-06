import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'func-valores-padrao', trackId: 'funcoes',
  title: 'Valores padrão', description: 'Parâmetros com valores default.',
  difficulty: 2, xp: 15, estimatedMinutes: 6, prerequisites: ['func-parametros-argumentos'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Parâmetros podem ter **valores padrão**. Se o argumento for omitido, o default é usado.',
      codeExample: 'def valor_futuro(capital, taxa=0.05, periodos=1):\n    return capital * (1 + taxa) ** periodos\n\nvalor_futuro(1000)           # 1050.0 (usa defaults)\nvalor_futuro(1000, 0.10)     # 1100.0\nvalor_futuro(1000, 0.10, 2)  # 1210.0' },
    { id: 's2', type: 'explanation', content: 'Parâmetros com default devem vir **depois** dos parâmetros sem default.',
      codeExample: '# Correto\ndef f(a, b, c=10): ...\n\n# Erro!\n# def f(a, c=10, b): ...  # SyntaxError' },
    { id: 's3', type: 'predict-output', prompt: 'O que retorna?', code: 'def f(x, y=10):\n    return x + y\nf(5)', expectedOutput: '15', hint: 'y usa o default 10.' },
    { id: 's4', type: 'fill-blank', prompt: 'Complete a função com taxa padrão de 5%.',
      codeTemplate: 'def calcular_juros(capital, taxa___):\n    return capital * taxa', blanks: ['=0.05'], hint: 'Use =0.05 após o parâmetro.' },
    { id: 's5', type: 'code', prompt: 'Defina uma função com parametro default: def margem(lucro, receita=1000): retorna lucro/receita * 100.',
      starterCode: 'def margem(lucro, receita=1000):\n    ', tests: [{ expression: 'margem(200)', expected: 20.0 }, { expression: 'margem(200, 2000)', expected: 10.0 }], hint: 'return lucro / receita * 100' },
  ],
};
