import { useCallback, useEffect, useState } from 'react';
import type { ProgressState, Achievement } from '@/types';

/**
 * Local progress storage interface.
 * The real implementation lives in src/services/progressStorage/.
 * This hook delegates to that service if available, otherwise uses
 * a localStorage fallback so the UI works even before the service is wired up.
 */

const STORAGE_KEY = 'python-economia-progress';
const ACHIEVEMENTS_KEY = 'python-economia-achievements';

const defaultProgress: ProgressState = {
  completedLessons: [],
  xp: 0,
  streak: 0,
  lastActivityDate: '',
  achievements: [],
  lessonProgress: {},
};

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2.getTime() - d1.getTime()) / 86_400_000);
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    const parsed = JSON.parse(raw) as ProgressState;
    return { ...defaultProgress, ...parsed };
  } catch {
    return { ...defaultProgress };
  }
}

function saveProgress(p: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
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
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  // Persist on every change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

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
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACHIEVEMENTS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

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