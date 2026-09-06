import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <span
      className={`streak-counter${streak === 0 ? ' zero' : ''}`}
      title="Sequência de dias"
    >
      <Flame size={16} fill={streak > 0 ? 'currentColor' : 'none'} />
      {streak}
    </span>
  );
}