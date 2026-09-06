import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-testes', trackId: 'intermediario',
  title: 'Testes automatizados', description: 'unittest e pytest para código confiável.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['int-type-hints'],
  steps: [
    { id: 's1', type: 'explanation', content: 'Testes garantem que seu código funciona como esperado. **pytest** é o framework mais popular. Funções de teste começam com `test_`.',
      codeExample: '# arquivo: test_financas.py\ndef test_calcular_receita():\n    assert calcular_receita(25.0, 80) == 2000.0\n\ndef test_margem():\n    assert margem(200, 1000) == 20.0\n\n# Rodar: pytest test_financas.py' },
    { id: 's2', type: 'explanation', content: 'Use `assert` para verificar condições. pytest mostra exatamente qual assert falhou e por quê.',
      codeExample: 'def test_divisao():\n    assert 10 / 2 == 5.0\n    assert 10 // 3 == 3\n    assert 10 % 3 == 1' },
    { id: 's3', type: 'quiz', question: 'Como nomear uma função de teste em pytest?',
      options: ['TestFunction()', 'test_function()', 'Test()', 'check_function()'], answer: 1,
      explanation: 'pytest reconhece funções que começam com test_.' },
    { id: 's4', type: 'explanation', content: '**TDD (Test-Driven Development)**: escreva o teste antes do código. 1) Escreva teste (falha). 2) Implemente (passa). 3) Refatore.',
      codeExample: '# 1. Teste\ndef test_juros():\n    assert juros_compostos(1000, 0.10, 2) == 1210.0\n\n# 2. Implemente\ndef juros_compostos(capital, taxa, periodos):\n    return capital * (1 + taxa) ** periodos' },
  ],
};
