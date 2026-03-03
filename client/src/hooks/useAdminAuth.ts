import { useState, useEffect, useCallback } from 'react';

interface AdminAuthState {
  authenticated: boolean;
  loading: boolean;
  token: string | null;
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    authenticated: false,
    loading: true,
    token: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setState({ authenticated: false, loading: false, token: null });
        return;
      }
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (res.ok) {
        setState({ authenticated: true, loading: false, token });
      } else {
        localStorage.removeItem('admin_token');
        setState({ authenticated: false, loading: false, token: null });
      }
    } catch {
      setState({ authenticated: false, loading: false, token: null });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        setState({ authenticated: true, loading: false, token: data.token });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('admin_token');
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    });
    localStorage.removeItem('admin_token');
    setState({ authenticated: false, loading: false, token: null });
  };

  const getAuthHeaders = (): HeadersInit => {
    const token = state.token || localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return { ...state, login, logout, getAuthHeaders };
}
