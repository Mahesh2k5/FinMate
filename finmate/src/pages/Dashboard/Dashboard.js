import React from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "../../context/TransactionContext";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function Dashboard() {
  const { 
    transactions = [], 
    balance = 0, 
    income = 0, 
    expense = 0, 
    goals = [] 
  } = useTransactions();

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Data for Pie chart (Income vs Expenses)
  const pieData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Money Usage",
        data: [income, expense],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)"
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // Data for Bar chart (Category-wise expenses)
  const barData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Others'],
    datasets: [
      {
        label: 'Expenses by Category',
        data: [300, 200, 150, 250, 100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>FinMate Dashboard</h1>
          <p>Welcome to your financial overview</p>
        </div>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card balance">
          <h2>Total Balance</h2>
          <div className="amount">${balance?.toFixed(2) || '0.00'}</div>
          <div className="trend positive">+5.2% from last month</div>
        </div>
        <div className="summary-card income">
          <h2>Total Income</h2>
          <div className="amount">${income?.toFixed(2) || '0.00'}</div>
          <div className="trend positive">+3.1% from last month</div>
        </div>
        <div className="summary-card expense">
          <h2>Total Expenses</h2>
          <div className="amount">${expense?.toFixed(2) || '0.00'}</div>
          <div className="trend negative">-2.4% from last month</div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Income vs Expenses</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart-container">
          <h3>Expenses by Category</h3>
          <Bar data={barData} />
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-transactions">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/transactions" className="view-all">View All</Link>
          </div>
          
          {recentTransactions.length === 0 ? (
            <p className="empty-message">No transactions found.</p>
          ) : (
            <div className="transaction-list">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-details">
                    <div className="transaction-name">{transaction.name}</div>
                    <div className="transaction-category">{transaction.category}</div>
                    <div className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</div>
                  </div>
                  <div className="transaction-amount">
                    {transaction.type === 'expense' ? '-' : '+'} 
                    ${transaction.amount !== undefined && !isNaN(parseFloat(transaction.amount)) ? parseFloat(transaction.amount).toFixed(2) : '0.00'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="dashboard-goals">
          <div className="section-header">
            <h2>Budget Goals</h2>
            <Link to="/budget" className="view-all">Manage</Link>
          </div>
          
          {goals.length === 0 ? (
            <p className="empty-message">No budget goals set. Create your first budget goal!</p>
          ) : (
            <div className="goals-list">
              {goals.map(goal => (
                <div key={goal.category} className="goal-item">
                  <div className="goal-details">
                    <div className="goal-category">{goal.category}</div>
                    <div className="goal-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(goal.spent / goal.amount) * 100}%` }}
                        ></div>
                      </div>
                      <div className="goal-amounts">
                        <span>${goal.spent !== undefined ? goal.spent.toFixed(2) : '0.00'}</span>
                        <span>${goal.amount !== undefined ? goal.amount.toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
