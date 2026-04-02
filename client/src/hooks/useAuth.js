import { useContext, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/context/AuthContext';
import { authService } from '@/services/authService';

export function useAuth() {
  const { user, setUser, isAuthenticated, isInitializing } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (userId, password) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await authService.login({ userId, password });
        setUser({ userId, role: data.role, token: data.token });
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser]
  );

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    isInitializing,
    isTruckOwner: user?.role === 'TRUCK_OWNER',
    isBusinessUser: user?.role === 'BUSINESS_USER',
    isDriver: user?.role === 'DRIVER',
    isLoading,
    error,
    login,
    register,
    logout,
  };
}

export function useDrivers() {
  return useQuery({
    queryKey: ['users', 'drivers'],
    queryFn: () => authService.getDrivers(),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}
