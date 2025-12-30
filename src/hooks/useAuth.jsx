/**
 * Auth Hook
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout, isLoggedIn } from '../api/authApi';
import { trackLogin, trackRegister, trackLogout, trackCourseAccess, identifyUser, setUserProperties } from '../utils/clarity';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde kullanıcıyı kontrol et
  useEffect(() => {
    const checkAuth = async () => {
      if (isLoggedIn()) {
        try {
          const userData = await getMe();
          setUser(userData);
          // Clarity: Kullanıcıyı tanımla
          identifyUser(userData.id, userData.email);
          setUserProperties({
            has_access: userData.has_access,
            is_verified: userData.is_verified,
          });
          trackCourseAccess(userData.has_access);
        } catch (error) {
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await apiLogin(email, password);
    const userData = await getMe();
    setUser(userData);
    // Clarity: Login event
    trackLogin(userData.id, userData.email);
    setUserProperties({
      has_access: userData.has_access,
      is_verified: userData.is_verified,
    });
    return result;
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    const result = await apiRegister(email, password, fullName);
    // Clarity: Register event (henüz user id yok, email ile tanımla)
    trackRegister('new', email);
    return result;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    // Clarity: Logout event
    trackLogout();
  }, []);

  const refreshUser = useCallback(async () => {
    if (isLoggedIn()) {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
