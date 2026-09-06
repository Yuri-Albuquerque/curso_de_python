/**
 * Progress storage and tracking service.
 *
 * Persists `ProgressState` to `localStorage` under a versioned key, computes
 * streak deltas, awards XP, records per-lesson step progress, and unlocks
 * achievements. All mutations are pure functions that return a new state —
 * the caller is responsible for calling `saveProgress` to persist.
 */

import type { ProgressState } from '@/types';
import { getNewlyUnlockedAchievements } from './achievements';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'oikos-python-economia-progress-v1';

const DEFAULT_STATE: ProgressState = {
  completedLessons: [],
  xp: 0,
  streak: 0,
  lastActivityDate: '',
  achievements: [],
  lessonProgress: {},
};

// ---------------------------------------------------------------------------
// Date helpers (local-timezone date strings, YYYY-MM-DD)
// ---------------------------------------------------------------------------

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Days between two YYYY-MM-DD strings (b - a), ignoring time. */
function daysBetween(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const ms = Date.parse(b) - Date.parse(a);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

/**
 * Load progress from `localStorage`. Returns a fresh default state if nothing
 * is stored or if parsing fails (corrupt data is silently replaced).
 */
export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/**
 * Persist progress to `localStorage`. Returns the state that was saved
 * (useful for chaining).
 */
export function saveProgress(state: ProgressState): ProgressState {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage disabled — fail silently. The in-memory
    // state still flows through the app; it just won't survive a reload.
  }
  return state;
}

/** Remove all stored progress (used by "reset progress" UI). */
export function clearProgress(): ProgressState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return { ...DEFAULT_STATE };
}

// ---------------------------------------------------------------------------
// Streak computation
// ---------------------------------------------------------------------------

/**
 * Compute the new streak given the previous state and the current date.
 *
 * Rules:
 *  - If last activity was today → streak unchanged.
 *  - If last activity was yesterday → streak + 1.
 *  - If last activity was > 1 day ago → streak resets to 1.
 *  - If no previous activity (empty date) → streak starts at 1.
 */
function computeStreak(previous: ProgressState): number {
  const today = todayISO();

  if (!previous.lastActivityDate) return 1;

  const gap = daysBetween(previous.lastActivityDate, today);

  if (gap === 0) return previous.streak;          // already active today
  if (gap === 1) return previous.streak + 1;      // consecutive day
  return 1;                                        // streak broken
}

// ---------------------------------------------------------------------------
// Achievement unlocking
// ---------------------------------------------------------------------------

/**
 * Check for newly-unlocked achievements and append their IDs to the state.
 * Returns a new state object (does not mutate the input).
 */
function applyAchievements(state: ProgressState): ProgressState {
  const newIds = getNewlyUnlockedAchievements(state);
  if (newIds.length === 0) return state;
  return {
    ...state,
    achievements: [...state.achievements, ...newIds],
  };
}

// ---------------------------------------------------------------------------
// Public mutations (all return new ProgressState)
// ---------------------------------------------------------------------------

/**
 * Mark a lesson as completed: add it to `completedLessons`, award XP, update
 * the streak, and check for achievements.
 *
 * Calling this on an already-completed lesson is a safe no-op (the lesson
 * won't be double-counted and XP won't be awarded twice).
 */
export function completeLesson(
  state: ProgressState,
  lessonId: string,
  xpEarned: number,
): ProgressState {
  if (state.completedLessons.includes(lessonId)) {
    // Already completed — just refresh streak/achievements.
    const streak = computeStreak(state);
    const withStreak = { ...state, streak, lastActivityDate: todayISO() };
    return applyAchievements(withStreak);
  }

  const streak = computeStreak(state);
  const updated: ProgressState = {
    ...state,
    completedLessons: [...state.completedLessons, lessonId],
    xp: state.xp + xpEarned,
    streak,
    lastActivityDate: todayISO(),
  };

  return applyAchievements(updated);
}

/**
 * Record progress within a lesson (for resume + spaced repetition).
 * Does not award XP or touch the streak — use `completeLesson` for that.
 */
export function updateLessonProgress(
  state: ProgressState,
  lessonId: string,
  completedSteps: number,
  totalSteps: number,
  lastAttemptErrors?: string[],
): ProgressState {
  return {
    ...state,
    lessonProgress: {
      ...state.lessonProgress,
      [lessonId]: { completedSteps, totalSteps, lastAttemptErrors },
    },
  };
}

/**
 * Clear stored progress for a single lesson (e.g. user clicks "retry lesson").
 */
export function resetLessonProgress(
  state: ProgressState,
  lessonId: string,
): ProgressState {
  const { [lessonId]: _removed, ...rest } = state.lessonProgress;
  return {
    ...state,
    lessonProgress: rest,
  };
}

/**
 * Re-evaluate achievements against the current state. Useful after importing
 * progress from another device or after achievement definitions change.
 */
export function recheckAchievements(state: ProgressState): ProgressState {
  return applyAchievements(state);
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Is this lesson marked as completed? */
export function isLessonCompleted(state: ProgressState, lessonId: string): boolean {
  return state.completedLessons.includes(lessonId);
}

/** Get the stored step progress for a lesson, or `null` if none. */
export function getLessonProgress(
  state: ProgressState,
  lessonId: string,
): ProgressState['lessonProgress'][string] | null {
  return state.lessonProgress[lessonId] ?? null;
}

/**
 * Compute the completion percentage (0–100) for a lesson based on stored step
 * progress. Returns 100 if the lesson is in `completedLessons`.
 */
export function getLessonCompletionPercent(
  state: ProgressState,
  lessonId: string,
): number {
  if (isLessonCompleted(state, lessonId)) return 100;
  const lp = getLessonProgress(state, lessonId);
  if (!lp || lp.totalSteps === 0) return 0;
  return Math.round((lp.completedSteps / lp.totalSteps) * 100);
}

/**
 * Determine the next lesson to study — the first lesson in `lessonOrder` that
 * is not yet completed. Returns `null` if all are done.
 */
export function getNextLesson(
  state: ProgressState,
  lessonOrder: string[],
): string | null {
  return lessonOrder.find((id) => !isLessonCompleted(state, id)) ?? null;
}