import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const getStoredValue = (key, fallback = null) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredValue('nail-shop-user', null));
  const [token, setToken] = useState(() => getStoredValue('nail-shop-token', ''));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.setToken(token);
      window.localStorage.setItem('nail-shop-token', JSON.stringify(token));
    } else {
      api.clearToken();
      window.localStorage.removeItem('nail-shop-token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('nail-shop-user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('nail-shop-user');
    }
  }, [user]);

  const getCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data?.user || null);
      return response.data?.user || null;
    } catch (error) {
      setUser(null);
      setToken('');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const authUser = response.data?.user;

    if (!authUser?.token) {
      throw new Error('Login failed');
    }

    const { token: authToken, ...safeUser } = authUser;
    setToken(authToken);
    setUser(safeUser);
    return safeUser;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const authUser = response.data?.user;

    if (!authUser?.token) {
      throw new Error('Registration failed');
    }

    const { token: authToken, ...safeUser } = authUser;
    setToken(authToken);
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      getCurrentUser,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}

export default AuthContext;
