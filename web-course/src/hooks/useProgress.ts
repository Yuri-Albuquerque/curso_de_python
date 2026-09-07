import { useCallback, useEffect, useState } from 'react';
import type { ProgressState, Achievement } from '@/types';

/**
 * Local progress storage interface.
 * The real implementation lives in src/services/progressStorage/.
 * This hook delegates to that service if available, otherwise uses
 * a localStorage fallback so the UI works even before the service is wired up.
 *
 * Progress is keyed by user login so different users on the same browser
 * have separate progress. When no user is logged in, an "anon" key is used.
 */

const AUTH_KEY = 'python-economia-auth';
const ACHIEVEMENTS_KEY_PREFIX = 'python-economia-achievements';

const defaultProgress: ProgressState = {
  completedLessons: [],
  xp: 0,
  streak: 0,
  lastActivityDate: '',
  achievements: [],
  lessonProgress: {},
};

/** Retorna o login do usuário atualmente autenticado, ou 'anon'. */
function getCurrentLogin(): string {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return 'anon';
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.login === 'string' && parsed.login) {
      return parsed.login;
    }
    return 'anon';
  } catch {
    return 'anon';
  }
}

/** Constrói a storage key de progresso para um dado login. */
function progressKeyFor(login: string): string {
  return `python-economia-progress-${login}`;
}

/** Constrói a storage key de conquistas para um dado login. */
function achievementsKeyFor(login: string): string {
  return `${ACHIEVEMENTS_KEY_PREFIX}-${login}`;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2.getTime() - d1.getTime()) / 86_400_000);
}

function loadProgress(storageKey: string): ProgressState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { ...defaultProgress };
    const parsed = JSON.parse(raw) as ProgressState;
    return { ...defaultProgress, ...parsed };
  } catch {
    return { ...defaultProgress };
  }
}

function saveProgress(storageKey: string, p: ProgressState): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(p));
  } catch {
    /* ignore quota errors */
  }
}

export interface UseProgressReturn {
  progress: ProgressState;
  isLessonCompleted: (lessonId: string) => boolean;
  isLessonUnlocked: (lessonId: string, prerequisites: string[]) => boolean;
  getLessonProgress: (lessonId: string) => { completedSteps: number; totalSteps: number } | undefined;
  completeLesson: (lessonId: string, xp: number, totalSteps: number) => void;
  updateLessonStepProgress: (lessonId: string, completedSteps: number, totalSteps: number) => void;
  resetProgress: () => void;
  checkAchievements: (achievements: Achievement[]) => string[];
}

export function useProgress(): UseProgressReturn {
  const [currentLogin] = useState<string>(() => getCurrentLogin());
  const storageKey = progressKeyFor(currentLogin);
  const achievementsKey = achievementsKeyFor(currentLogin);

  const [progress, setProgress] = useState<ProgressState>(() => loadProgress(storageKey));

  // Persist on every change
  useEffect(() => {
    saveProgress(storageKey, progress);
  }, [progress, storageKey]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons],
  );

  const isLessonUnlocked = useCallback(
    (lessonId: string, prerequisites: string[]) => {
      // First lesson or no prereqs → unlocked
      if (prerequisites.length === 0) return true;
      // If already completed, it's always "unlocked" (replayable)
      if (progress.completedLessons.includes(lessonId)) return true;
      return prerequisites.every((prereq) => progress.completedLessons.includes(prereq));
    },
    [progress.completedLessons],
  );

  const getLessonProgress = useCallback(
    (lessonId: string) => progress.lessonProgress[lessonId],
    [progress.lessonProgress],
  );

  const completeLesson = useCallback(
    (lessonId: string, xp: number, totalSteps: number) => {
      setProgress((prev) => {
        const already = prev.completedLessons.includes(lessonId);
        const today = todayISO();
        const gap = daysBetween(prev.lastActivityDate, today);

        // Streak logic: first ever activity → streak 1; consecutive day → +1;
        // same day → no change; gap > 1 → reset to 1
        let newStreak = prev.streak;
        if (prev.lastActivityDate === today) {
          // already active today, keep streak
        } else if (gap === 1) {
          newStreak = prev.streak + 1;
        } else {
          newStreak = 1;
        }

        return {
          ...prev,
          completedLessons: already
            ? prev.completedLessons
            : [...prev.completedLessons, lessonId],
          xp: already ? prev.xp : prev.xp + xp,
          streak: newStreak,
          lastActivityDate: today,
          lessonProgress: {
            ...prev.lessonProgress,
            [lessonId]: {
              completedSteps: totalSteps,
              totalSteps,
            },
          },
        };
      });
    },
    [],
  );

  const updateLessonStepProgress = useCallback(
    (lessonId: string, completedSteps: number, totalSteps: number) => {
      setProgress((prev) => ({
        ...prev,
        lessonProgress: {
          ...prev.lessonProgress,
          [lessonId]: {
            ...(prev.lessonProgress[lessonId] ?? { completedSteps: 0, totalSteps }),
            completedSteps,
            totalSteps,
          },
        },
      }));
    },
    [],
  );

  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress });
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(achievementsKey);
    } catch {
      /* ignore */
    }
  }, [storageKey, achievementsKey]);

  const checkAchievements = useCallback(
    (achievements: Achievement[]): string[] => {
      const newlyUnlocked: string[] = [];
      setProgress((prev) => {
        const current = new Set(prev.achievements);
        for (const ach of achievements) {
          if (!current.has(ach.id) && ach.condition(prev)) {
            newlyUnlocked.push(ach.id);
            current.add(ach.id);
          }
        }
        if (newlyUnlocked.length === 0) return prev;
        return { ...prev, achievements: Array.from(current) };
      });
      return newlyUnlocked;
    },
    [],
  );

  return {
    progress,
    isLessonCompleted,
    isLessonUnlocked,
    getLessonProgress,
    completeLesson,
    updateLessonStepProgress,
    resetProgress,
    checkAchievements,
  };
}