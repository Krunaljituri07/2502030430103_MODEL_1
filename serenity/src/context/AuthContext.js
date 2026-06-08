import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const API_BASE = '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('serenity_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            setToken(null);
            localStorage.removeItem('serenity_token');
          }
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('serenity_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    return response.json();
  };

  const login = async (email, password) => {
    setError(null);
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('serenity_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, message: data.message || 'Login failed' };
  };

  const register = async (name, email, password, bio) => {
    setError(null);
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, bio }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('serenity_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, message: data.message || 'Signup failed' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('serenity_token');
  };

  const refreshProfile = async () => {
    if (!token) return;
    const data = await authFetch(`${API_BASE}/auth/me`);
    if (data.user) {
      setUser(data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout, authFetch, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
