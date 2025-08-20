import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../config/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
}

type AuthAction = 
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ONBOARDING_STATUS'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true, // Start with loading true to check auth status
  error: null,
  onboardingCompleted: localStorage.getItem('onboardingCompleted') === 'true',
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
        onboardingCompleted: action.payload.user.onboardingCompleted || false,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('onboardingCompleted');
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
        onboardingCompleted: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_ONBOARDING_STATUS':
      localStorage.setItem('onboardingCompleted', action.payload.toString());
      return { 
        ...state, 
        onboardingCompleted: action.payload,
        user: state.user ? { ...state.user, onboardingCompleted: action.payload } : null
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, companyName: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Function to check if token is valid and get user info
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Verify token with server
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        dispatch({ 
          type: 'SET_USER', 
          payload: { user: userData, token } 
        });
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('onboardingCompleted');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('onboardingCompleted');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.login({ email, password });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      dispatch({ 
        type: 'SET_USER', 
        payload: { user: data.user, token: data.token } 
      });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, companyName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.register({ email, password, companyName });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      dispatch({ 
        type: 'SET_USER', 
        payload: { user: data.user, token: data.token } 
      });
      
      // New users need to complete onboarding
      dispatch({ type: 'SET_ONBOARDING_STATUS', payload: false });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const completeOnboarding = () => {
    dispatch({ type: 'SET_ONBOARDING_STATUS', payload: true });
  };

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      state, 
      login, 
      register, 
      logout, 
      completeOnboarding,
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};