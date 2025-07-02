import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  transactions: [
    { _id: 't1', name: 'Grocery Shopping', amount: 50, type: 'expense', category: '1', date: new Date().toISOString() },
    { _id: 't2', name: 'Bus Ticket', amount: 10, type: 'expense', category: '2', date: new Date().toISOString() },
    { _id: 't3', name: 'Monthly Salary', amount: 2000, type: 'income', category: '3', date: new Date().toISOString() }
  ],
  goals: [
    { _id: 'g1', category: '1', amount: 300 },
    { _id: 'g2', category: '2', amount: 100 }
  ],
  income: 2000,
  expense: 60,
  balance: 1940,
  loading: false,
  error: null
};

const TransactionContext = createContext(initialState);

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

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Add transaction
  const addTransaction = async (transaction) => {
    const newTransaction = { ...transaction, _id: Date.now().toString(), date: new Date().toISOString() };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    dispatch({ type: 'CALCULATE_TOTALS' });
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    dispatch({ type: 'CALCULATE_TOTALS' });
  };

  // Set budget goal
  const setGoal = async (category, amount) => {
    const newGoal = { _id: Date.now().toString(), category, amount };
    dispatch({ type: 'SET_GOAL', payload: newGoal });
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
