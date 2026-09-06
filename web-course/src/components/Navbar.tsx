import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Code2, Menu, X, Trophy } from 'lucide-react';
import { XPBadge } from '@/components/XPBadge';
import { StreakCounter } from '@/components/StreakCounter';
import { useProgress } from '@/hooks/useProgress';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { progress } = useProgress();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `navbar-link${isActive ? ' active' : ''}`;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
            <span className="brand-icon">
              <Code2 />
            </span>
            <span>Python<span style={{ color: 'var(--teal-light)' }}>Economia</span></span>
          </Link>

          <ul className="navbar-links">
            <li>
              <NavLink to="/" end className={linkClass}>
                Início
              </NavLink>
            </li>
            <li>
              <NavLink to="/trilhas" className={linkClass}>
                Trilhas
              </NavLink>
            </li>
            <li>
              <NavLink to="/progresso" className={linkClass}>
                Progresso
              </NavLink>
            </li>
          </ul>

          <div className="navbar-actions">
            <StreakCounter streak={progress.streak} />
            <XPBadge xp={progress.xp} />
            <Link to="/trilhas" className="btn btn-primary btn-sm">
              <Trophy size={16} />
              Começar
            </Link>
            <button
              className="navbar-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`navbar-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" end className={linkClass} onClick={() => setMobileOpen(false)}>
          Início
        </NavLink>
        <NavLink to="/trilhas" className={linkClass} onClick={() => setMobileOpen(false)}>
          Trilhas
        </NavLink>
        <NavLink to="/progresso" className={linkClass} onClick={() => setMobileOpen(false)}>
          Progresso
        </NavLink>
      </div>
    </>
  );
}