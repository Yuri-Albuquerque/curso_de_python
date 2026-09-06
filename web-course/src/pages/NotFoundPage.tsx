import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Ops! Esta página não existe.</p>
      <div className="flex gap-3">
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Voltar ao início
        </Link>
        <Link to="/trilhas" className="btn btn-outline">
          <ArrowLeft size={18} /> Ver trilhas
        </Link>
      </div>
    </div>
  );
}