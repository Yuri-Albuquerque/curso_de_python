import type { Achievement } from '@/types';

/**
 * Achievement definitions for the gamification system.
 * Each achievement has a condition function evaluated against ProgressState.
 */
export const achievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'Primeiros Passos',
    description: 'Complete sua primeira lição.',
    icon: 'Footprints',
    condition: (p) => p.completedLessons.length >= 1,
  },
  {
    id: 'five-lessons',
    title: 'Aquecendo',
    description: 'Complete 5 lições.',
    icon: 'Flame',
    condition: (p) => p.completedLessons.length >= 5,
  },
  {
    id: 'ten-lessons',
    title: 'Persistente',
    description: 'Complete 10 lições.',
    icon: 'Award',
    condition: (p) => p.completedLessons.length >= 10,
  },
  {
    id: 'twenty-lessons',
    title: 'Dedicado',
    description: 'Complete 20 lições.',
    icon: 'Medal',
    condition: (p) => p.completedLessons.length >= 20,
  },
  {
    id: 'all-fundamentals',
    title: 'Fundamentos Sólidos',
    description: 'Complete todas as lições da trilha Fundamentos.',
    icon: 'BookOpen',
    condition: (p) => {
      const fundIds = [
        'fund-expressoes', 'fund-variaveis', 'fund-tipos-numericos',
        'fund-strings', 'fund-booleanos', 'fund-entrada-saida',
        'fund-conversao-tipos',
      ];
      return fundIds.every((id) => p.completedLessons.includes(id));
    },
  },
  {
    id: 'first-track',
    title: 'Trilha Concluída',
    description: 'Complete uma trilha inteira.',
    icon: 'Trophy',
    condition: (p) => {
      // Check if any track's lessons are all completed.
      // Fundamentos: 7 lessons
      const tracks = [
        ['fund-expressoes', 'fund-variaveis', 'fund-tipos-numericos', 'fund-strings', 'fund-booleanos', 'fund-entrada-saida', 'fund-conversao-tipos'],
        ['fluxo-comparacoes', 'fluxo-if-elif-else', 'fluxo-operadores-logicos', 'fluxo-for', 'fluxo-while', 'fluxo-break-continue-range', 'fluxo-comprehensions'],
      ];
      return tracks.some((track) =>
        track.every((id) => p.completedLessons.includes(id)),
      );
    },
  },
  {
    id: 'xp-100',
    title: 'Centena de XP',
    description: 'Acumule 100 XP.',
    icon: 'Star',
    condition: (p) => p.xp >= 100,
  },
  {
    id: 'xp-500',
    title: 'Quinhentão',
    description: 'Acumule 500 XP.',
    icon: 'Sparkles',
    condition: (p) => p.xp >= 500,
  },
  {
    id: 'xp-1000',
    title: 'Mestre do Python',
    description: 'Acumule 1000 XP.',
    icon: 'Crown',
    condition: (p) => p.xp >= 1000,
  },
  {
    id: 'streak-3',
    title: 'Três Dias',
    description: 'Mantenha uma sequência de 3 dias.',
    icon: 'Flame',
    condition: (p) => p.streak >= 3,
  },
  {
    id: 'streak-7',
    title: 'Uma Semana',
    description: 'Mantenha uma sequência de 7 dias.',
    icon: 'Calendar',
    condition: (p) => p.streak >= 7,
  },
  {
    id: 'streak-30',
    title: 'Mês Completo',
    description: 'Mantenha uma sequência de 30 dias.',
    icon: 'CalendarCheck',
    condition: (p) => p.streak >= 30,
  },
];