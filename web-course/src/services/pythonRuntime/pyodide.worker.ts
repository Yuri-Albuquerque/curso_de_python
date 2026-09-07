/// <reference lib="webworker" />
/**
 * Worker do Pyodide — executa o código do aluno fora da thread principal,
 * para que um laço infinito não congele a interface.
 *
 * Protocolo (definido por src/hooks/usePyodide.ts):
 *   worker -> app : { type: 'ready' }
 *                   { type: 'error',  message }
 *                   { type: 'result', msgId, result }
 *   app -> worker : { type: 'run',    msgId, code, tests }
 */
import { PYODIDE_CDN_URL } from './cdn';
import { HARNESS_PY } from './harness.py';

interface PyodideLike {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: { get: (name: string) => unknown };
}

let pyodide: PyodideLike | null = null;

async function boot(): Promise<void> {
  // A distribuição ESM do Pyodide é carregada do CDN em tempo de execução
  // (não entra no bundle). @vite-ignore evita que o Rollup tente resolver.
  const mod: any = await import(/* @vite-ignore */ `${PYODIDE_CDN_URL}pyodide.mjs`);
  pyodide = (await mod.loadPyodide({ indexURL: PYODIDE_CDN_URL })) as PyodideLike;
  // As 46 questões de código do curso usam apenas Python puro + stdlib,
  // portanto nenhum pacote extra precisa ser baixado aqui.
  await pyodide.runPythonAsync(HARNESS_PY);
}

const pronto = boot()
  .then(() => {
    self.postMessage({ type: 'ready' });
  })
  .catch((err: unknown) => {
    self.postMessage({
      type: 'error',
      message:
        err instanceof Error
          ? `Não foi possível carregar o Python: ${err.message}`
          : 'Não foi possível carregar o Python no navegador.',
    });
  });

self.addEventListener('message', async (evento: MessageEvent) => {
  const dados = evento.data;
  if (dados?.type !== 'run') return;

  const { msgId, code, tests } = dados as {
    msgId: number;
    code: string;
    tests?: unknown[];
  };

  await pronto;

  if (!pyodide) {
    self.postMessage({
      type: 'result',
      msgId,
      error: 'O interpretador Python não está disponível.',
    });
    return;
  }

  try {
    const executar = pyodide.globals.get('_oikos_run') as (
      code: string,
      testsJson: string,
    ) => string;

    const bruto = executar(code, JSON.stringify(tests ?? []));
    self.postMessage({ type: 'result', msgId, result: JSON.parse(bruto) });
  } catch (err: unknown) {
    self.postMessage({
      type: 'result',
      msgId,
      result: {
        stdout: '',
        stderr: '',
        error:
          err instanceof Error ? err.message : 'Falha inesperada ao executar o código.',
        result: null,
        testsPassed: false,
        testResults: [],
      },
    });
  }
});
