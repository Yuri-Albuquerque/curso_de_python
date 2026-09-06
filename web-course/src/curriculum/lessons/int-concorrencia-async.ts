import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'int-concorrencia-async', trackId: 'intermediario',
  title: 'Concorrência e assincronismo', description: 'asyncio, threads e processos.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['int-funcional'],
  steps: [
    { id: 's1', type: 'explanation', content: '**async/await** para I/O assíncrono. Útil para chamadas de API, leitura de arquivos, web scraping. Não paralelismo de CPU.',
      codeExample: 'import asyncio\n\nasync def buscar_preco(ticker):\n    await asyncio.sleep(1)  # simula requisicao\n    return {\'PETR4\': 28.5, \'VALE3\': 60.0}.get(ticker, 0)\n\nasync def main():\n    precos = await asyncio.gather(\n        buscar_preco(\'PETR4\'),\n        buscar_preco(\'VALE3\')\n    )\n    print(precos)  # [28.5, 60.0]' },
    { id: 's2', type: 'explanation', content: 'Para paralelismo de CPU (cálculos pesados), use `multiprocessing` ou `concurrent.futures`. Para I/O, `asyncio` ou `threading`.',
      codeExample: 'from concurrent.futures import ProcessPoolExecutor\n\nwith ProcessPoolExecutor() as executor:\n    resultados = list(executor.map(calculo_pesado, dados))' },
    { id: 's3', type: 'quiz', question: 'Quando usar asyncio vs multiprocessing?',
      options: ['asyncio para CPU, multiprocessing para I/O', 'asyncio para I/O, multiprocessing para CPU', 'Sempre asyncio', 'Sempre multiprocessing'], answer: 1,
      explanation: 'asyncio é eficiente para I/O (não bloqueia); multiprocessing paraleliza cálculos de CPU.' },
  ],
};
