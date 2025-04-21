import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import { CategoryProvider } from './context/CategoryContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './Layouts/MainLayout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import TransactionManagement from './pages/TransactionManagement/TransactionManagement';
import Settings from './pages/Settings/Settings';
import Budget from './pages/Budget/Budget';
import TransactionHistory from './pages/TransactionHistory/TransactionHistory';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <TransactionProvider>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
                <Route path="/transactionmanagement" element={<PrivateRoute><MainLayout><TransactionManagement /></MainLayout></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><MainLayout><Settings /></MainLayout></PrivateRoute>} />
                <Route path="/budget" element={<PrivateRoute><MainLayout><Budget /></MainLayout></PrivateRoute>} />
                <Route path="/transactionhistory" element={<PrivateRoute><MainLayout><TransactionHistory /></MainLayout></PrivateRoute>} />
              </Routes>
            </div>
          </TransactionProvider>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
