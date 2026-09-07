import { Link } from 'react-router-dom';
import {
  Code2,
  TrendingUp,
  Rocket,
  Zap,
  Brain,
  Trophy,
  Play,
  ArrowRight,
  Calculator,
  BarChart3,
  Target,
  Sparkles,
} from 'lucide-react';
import { TrackCard } from '@/components/TrackCard';
import { tracks } from '@/curriculum/tracks';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';

export function HomePage() {
  const { progress } = useProgress();
  const { isLoggedIn } = useAuth();
  const totalLessons = tracks.reduce((sum, t) => sum + t.lessons.length, 0);

  const features = [
    {
      icon: <Zap />,
      title: 'Execute Python no Navegador',
      desc: 'Escreva e rode código Python sem instalar nada. Tudo acontece direto no seu navegador via Pyodide.',
    },
    {
      icon: <Target />,
      title: 'Aprendizado Gamificado',
      desc: 'Ganhe XP, mantenha sequências diárias, desbloqueie conquistas e avance por trilhas estruturadas.',
    },
    {
      icon: <TrendingUp />,
      title: 'Focado em Economia',
      desc: 'Exercícios com dados econômicos reais: séries temporais, indicadores, econometria e visualização.',
    },
    {
      icon: <Brain />,
      title: 'Exercícios Interativos',
      desc: 'Quiz, preenchimento de lacunas, ordenação de linhas, previsão de saída e depuração de código.',
    },
    {
      icon: <Calculator />,
      title: 'Do Básico ao Avançado',
      desc: '7 trilhas que cobrem desde expressões e variáveis até NumPy, pandas e machine learning.',
    },
    {
      icon: <BarChart3 />,
      title: 'Análise de Dados Reais',
      desc: 'Use NumPy e pandas para analisar dados econômicos, calcular indicadores e criar visualizações.',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="circle-bg" style={{ width: '25rem', height: '25rem', background: 'var(--accent)', top: '-5rem', right: '10%' }} />
        <div className="circle-bg" style={{ width: '20rem', height: '20rem', background: 'var(--teal-light)', bottom: '-5rem', left: '5%' }} />

        <div className="container hero-grid">
          <div className="hero-content">
            <span className="badge badge-accent mb-4">
              <Sparkles size={14} /> Curso interativo · Grátis · No navegador
            </span>
            <h1>
              Aprenda <span style={{ color: 'var(--teal-dark)' }}>Python</span> para{' '}
              <span style={{ color: 'var(--gold)' }}>Economia</span>
            </h1>
            <p className="hero-subtitle">
              Uma plataforma gamificada, estilo Duolingo, que ensina Python do zero
              ao avançado com foco em análise econômica. Escreva código real, execute
              no navegador e ganhe XP a cada lição.
            </p>
            <div className="hero-cta">
              <Link to={isLoggedIn ? '/trilhas' : '/login'} className="btn btn-primary btn-lg">
                <Play size={20} /> Começar agora
              </Link>
              <Link to="/progresso" className="btn btn-outline btn-lg">
                <Trophy size={20} /> Ver progresso
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hero-card">
                <span className="code-line"><span className="cmt"># Calcular PIB per capita</span></span>
                <span className="code-line"><span className="kw">import</span> numpy <span className="kw">as</span> np</span>
                <span className="code-line"> </span>
                <span className="code-line">pib = np.array([<span className="num">2.1e12</span>, <span className="num">1.8e12</span>, <span className="num">1.4e12</span>])</span>
                <span className="code-line">pop = np.array([<span className="num">213e6</span>, <span className="num">147e6</span>, <span className="num">67e6</span>])</span>
                <span className="code-line"> </span>
                <span className="code-line">pib_per_capita = pib / pop</span>
                <span className="code-line"><span className="fn">print</span>(<span className="str">f"PIB per capita: </span></span>
                <span className="code-line"><span className="str">  R${'${pib_per_capita.round(0)}'}"</span>)</span>
              </div>
              <div className="hero-badge-float top-right">
                <span className="xp-badge"><Trophy size={16} fill="currentColor" /> +50 XP</span>
              </div>
              <div className="hero-badge-float bottom-left">
                <span className="streak-counter"><span className="text-danger">🔥</span> 7 dias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video – Conheça o curso */}
      <section className="section-sm">
        <div className="container">
          <div className="text-center mb-6">
            <span className="badge badge-accent mb-3"><Play size={14} /> Conheça o curso</span>
            <h2>Veja o PythonEconomia em ação</h2>
            <p className="text-muted mt-2" style={{ maxWidth: '36rem', margin: '0 auto' }}>
              Assista ao vídeo introdutório e descubra como a plataforma funciona — interativo,
              gamificado e 100% no navegador.
            </p>
          </div>
          <div className="video-card card" style={{ boxShadow: 'var(--shadow-lg)', maxWidth: 'var(--max-w-narrow)', margin: '0 auto', padding: 0, overflow: 'hidden' }}>
            <video
              className="course-video"
              controls
              preload="metadata"
              playsInline
            >
              <source src="assets/oikos_python.mp4" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm">
        <div className="container">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-number">{tracks.length}</div>
              <div className="stat-label">Trilhas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalLessons}+</div>
              <div className="stat-label">Lições</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">7</div>
              <div className="stat-label">Tipos de Exercício</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{progress.xp}</div>
              <div className="stat-label">Seu XP</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-8">
            <span className="badge badge-teal mb-3"><Rocket size={14} /> Por que PythonEconomia?</span>
            <h2>Tudo que você precisa para dominar Python</h2>
            <p className="text-muted mt-2" style={{ maxWidth: '36rem', margin: '0 auto' }}>
              Uma experiência de aprendizado completa, interativa e gamificada.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="card feature-card card-lift">
                <div className="icon-shape icon-shape-lg">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks preview */}
      <section className="section bg-alt">
        <div className="container">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="badge badge-gold mb-3"><Trophy size={14} /> Trilhas de Aprendizado</span>
              <h2>Escolha sua trilha</h2>
            </div>
            <Link to="/trilhas" className="btn btn-outline">
              Ver todas <ArrowRight size={18} />
            </Link>
          </div>
          <div className="tracks-grid">
            {tracks.slice(0, 4).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="card text-center" style={{ padding: '3.5rem 2rem', background: 'linear-gradient(135deg, var(--teal-dark), var(--teal-mid))' }}>
            <Code2 size={48} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: '#fff' }}>Pronto para começar?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '30rem', margin: '0.75rem auto 2rem' }}>
              Comece pela primeira trilha e construa sua base em Python. Sem instalações,
              sem configuração — apenas aprendizado.
            </p>
            <Link to="/trilhas" className="btn btn-accent btn-lg">
              <Play size={20} /> Iniciar primeira lição
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}