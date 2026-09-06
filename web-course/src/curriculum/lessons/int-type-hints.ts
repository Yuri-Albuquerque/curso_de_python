import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-type-hints', trackId: 'intermediario',
  title: 'Type hints', description: 'Anotações de tipo para código mais seguro.',
  difficulty: 3, xp: 15, estimatedMinutes: 8, prerequisites: ['int-modulos-pacotes'],
  steps: [
    { id: 's1', type: 'explanation', content: '**Type hints** anotam os tipos esperados. Python não verifica em runtime, mas IDEs e ferramentas como mypy sim.',
      codeExample: 'def calcular_receita(preco: float, quantidade: int) -> float:\n    return preco * quantidade\n\ncalcular_receita(25.90, 80)  # 2072.0' },
    { id: 's2', type: 'explanation', content: 'Use `Optional` para valores que podem ser None, `List` para listas, `Dict` para dicionários.',
      codeExample: 'from typing import Optional, List, Dict\n\ndef buscar_preco(ticker: str) -> Optional[float]:\n    precos = {\"PETR4\": 28.5, \"VALE3\": 60.0}\n    return precos.get(ticker)\n\ndef todos_precos() -> Dict[str, float]:\n    return {\"PETR4\": 28.5, \"VALE3\": 60.0}' },
    { id: 's3', type: 'quiz', question: 'Type hints em Python são:',
      options: ['Obrigatórios e verificados em runtime', 'Opcionais e verificados por ferramentas externas', 'Apenas para classes', 'Apenas para funções'], answer: 1,
      explanation: 'Type hints são opcionais; ferramentas como mypy verificam estaticamente.' },
    { id: 's4', type: 'code', prompt: 'Adicione type hints à função.',
      starterCode: 'def margem(lucro, receita):\n    return (lucro / receita) * 100',
      tests: [],
      hint: 'def margem(lucro: float, receita: float) -> float:' },
  ],
};
