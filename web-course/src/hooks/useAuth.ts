import { useCallback, useEffect, useState } from 'react';

/**
 * Hook de autenticação baseada em localStorage.
 * O login e a senha são strings alfanuméricas (letras + dígitos).
 * Não há backend — as credenciais ficam apenas no navegador.
 */

const AUTH_KEY = 'python-economia-auth';

/** Login: alfanumérico, mínimo 3 caracteres. */
const LOGIN_REGEX = /^[A-Za-z0-9]{3,}$/;
/** Senha: alfanumérica, mínimo 4 caracteres. */
const PASSWORD_REGEX = /^[A-Za-z0-9]{4,}$/;

export interface AuthUser {
  login: string;
  password: string;
}

export interface UseAuthReturn {
  /** Usuário atualmente autenticado (ou null). */
  currentUser: AuthUser | null;
  /** True quando existe um usuário logado. */
  isLoggedIn: boolean;
  /**
   * Tenta autenticar (ou criar) um usuário local.
   * Retorna `null` em caso de sucesso ou uma mensagem de erro em pt-BR.
   */
  login: (login: string, password: string) => string | null;
  /** Encerra a sessão atual. */
  logout: () => void;
}

/** Valida o formato do login (alfanumérico, min 3). */
export function validateLogin(value: string): string | null {
  if (!value) return 'O login é obrigatório.';
  if (value.length < 3) return 'O login deve ter no mínimo 3 caracteres.';
  if (!LOGIN_REGEX.test(value)) {
    return 'O login deve conter apenas letras e números (sem espaços ou caracteres especiais).';
  }
  return null;
}

/** Valida o formato da senha (alfanumérica, min 4). */
export function validatePassword(value: string): string | null {
  if (!value) return 'A senha é obrigatória.';
  if (value.length < 4) return 'A senha deve ter no mínimo 4 caracteres.';
  if (!PASSWORD_REGEX.test(value)) {
    return 'A senha deve conter apenas letras e números (sem espaços ou caracteres especiais).';
  }
  return null;
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && typeof parsed.login === 'string' && typeof parsed.password === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch {
    /* ignore quota errors */
  }
}

export function useAuth(): UseAuthReturn {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => loadUser());

  // Sincroniza mudanças entre abas/janelas.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) {
        setCurrentUser(loadUser());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = useCallback((loginValue: string, passwordValue: string): string | null => {
    const loginErr = validateLogin(loginValue);
    if (loginErr) return loginErr;
    const passErr = validatePassword(passwordValue);
    if (passErr) return passErr;

    const user: AuthUser = { login: loginValue, password: passwordValue };
    saveUser(user);
    setCurrentUser(user);
    return null;
  }, []);

  const logout = useCallback(() => {
    saveUser(null);
    setCurrentUser(null);
  }, []);

  return {
    currentUser,
    isLoggedIn: currentUser !== null,
    login,
    logout,
  };
}