import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Lock } from 'lucide-react';
import type { Achievement } from '@/types';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
}

function getIcon(name: string): LucideIcon {
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? Lock;
}

export function AchievementBadge({ achievement, unlocked }: AchievementBadgeProps) {
  const Icon = getIcon(achievement.icon);

  return (
    <div className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'}`}>
      <div className="icon-shape icon-shape-lg">
        {unlocked ? <Icon /> : <Lock />}
      </div>
      <h5>{achievement.title}</h5>
      <p>{achievement.description}</p>
      {!unlocked && (
        <span className="badge badge-muted mt-2">
          <Lock size={12} /> Bloqueado
        </span>
      )}
    </div>
  );
}