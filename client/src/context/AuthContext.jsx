import { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Rehydrate from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (token && userId && userRole) {
      setUserState({ token, userId, role: userRole });
    }
    setIsInitializing(false);
  }, []);

  const setUser = useCallback((userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('userRole', userData.role);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    }
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated: !!user?.token,
    isInitializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
