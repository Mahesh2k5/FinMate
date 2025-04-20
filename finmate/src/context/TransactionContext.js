import React, { createContext, useReducer, useContext, useEffect } from 'react';
import api from '../services/api';

// Initial state
const initialState = {
  transactions: [],
  goals: [],
  income: 0,
  expense: 0,
  balance: 0,
  loading: true,
  error: null
};

// Create context
const TransactionContext = createContext(initialState);

// Reducer
const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        loading: false
      };
    case 'SET_GOALS':
      return {
        ...state,
        goals: action.payload,
        loading: false
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t._id !== action.payload)
      };
    case 'SET_GOAL':
      const existingGoalIndex = state.goals.findIndex(g => g.category === action.payload.category);
      
      let updatedGoals;
      if (existingGoalIndex >= 0) {
        updatedGoals = [...state.goals];
        updatedGoals[existingGoalIndex] = action.payload;
      } else {
        updatedGoals = [...state.goals, action.payload];
      }
      
      return {
        ...state,
        goals: updatedGoals
      };
    case 'CALCULATE_TOTALS':
      const { income, expense } = state.transactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += parseFloat(transaction.amount);
        } else {
          acc.expense += parseFloat(transaction.amount);
        }
        return acc;
      }, { income: 0, expense: 0 });
      
      return {
        ...state,
        income,
        expense,
        balance: income - expense
      };
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions');
        dispatch({ type: 'SET_TRANSACTIONS', payload: res.data });
        dispatch({ type: 'CALCULATE_TOTALS' });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Error fetching transactions' });
      }
    };
    
    const fetchGoals = async () => {
      try {
        const res = await api.get('/budgets');
        dispatch({ type: 'SET_GOALS', payload: res.data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Error fetching goals' });
      }
    };

    fetchTransactions();
    fetchGoals();
  }, []);

  // Add transaction
  const addTransaction = async (transaction) => {
    try {
      const res = await api.post('/transactions', transaction);
      dispatch({ type: 'ADD_TRANSACTION', payload: res.data });
      dispatch({ type: 'CALCULATE_TOTALS' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Error adding transaction' });
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      dispatch({ type: 'CALCULATE_TOTALS' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Error deleting transaction' });
    }
  };

  // Set budget goal
  const setGoal = async (category, amount) => {
    try {
      const res = await api.post('/budgets', { category, amount });
      dispatch({ type: 'SET_GOAL', payload: res.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Error setting goal' });
    }
  };

  // Calculate category spending
  const getCategorySpent = (category) => {
    return state.transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((total, t) => total + parseFloat(t.amount), 0);
  };

  // Calculate budget progress
  const getCategoryProgress = (category) => {
    const goal = state.goals.find(g => g.category === category);
    if (!goal || goal.amount === 0) return 0;
    
    const spent = getCategorySpent(category);
    return Math.min(Math.round((spent / goal.amount) * 100), 100);
  };

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        addTransaction,
        deleteTransaction,
        setGoal,
        getCategorySpent,
        getCategoryProgress
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
