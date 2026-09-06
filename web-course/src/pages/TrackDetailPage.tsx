import { useParams, Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, BookOpen, Layers, CheckCircle2, Lock } from 'lucide-react';
import { tracks } from '@/curriculum/tracks';
import { getLessonsForTrack } from '@/curriculum/lessons';
import { ProgressMap } from '@/components/ProgressMap';
import { useProgress } from '@/hooks/useProgress';

function getIcon(name: string): LucideIcon {
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? BookOpen;
}

export function TrackDetailPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const { isLessonCompleted } = useProgress();

  const track = tracks.find((t) => t.id === trackId);

  if (!track) {
    return (
      <div className="container text-center" style={{ padding: '4rem 0' }}>
        <h1>Trilha não encontrada</h1>
        <p className="text-muted mb-4">A trilha "{trackId}" não existe.</p>
        <Link to="/trilhas" className="btn btn-primary">
          <ArrowLeft size={18} /> Voltar para trilhas
        </Link>
      </div>
    );
  }

  const TrackIcon = getIcon(track.icon);
  const lessons = getLessonsForTrack(track.id);
  const completed = track.lessons.filter((id) => isLessonCompleted(id)).length;
  const total = track.lessons.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      {/* Track header */}
      <section
        className="page-header"
        style={{ background: `linear-gradient(180deg, ${track.color}08, var(--bg))` }}
      >
        <div className="circle-bg" style={{ width: '18rem', height: '18rem', background: track.color, top: '-2rem', right: '10%' }} />
        <div className="container relative z-10">
          <Link to="/trilhas" className="btn btn-ghost btn-sm mb-4">
            <ArrowLeft size={16} /> Todas as trilhas
          </Link>
          <div
            className="icon-shape icon-shape-lg mx-auto mb-4"
            style={{ background: `${track.color}1A`, color: track.color }}
          >
            <TrackIcon />
          </div>
          <span className="badge mb-3" style={{ background: `${track.color}1A`, color: track.color }}>
            Trilha {track.order} de {tracks.length}
          </span>
          <h1>{track.title}</h1>
          <p>{track.description}</p>

          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="stat-number" style={{ color: track.color, fontSize: '2rem' }}>{total}</div>
              <div className="stat-label">Lições</div>
            </div>
            <div className="text-center">
              <div className="stat-number" style={{ color: 'var(--success)', fontSize: '2rem' }}>{completed}</div>
              <div className="stat-label">Concluídas</div>
            </div>
            <div className="text-center">
              <div className="stat-number" style={{ color: 'var(--gold)', fontSize: '2rem' }}>{pct}%</div>
              <div className="stat-label">Progresso</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="track-progress-bar mt-4" style={{ maxWidth: '20rem', margin: '1rem auto 0' }}>
            <div
              className="track-progress-fill"
              style={{ width: `${pct}%`, background: track.color }}
            />
          </div>
        </div>
      </section>

      {/* Progress map */}
      <section className="section">
        <div className="container-narrow">
          <h2 className="text-center mb-6">Mapa da Trilha</h2>

          {lessons.length === 0 ? (
            <div className="card card-body text-center" style={{ padding: '3rem' }}>
              <Layers size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3>Lições em breve</h3>
              <p className="text-muted">
                O conteúdo desta trilha está sendo preparado. Volte em breve!
              </p>
            </div>
          ) : (
            <ProgressMap track={track} />
          )}

          {/* Lesson list (alternative view) */}
          <div className="mt-8">
            <h3 className="mb-4">Lista de Lições</h3>
            <div className="flex flex-col gap-2">
              {track.lessons.map((lessonId, idx) => {
                const lesson = lessons.find((l) => l.id === lessonId);
                const isCompleted = isLessonCompleted(lessonId);
                const prereqs = lesson?.prerequisites ?? (idx > 0 ? [track.lessons[idx - 1]] : []);
                const isUnlocked = prereqs.length === 0 || isCompleted || prereqs.every((p) => isLessonCompleted(p));

                return (
                  <div key={lessonId} className={`card card-body-sm flex items-center justify-between${isUnlocked ? '' : ' locked'}`} style={{ opacity: isUnlocked ? 1 : 0.5 }}>
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 color="var(--success)" size={24} />
                      ) : isUnlocked ? (
                        <span className="badge badge-teal">{idx + 1}</span>
                      ) : (
                        <Lock color="var(--text-light)" size={20} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{lesson?.title ?? `Lição ${idx + 1}`}</div>
                        {lesson && (
                          <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                            {lesson.estimatedMinutes} min · {lesson.xp} XP
                          </div>
                        )}
                      </div>
                    </div>
                    {isUnlocked && (
                      <Link to={`/licao/${lessonId}`} className="btn btn-outline btn-sm">
                        {isCompleted ? 'Revisar' : 'Começar'}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}