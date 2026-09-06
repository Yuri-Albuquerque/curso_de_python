import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BookOpen, Lock, CheckCircle2, Star, Clock } from 'lucide-react';
import type { Track, Lesson } from '@/types';
import { useProgress } from '@/hooks/useProgress';
import { getLessonsForTrack } from '@/curriculum/lessons';

interface ProgressMapProps {
  track: Track;
}

function getIcon(name: string): LucideIcon {
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? BookOpen;
}

export function ProgressMap({ track }: ProgressMapProps) {
  const { isLessonCompleted, isLessonUnlocked } = useProgress();
  const lessons = getLessonsForTrack(track.id);
  const TrackIcon = getIcon(track.icon);

  // Build lesson metadata lookups
  const lessonMap = new Map<string, Lesson>();
  for (const l of lessons) {
    lessonMap.set(l.id, l);
  }

  return (
    <div className="progress-map">
      {track.lessons.map((lessonId, idx) => {
        const lesson = lessonMap.get(lessonId);
        const completed = isLessonCompleted(lessonId);
        const prereqs = lesson?.prerequisites ?? (idx > 0 ? [track.lessons[idx - 1]] : []);
        const unlocked = isLessonUnlocked(lessonId, prereqs);
        const locked = !unlocked && !completed;

        const state = completed ? 'completed' : locked ? 'locked' : 'available';
        const title = lesson?.title ?? `Lição ${idx + 1}`;

        const node = (
          <div key={lessonId} className="map-node">
            <div style={{ position: 'relative' }}>
              {completed ? (
                <Link to={`/licao/${lessonId}`}>
                  <button className={`map-node-button ${state}`}>
                    <CheckCircle2 size={28} />
                  </button>
                </Link>
              ) : locked ? (
                <button className={`map-node-button ${state}`} disabled>
                  <Lock size={24} />
                </button>
              ) : (
                <Link to={`/licao/${lessonId}`}>
                  <button className={`map-node-button ${state}`}>
                    {idx + 1}
                  </button>
                </Link>
              )}
              <div className="map-node-tooltip">
                <strong>{title}</strong>
                {lesson && (
                  <span style={{ marginLeft: '0.5rem' }}>
                    — <Star size={11} fill="currentColor" /> {lesson.xp} XP ·{' '}
                    <Clock size={11} /> {lesson.estimatedMinutes}min
                  </span>
                )}
              </div>
              <div className="map-node-label">{title}</div>
            </div>
          </div>
        );

        const connector = idx < track.lessons.length - 1 ? (
          <div className={`map-connector${completed ? ' completed' : ''}`} key={`c-${lessonId}`} />
        ) : null;

        return [node, connector];
      })}
    </div>
  );
}