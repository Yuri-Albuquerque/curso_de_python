import { useEffect, useState } from 'react';
import { Trophy, Flame, Star, BookOpen, Award, RotateCcw, TrendingUp, Target } from 'lucide-react';
import { achievements } from '@/curriculum/achievements';
import { tracks } from '@/curriculum/tracks';
import { useProgress } from '@/hooks/useProgress';
import { AchievementBadge } from '@/components/AchievementBadge';
import { TrackCard } from '@/components/TrackCard';

export function ProgressPage() {
  const { progress, checkAchievements, resetProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  // Check for new achievements on mount
  useEffect(() => {
    checkAchievements(achievements);
  }, [checkAchievements]);

  const totalLessons = tracks.reduce((s, t) => s + t.lessons.length, 0);
  const completedCount = progress.completedLessons.length;
  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const unlockedAchievements = achievements.filter((a) => progress.achievements.includes(a.id));

  const statCards = [
    {
      icon: <Star />,
      label: 'XP Total',
      value: progress.xp.toLocaleString('pt-BR'),
    },
    {
      icon: <Flame />,
      label: 'Sequência (dias)',
      value: progress.streak,
    },
    {
      icon: <BookOpen />,
      label: 'Lições Concluídas',
      value: `${completedCount}/${totalLessons}`,
    },
    {
      icon: <Trophy />,
      label: 'Conquistas',
      value: `${unlockedAchievements.length}/${achievements.length}`,
    },
  ];

  return (
    <div>
      <section className="page-header">
        <div className="circle-bg" style={{ width: '22rem', height: '22rem', background: 'var(--gold)', top: '-3rem', right: '10%' }} />
        <div className="container relative z-10">
          <span className="badge badge-gold mb-3">
            <TrendingUp size={14} /> Seu Progresso
          </span>
          <h1>Conquistas e Estatísticas</h1>
          <p>Acompanhe sua jornada de aprendizado e desbloqueie conquistas.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Overview stats */}
          <div className="progress-overview">
            {statCards.map((stat, i) => (
              <div key={i} className="card progress-stat-card">
                <div className="icon-shape">{stat.icon}</div>
                <div className="progress-stat-value">{stat.value}</div>
                <div className="progress-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="card card-body mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3>Progresso Geral do Curso</h3>
              <span className="badge badge-teal">{overallPct}%</span>
            </div>
            <div className="track-progress-bar" style={{ height: '10px' }}>
              <div
                className="track-progress-fill"
                style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, var(--teal-dark), var(--accent))' }}
              />
            </div>
            <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>
              {completedCount} de {totalLessons} lições concluídas em {tracks.length} trilhas.
            </p>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Award size={24} color="var(--gold)" />
              <h2>Conquistas</h2>
              <span className="badge badge-gold">
                {unlockedAchievements.length}/{achievements.length} desbloqueadas
              </span>
            </div>
            <div className="achievements-grid">
              {achievements.map((ach) => (
                <AchievementBadge
                  key={ach.id}
                  achievement={ach}
                  unlocked={progress.achievements.includes(ach.id)}
                />
              ))}
            </div>
          </div>

          {/* Track progress */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Target size={24} color="var(--teal-dark)" />
              <h2>Progresso por Trilha</h2>
            </div>
            <div className="tracks-grid">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>

          {/* Reset */}
          <div className="card card-body text-center" style={{ padding: '2rem' }}>
            <RotateCcw size={32} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
            <h4>Reiniciar Progresso</h4>
            <p className="text-muted mb-4">
              Apaga todo o seu progresso, XP, sequência e conquistas. Esta ação não pode ser desfeita.
            </p>
            {confirmReset ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-danger" style={{ fontWeight: 600 }}>Tem certeza?</span>
                <button
                  className="btn btn-sm"
                  style={{ background: 'var(--danger)', color: '#fff' }}
                  onClick={() => {
                    resetProgress();
                    setConfirmReset(false);
                  }}
                >
                  Sim, reiniciar
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setConfirmReset(false)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button className="btn btn-outline" onClick={() => setConfirmReset(true)}>
                <RotateCcw size={16} /> Reiniciar progresso
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}