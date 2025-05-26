import React, { createContext, useReducer, useContext, useEffect } from 'react';
import api from '../services/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Create context
const AuthContext = createContext(initialState);

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Validate token and get user data
  const validateToken = async (token) => {
    if (!token) {
      dispatch({ type: 'LOGOUT' });
      return;
    }

    try {
      // Instead of validating the token separately, we'll try to get user data
      // This assumes your backend will return 401 if the token is invalid
      const res = await api.get('/auth/user');
      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...res.data, token } });
    } catch (error) {
      console.error('Token validation error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in the API instance
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      validateToken(token);
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Register user
  const register = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/auth/register', formData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAIL', 
        payload: error.response?.data?.message || 'Registration failed' 
      });
      throw error;
    }
  };

  // Login user
  const login = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/auth/login', formData);
      // Set the token in the API instance immediately after login
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAIL', 
        payload: error.response?.data?.message || 'Invalid credentials' 
      });
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    // Clear the Authorization header
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
