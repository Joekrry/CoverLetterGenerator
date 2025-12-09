import { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = authService.getUser();
    const accessToken = authService.getAccessToken();
    
    if (savedUser && accessToken && !authService.isTokenExpired()) {
      setUser(savedUser);
    }
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      authService.saveTokens(data.tokens);
      localStorage.setItem('user_email', data.user.email);
      localStorage.setItem('user_id', data.user.id);
      setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: ({ email, password }) => authService.register(email, password),
    onSuccess: (data) => {
      authService.saveTokens(data.tokens);
      localStorage.setItem('user_email', data.user.email);
      localStorage.setItem('user_id', data.user.id);
      setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });

  // Logout function
  const logout = () => {
    authService.clearTokens();
    setUser(null);
    queryClient.setQueryData(['user'], null);
    queryClient.clear();
  };

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: (refreshToken) => authService.refreshToken(refreshToken),
    onSuccess: (data) => {
      authService.saveTokens(data.tokens);
    },
    onError: () => {
      logout();
    },
  });

  const value = {
    user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    refreshToken: refreshTokenMutation.mutateAsync,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

