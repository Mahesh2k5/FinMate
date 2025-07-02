import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  user: { _id: '1', name: 'Demo User', email: 'demo@finmate.com' },
  isAuthenticated: true,
  loading: false,
  error: null
};

// Create context
const AuthContext = createContext(initialState);

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
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

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock register
  const register = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    setTimeout(() => {
      dispatch({ type: 'REGISTER_SUCCESS', payload: { ...formData, _id: '2' } });
    }, 500);
    return { ...formData, _id: '2' };
  };

  // Mock login
  const login = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    setTimeout(() => {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { _id: '1', name: 'Demo User', email: 'demo@finmate.com' } });
    }, 500);
    return { _id: '1', name: 'Demo User', email: 'demo@finmate.com' };
  };

  // Mock logout
  const logout = () => {
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
