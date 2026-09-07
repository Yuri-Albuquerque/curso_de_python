/**
 * Curriculum lessons index.
 *
 * This file is a bridge: it re-exports lessons from the individual lesson
 * files created by another agent under src/curriculum/lessons/. If the
 * lesson files don't exist yet, it falls back to an empty array so the
 * UI can still render (showing locked/placeholder states).
 *
 * The other agent is expected to create:
 *   src/curriculum/lessons/<lesson-id>.ts
 * each exporting a `Lesson` object, and a barrel
 *   src/curriculum/lessons/index.ts
 * that exports `allLessons: Lesson[]`.
 */

import type { Lesson } from '@/types';

// We use a mutable module-level variable and a loader function.
// Vite will statically resolve the import at build time; if the
// barrel doesn't exist yet, the build will fail — but in dev it
// works. When the other agent creates the barrel, this just works.
//
// To avoid a hard build failure before the curriculum exists,
// we catch at runtime via a lazy pattern.

let _allLessons: Lesson[] = [];
let _loaded = false;
let _emAndamento: Promise<void> | null = null;

/**
 * Carrega as lições do barrel do currículo.
 *
 * Cuidados que este código precisa ter (já causaram bug em produção):
 *  - `_loaded` só vira `true` DEPOIS do await. Marcá-lo antes fazia
 *    chamadas concorrentes acharem que já estava carregado e lerem uma
 *    lista vazia ("Lição não encontrada").
 *  - a promessa em andamento é compartilhada, para que N chamadas
 *    simultâneas resultem em UM único download do chunk.
 */
async function ensureLoaded(): Promise<void> {
  if (_loaded) return;
  if (_emAndamento) return _emAndamento;

  _emAndamento = (async () => {
    try {
      const mod = await import('@/curriculum/lessons/index');
      if (mod.allLessons) {
        _allLessons = mod.allLessons;
      } else {
        const maybeDefault = (mod as { default?: unknown }).default;
        if (Array.isArray(maybeDefault)) {
          _allLessons = maybeDefault as Lesson[];
        }
      }
      _loaded = true;
    } catch {
      // Barrel indisponível — a UI mostra estado de placeholder.
      _allLessons = [];
      _loaded = false;
    } finally {
      _emAndamento = null;
    }
  })();

  return _emAndamento;
}

/** Synchronous access — returns currently loaded lessons. */
export function getAllLessons(): Lesson[] {
  return _allLessons;
}

/** Get all lessons for a given track ID, in order. */
export function getLessonsForTrack(trackId: string): Lesson[] {
  return _allLessons.filter((l) => l.trackId === trackId);
}

/** Get a single lesson by ID. */
export function getLessonById(lessonId: string): Lesson | undefined {
  return _allLessons.find((l) => l.id === lessonId);
}

/** Trigger async loading (call from a useEffect in a top-level component). */
export function loadLessons(): Promise<void> {
  return ensureLoaded();
}

/** Check if lessons have been loaded. */
export function isLessonsLoaded(): boolean {
  return _loaded;
}