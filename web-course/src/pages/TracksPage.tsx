import { GraduationCap } from 'lucide-react';
import { TrackCard } from '@/components/TrackCard';
import { tracks } from '@/curriculum/tracks';
import { useProgress } from '@/hooks/useProgress';

export function TracksPage() {
  const { progress } = useProgress();
  const totalLessons = tracks.reduce((s, t) => s + t.lessons.length, 0);
  const completedCount = tracks.reduce(
    (s, t) => s + t.lessons.filter((id) => progress.completedLessons.includes(id)).length,
    0,
  );

  return (
    <div>
      <section className="page-header">
        <div className="circle-bg" style={{ width: '20rem', height: '20rem', background: 'var(--accent)', top: '0', right: '15%' }} />
        <div className="container relative z-10">
          <span className="badge badge-teal mb-3">
            <GraduationCap size={14} /> Trilhas de Aprendizado
          </span>
          <h1>Todas as Trilhas</h1>
          <p>
            {tracks.length} trilhas com {totalLessons} lições no total. Você já completou{' '}
            <strong>{completedCount}</strong> de <strong>{totalLessons}</strong> lições.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tracks-grid">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}