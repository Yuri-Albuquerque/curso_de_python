import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BookOpen, ArrowRight, Layers, Star } from 'lucide-react';
import type { Track } from '@/types';
import { useProgress } from '@/hooks/useProgress';

interface TrackCardProps {
  track: Track;
  lessonCount?: number;
}

function getIcon(name: string): LucideIcon {
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? BookOpen;
}

export function TrackCard({ track, lessonCount }: TrackCardProps) {
  const { isLessonCompleted } = useProgress();
  const TrackIcon = getIcon(track.icon);
  const total = lessonCount ?? track.lessons.length;
  const completed = track.lessons.filter((id) => isLessonCompleted(id)).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Link
      to={`/trilha/${track.id}`}
      className="track-card card card-lift"
      style={{ '--track-color': track.color } as React.CSSProperties}
    >
      <div className="track-card-header">
        <div
          className="icon-shape"
          style={{
            background: `${track.color}1A`,
            color: track.color,
          }}
        >
          <TrackIcon />
        </div>
        <div className="flex-1">
          <div className="track-card-title">{track.title}</div>
          <div className="track-card-desc">{track.description}</div>
        </div>
      </div>

      <div className="track-card-footer">
        <div className="track-card-meta">
          <span className="meta-item">
            <Layers size={14} /> {total} lições
          </span>
          <span className="meta-item">
            <Star size={14} fill="currentColor" /> {completed} concluídas
          </span>
        </div>
        <span className="badge badge-teal" style={{ background: `${track.color}1A`, color: track.color }}>
          {pct}% <ArrowRight size={14} />
        </span>
      </div>

      <div className="track-progress-bar">
        <div
          className="track-progress-fill"
          style={{ width: `${pct}%`, background: track.color }}
        />
      </div>
    </Link>
  );
}