import { useCallback, useEffect, useRef, useState } from 'react';
import type { RunResult, TestCase } from '@/types';

/**
 * Hook that manages the Pyodide web worker for running Python code.
 *
 * The actual worker is created by src/services/pythonRuntime/.
 * This hook dynamically imports the service so it works even if the
 * service files haven't been created yet (it falls back to a "not ready"
 * state). Once the service is available, the hook wires up the worker
 * communication.
 */

export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface UsePyodideReturn {
  status: PyodideStatus;
  errorMessage: string | null;
  runCode: (code: string, tests?: TestCase[]) => Promise<RunResult>;
  isRunning: boolean;
}

export function usePyodide(): UsePyodideReturn {
  const [status, setStatus] = useState<PyodideStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const pendingResolvers = useRef<Map<number, (r: RunResult) => void>>(new Map());
  const pendingRejecters = useRef<Map<number, (e: Error) => void>>(new Map());
  const msgIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setStatus('loading');

        // Dynamically import the service module created by another agent.
        // Expected export: createPyodideWorker(): Worker
        // and PYODIDE_CDN_URL constant.
        const mod = await import('@/services/pythonRuntime');

        if (cancelled) return;

        if (typeof mod.createPyodideWorker === 'function') {
          const worker = mod.createPyodideWorker();
          workerRef.current = worker;

          worker.addEventListener('message', (e: MessageEvent) => {
            const data = e.data;
            if (data?.type === 'ready') {
              setStatus('ready');
            } else if (data?.type === 'error') {
              setStatus('error');
              setErrorMessage(data.message ?? 'Erro ao carregar Pyodide');
            } else if (data?.type === 'result' && data.msgId != null) {
              const resolve = pendingResolvers.current.get(data.msgId);
              const reject = pendingRejecters.current.get(data.msgId);
              if (data.error && reject) {
                reject(new Error(data.error));
              } else if (resolve) {
                resolve(data.result as RunResult);
              }
              pendingResolvers.current.delete(data.msgId);
              pendingRejecters.current.delete(data.msgId);
            }
          });

          worker.addEventListener('error', (e: ErrorEvent) => {
            setStatus('error');
            setErrorMessage(e.message ?? 'Erro no worker do Pyodide');
          });
        } else {
          // Service exists but doesn't export the expected function yet.
          setStatus('error');
          setErrorMessage('Serviço Pyodide não implementado.');
        }
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Não foi possível carregar o Pyodide',
        );
      }
    }

    init();

    return () => {
      cancelled = true;
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const runCode = useCallback(
    async (code: string, tests?: TestCase[]): Promise<RunResult> => {
      const worker = workerRef.current;
      if (!worker) {
        return {
          stdout: '',
          stderr: '',
          error: 'Pyodide não está carregado ainda.',
          result: null,
          testsPassed: false,
          testResults: [],
        };
      }

      if (status !== 'ready') {
        return {
          stdout: '',
          stderr: '',
          error: 'Pyodide ainda está carregando. Aguarde um momento.',
          result: null,
          testsPassed: false,
          testResults: [],
        };
      }

      const msgId = ++msgIdRef.current;
      setIsRunning(true);

      return new Promise<RunResult>((resolve, reject) => {
        pendingResolvers.current.set(msgId, resolve);
        pendingRejecters.current.set(msgId, reject);

        worker.postMessage({
          type: 'run',
          msgId,
          code,
          tests: tests ?? [],
        });

        // Timeout after 15 seconds
        setTimeout(() => {
          if (pendingResolvers.current.has(msgId)) {
            pendingResolvers.current.delete(msgId);
            pendingRejecters.current.delete(msgId);
            setIsRunning(false);
            resolve({
              stdout: '',
              stderr: '',
              error: 'Tempo limite excedido (15s).',
              result: null,
              testsPassed: false,
              testResults: [],
            });
          }
        }, 15_000);
      }).finally(() => {
        setIsRunning(false);
      });
    },
    [status],
  );

  return { status, errorMessage, runCode, isRunning };
}