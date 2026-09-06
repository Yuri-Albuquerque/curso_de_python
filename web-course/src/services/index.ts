/**
 * Barrel export for all platform services.
 *
 * Import from `@/services` to access:
 *   - `pythonRuntime`  : Pyodide loading + code execution
 *   - `progressStorage`: localStorage persistence + progress/streak/achievement logic
 *   - `curriculum`     : track & lesson registry + prerequisite checking
 *   - `achievements`   : achievement definitions + unlock detection
 */

export * as pythonRuntime from './pythonRuntime';
export * as progressStorage from './progressStorage';
export * as curriculum from './curriculum';
export * from './progressStorage/achievements';