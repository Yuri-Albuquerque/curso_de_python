/**
 * Achievement definitions for the Python Economics course.
 *
 * Each `Achievement.condition` is a pure function over `ProgressState` —
 * no side effects, no I/O. This keeps achievement evaluation deterministic
 * and testable.
 */

import type { Achievement } from '@/types';

export const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'Primeiros Passos',
    description: 'Complete sua primeira lição',
    icon: 'Footprints',
    condition: (p) => p.completedLessons.length >= 1,
  },
  {
    id: 'lessons-5',
    title: 'Em Ritmo',
    description: 'Complete 5 lições',
    icon: 'BookOpen',
    condition: (p) => p.completedLessons.length >= 5,
  },
  {
    id: 'lessons-10',
    title: 'Dedicado',
    description: 'Complete 10 lições',
    icon: 'BookMarked',
    condition: (p) => p.completedLessons.length >= 10,
  },
  {
    id: 'lessons-25',
    title: 'Estudante Aplicado',
    description: 'Complete 25 lições',
    icon: 'GraduationCap',
    condition: (p) => p.completedLessons.length >= 25,
  },
  {
    id: 'xp-100',
    title: 'Centenário',
    description: 'Acumule 100 XP',
    icon: 'Star',
    condition: (p) => p.xp >= 100,
  },
  {
    id: 'xp-500',
    title: 'Quinhentão',
    description: 'Acumule 500 XP',
    icon: 'Award',
    condition: (p) => p.xp >= 500,
  },
  {
    id: 'xp-1000',
    title: 'Mestre do Python',
    description: 'Acumule 1000 XP',
    icon: 'Trophy',
    condition: (p) => p.xp >= 1000,
  },
  {
    id: 'streak-3',
    title: 'Três Dias Seguidos',
    description: 'Mantenha uma sequência de 3 dias',
    icon: 'Flame',
    condition: (p) => p.streak >= 3,
  },
  {
    id: 'streak-7',
    title: 'Uma Semana de Fogo',
    description: 'Mantenha uma sequência de 7 dias',
    icon: 'Flame',
    condition: (p) => p.streak >= 7,
  },
  {
    id: 'streak-30',
    title: 'Mês Completo',
    description: 'Mantenha uma sequência de 30 dias',
    icon: 'CalendarCheck',
    condition: (p) => p.streak >= 30,
  },
];

/**
 * Evaluate all achievements against a progress state and return the list of
 * newly-unlocked achievement IDs (those whose condition is met but not yet
 * recorded in `progress.achievements`).
 */
export function getNewlyUnlockedAchievements(
  progress: { completedLessons: string[]; xp: number; streak: number; achievements: string[] },
): string[] {
  const unlocked = new Set(progress.achievements);
  return achievements
    .filter((a) => a.condition(progress as never) && !unlocked.has(a.id))
    .map((a) => a.id);
}