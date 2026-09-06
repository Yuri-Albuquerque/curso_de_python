/**
 * Pyodide runtime service — STUB
 *
 * This file is a placeholder so the app builds before the runtime
 * agent creates the real Pyodide worker service. The real service
 * must export `createPyodideWorker(): Worker` and optionally
 * `PYODIDE_CDN_URL: string`.
 *
 * The usePyodide hook dynamically imports this module and calls
 * `createPyodideWorker()`. With this stub, the hook will report
 * status 'error' until the real service is implemented.
 */

export const PYODIDE_CDN_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/';

export function createPyodideWorker(): Worker {
  throw new Error(
    'Pyodide runtime service not yet implemented. ' +
      'Replace this stub in src/services/pythonRuntime/index.ts with the real implementation.',
  );
}