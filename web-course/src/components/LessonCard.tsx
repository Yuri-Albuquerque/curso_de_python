import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BookOpen, CheckCircle2, Lock, Star, Clock } from 'lucide-react';
import type { Track } from '@/types';
import { useProgress } from '@/hooks/useProgress';
import { getLessonsForTrack } from '@/curriculum/lessons';

interface LessonCardProps {
  lessonId: string;
  track: Track;
  index: number;
  locked: boolean;
  completed: boolean;
  lessonTitle?: string;
  lessonXp?: number;
  lessonDifficulty?: 1 | 2 | 3;
  lessonMinutes?: number;
}

function getIcon(name: string): LucideIcon {
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? BookOpen;
}

export function LessonCard({
  lessonId,
  track,
  index,
  locked,
  completed,
  lessonTitle,
  lessonXp,
  lessonDifficulty,
  lessonMinutes,
}: LessonCardProps) {
  const TrackIcon = getIcon(track.icon);
  const title = lessonTitle ?? `Lição ${index + 1}`;
  const xp = lessonXp ?? 10;
  const difficulty = lessonDifficulty ?? 1;
  const minutes = lessonMinutes ?? 10;

  const card = (
    <div
      className={`card card-lift lesson-card-item${locked ? ' locked' : ''}`}
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
          {completed ? <CheckCircle2 /> : locked ? <Lock /> : <TrackIcon />}
        </div>
        <div className="flex-1">
          <div className="track-card-title">{title}</div>
          <div className="track-card-desc">
            {locked
              ? 'Complete a lição anterior para desbloquear'
              : completed
                ? 'Concluída — clique para revisar'
                : 'Disponível — clique para começar'}
          </div>
        </div>
      </div>
      <div className="track-card-footer">
        <div className="track-card-meta">
          <span className="meta-item">
            <Star size={14} fill="currentColor" /> {xp} XP
          </span>
          <span className="meta-item">
            <Clock size={14} /> {minutes} min
          </span>
          <span className="difficulty-stars">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                size={14}
                fill={s <= difficulty ? 'currentColor' : 'none'}
                className={s <= difficulty ? '' : 'empty'}
              />
            ))}
          </span>
        </div>
        {completed && (
          <span className="badge badge-success">
            <CheckCircle2 size={14} /> Concluída
          </span>
        )}
      </div>
    </div>
  );

  if (locked) {
    return <div className="lesson-card-wrapper locked">{card}</div>;
  }

  return (
    <Link to={`/licao/${lessonId}`} className="lesson-card-wrapper">
      {card}
    </Link>
  );
}

/** Helper: compute completion ratio for a track */
export function useTrackCompletion(track: Track): { completed: number; total: number } {
  const { isLessonCompleted } = useProgress();
  const lessons = getLessonsForTrack(track.id);
  const total = lessons.length || track.lessons.length;
  const completed = track.lessons.filter((id) => isLessonCompleted(id)).length;
  return { completed, total };
}