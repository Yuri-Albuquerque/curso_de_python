import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { LogIn, UserPlus, Lock, User, Sparkles } from 'lucide-react';
import { useAuth, validateLogin, validatePassword } from '@/hooks/useAuth';

export function LoginPage() {
  const { login, isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'entrar' | 'criar'>('entrar');

  // Já logado → vai direto para /trilhas.
  if (isLoggedIn && currentUser) {
    return <Navigate to="/trilhas" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const loginErr = validateLogin(loginInput);
    const passErr = validatePassword(passwordInput);
    if (loginErr) {
      setError(loginErr);
      return;
    }
    if (passErr) {
      setError(passErr);
      return;
    }

    const result = login(loginInput, passwordInput);
    if (result) {
      setError(result);
      return;
    }
    navigate('/trilhas');
  };

  const switchMode = (newMode: 'entrar' | 'criar') => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-card-body">
          <div className="text-center mb-6">
            <span className="badge badge-accent mb-4">
              <Sparkles size={14} /> PythonEconomia
            </span>
            <h1 className="login-title">
              {mode === 'entrar' ? 'Entrar' : 'Criar conta'}
            </h1>
            <p className="text-muted login-subtitle">
              {mode === 'entrar'
                ? 'Acesse sua conta para continuar aprendendo.'
                : 'Crie sua conta local para salvar seu progresso.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-input" className="form-label">
                <User size={15} /> Login
              </label>
              <input
                id="login-input"
                className="form-input"
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Ex: joao123"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
              />
              <span className="form-hint">Mínimo 3 caracteres. Apenas letras e números.</span>
            </div>

            <div className="form-group">
              <label htmlFor="password-input" className="form-label">
                <Lock size={15} /> Senha
              </label>
              <input
                id="password-input"
                className="form-input"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Mínimo 4 caracteres"
                autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'}
              />
              <span className="form-hint">Mínimo 4 caracteres. Apenas letras e números.</span>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg login-submit">
              {mode === 'entrar' ? (
                <>
                  <LogIn size={20} /> Entrar
                </>
              ) : (
                <>
                  <UserPlus size={20} /> Criar conta
                </>
              )}
            </button>
          </form>

          <div className="login-switch">
            {mode === 'entrar' ? (
              <p className="text-muted">
                Não tem conta?{' '}
                <button
                  type="button"
                  className="login-switch-btn"
                  onClick={() => switchMode('criar')}
                >
                  Criar conta
                </button>
              </p>
            ) : (
              <p className="text-muted">
                Já tem conta?{' '}
                <button
                  type="button"
                  className="login-switch-btn"
                  onClick={() => switchMode('entrar')}
                >
                  Entrar
                </button>
              </p>
            )}
          </div>

          <p className="login-disclaimer text-muted">
            🔒 Seus dados ficam salvos apenas neste navegador. Não há servidor.
          </p>
        </div>
      </div>
    </div>
  );
}