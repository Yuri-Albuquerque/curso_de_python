import { Star } from 'lucide-react';

interface XPBadgeProps {
  xp: number;
}

export function XPBadge({ xp }: XPBadgeProps) {
  return (
    <span className="xp-badge" title="Pontos de Experiência">
      <Star size={16} fill="currentColor" />
      {xp.toLocaleString('pt-BR')} XP
    </span>
  );
}