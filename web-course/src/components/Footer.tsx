import { Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="brand-icon">
                <Code2 />
              </span>
              <span>PythonEconomia</span>
            </div>
            <p>
              Curso interativo de Python para estudantes de Economia. Aprenda
              programação no navegador com exercícios práticos, execução de código
              em tempo real e trilhas gamificadas.
            </p>
          </div>

          <div>
            <h5>Conteúdo</h5>
            <ul>
              <li><Link to="/trilhas">Trilhas</Link></li>
              <li><Link to="/progresso">Meu Progresso</Link></li>
              <li><Link to="/">Início</Link></li>
            </ul>
          </div>

          <div>
            <h5>Sobre</h5>
            <ul>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://pyodide.org" target="_blank" rel="noopener noreferrer">Pyodide</a></li>
              <li><a href="https://www.python.org" target="_blank" rel="noopener noreferrer">Python.org</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PythonEconomia · OIKOS</span>
          <span>Feito com Python no navegador via Pyodide</span>
        </div>
      </div>
    </footer>
  );
}