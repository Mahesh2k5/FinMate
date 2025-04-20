import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Budget from './pages/Budget/Budget';
import TransactionHistory from './pages/TransactionHistory/TransactionHistory';
import TransactionManagement from './pages/TransactionManagement/TransactionManagement';
import Settings from './pages/Settings/Settings';
import PrivateRoute from './Components/PrivateRoute';
import MainLayout from './Layouts/MainLayout';

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="/transaction-management" element={<TransactionManagement />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
