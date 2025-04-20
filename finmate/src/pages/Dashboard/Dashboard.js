import React from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "../../context/TransactionContext";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const { 
    transactions, 
    balance, 
    income, 
    expense, 
    goals 
  } = useTransactions();

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Data for Pie chart
  const data = {
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>FinMate Dashboard</h1>
        <p>Welcome to your financial overview</p>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card balance">
          <h2>Total Balance</h2>
          <div className="amount">${balance.toFixed(2)}</div>
        </div>
        <div className="summary-card income">
          <h2>Total Income</h2>
          <div className="amount">${income.toFixed(2)}</div>
        </div>
        <div className="summary-card expense">
          <h2>Total Expenses</h2>
          <div className="amount">${expense.toFixed(2)}</div>
        </div>
      </div>

      <div className="dashboard-chart">
        <h2>Money Usage Stats</h2>
        <Pie data={data} />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-transactions">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/transactions" className="view-all">View All</Link>
          </div>
          
          {recentTransactions.length === 0 ? (
            <p className="empty-message">No transactions yet. Add your first transaction!</p>
          ) : (
            <div className="transaction-list">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-details">
                    <div className="transaction-name">{transaction.name}</div>
                    <div className="transaction-category">{transaction.category}</div>
                  </div>
                  <div className="transaction-amount">
                    {transaction.type === 'expense' ? '-' : '+'} 
                    ${parseFloat(transaction.amount).toFixed(2)}
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
                    <div className="goal-amount">${goal.amount.toFixed(2)}</div>
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
