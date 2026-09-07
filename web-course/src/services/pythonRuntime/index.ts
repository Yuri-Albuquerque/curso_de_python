/**
 * Serviço de execução de Python no navegador (Pyodide + Web Worker).
 *
 * Consumido por src/hooks/usePyodide.ts, que espera:
 *   - `createPyodideWorker(): Worker`
 *   - `PYODIDE_CDN_URL: string`
 */
import PyodideWorker from './pyodide.worker?worker';

export { PYODIDE_CDN_URL } from './cdn';

export function createPyodideWorker(): Worker {
  return new PyodideWorker();
}
