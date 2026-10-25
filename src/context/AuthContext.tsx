import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/schema';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('loka_token') || localStorage.getItem('lokalsite_token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getMe(token);
        setUser(data.user);
      } catch (err) {
        console.error('Failed to load authenticated user session:', err);
        localStorage.removeItem('lokalsite_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('loka_token', newToken);
    localStorage.setItem('lokalsite_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    if (token) {
      try {
        await authService.logout(token);
      } catch {
        // Silently ignore network failures on logout
      }
    }
    localStorage.removeItem('loka_token');
    localStorage.removeItem('lokalsite_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
