/**
 * Curriculum service — central registry of tracks and lessons.
 *
 * Imports the static track definitions from `@/curriculum/tracks` and provides
 * lookup, ordering, and prerequisite-checking helpers used across pages and
 * components.
 */

import type { Track, Lesson } from '@/types';
import { tracks as trackData } from '@/curriculum/tracks';

// ---------------------------------------------------------------------------
// Lesson registry
// ---------------------------------------------------------------------------

/**
 * Individual lesson definitions live in `@/curriculum/lessons/` as separate
 * modules. As lessons are authored they're imported here and added to the
 * `lessonRegistry` map.
 *
 * Until lessons are added, this map is empty — the curriculum service still
 * works (it just won't find any lessons by ID). The lookup functions return
 * `null` gracefully so the UI can show "coming soon" placeholders.
 */

// Import lesson modules here as they are created, e.g.:
//   import { lesson as fundExpressoes } from '@/curriculum/lessons/fund-expressoes';
// and add to the registry:
//   const lessonModules: Lesson[] = [fundExpressoes];

const lessonModules: Lesson[] = [];

const lessonRegistry: Map<string, Lesson> = new Map(
  lessonModules.map((l) => [l.id, l]),
);

// ---------------------------------------------------------------------------
// Track queries
// ---------------------------------------------------------------------------

/** All tracks, sorted by their `order` field. */
export function getAllTracks(): Track[] {
  return [...trackData].sort((a, b) => a.order - b.order);
}

/** Get a track by ID, or `null` if not found. */
export function getTrackById(trackId: string): Track | null {
  return trackData.find((t) => t.id === trackId) ?? null;
}

/** Get all lesson IDs across all tracks, in track order. */
export function getAllLessonIds(): string[] {
  return getAllTracks().flatMap((t) => t.lessons);
}

// ---------------------------------------------------------------------------
// Lesson queries
// ---------------------------------------------------------------------------

/** Get a lesson by ID, or `null` if not yet authored. */
export function getLessonById(lessonId: string): Lesson | null {
  return lessonRegistry.get(lessonId) ?? null;
}

/** Get all authored lessons for a given track, in track-declared order. */
export function getLessonsForTrack(trackId: string): Lesson[] {
  const track = getTrackById(trackId);
  if (!track) return [];
  return track.lessons
    .map((id) => lessonRegistry.get(id))
    .filter((l): l is Lesson => l !== null);
}

// ---------------------------------------------------------------------------
// Prerequisites
// ---------------------------------------------------------------------------

/**
 * Check whether all prerequisites for a lesson are met.
 *
 * @param lessonId   The lesson to check.
 * @param completed  Set/array of completed lesson IDs.
 * @returns `true` if every prerequisite is in `completed` (or the lesson has
 *          no prerequisites).
 */
export function arePrerequisitesMet(
  lessonId: string,
  completed: string[],
): boolean {
  const lesson = getLessonById(lessonId);
  if (!lesson || lesson.prerequisites.length === 0) return true;
  const completedSet = new Set(completed);
  return lesson.prerequisites.every((id) => completedSet.has(id));
}

/**
 * Get the list of prerequisite lessons for a given lesson. Only returns lessons
 * that exist in the registry; unknown prerequisite IDs are silently dropped.
 */
export function getPrerequisites(lessonId: string): Lesson[] {
  const lesson = getLessonById(lessonId);
  if (!lesson) return [];
  return lesson.prerequisites
    .map((id) => lessonRegistry.get(id))
    .filter((l): l is Lesson => l !== null);
}

// ---------------------------------------------------------------------------
// Registration (used by lesson modules as they're added)
// ---------------------------------------------------------------------------

/**
 * Register a lesson at runtime. This allows lesson modules to self-register
 * via a side-effect import if desired:
 *
 *   // fund-expressoes.ts
 *   registerLesson(lesson);
 *
 * Idempotent — re-registering the same ID replaces the existing entry.
 */
export function registerLesson(lesson: Lesson): void {
  lessonRegistry.set(lesson.id, lesson);
}