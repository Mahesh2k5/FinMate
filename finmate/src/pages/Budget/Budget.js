import React, { useState, useMemo } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "./Budget.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Budget() {
  // Access global state
  const { 
    balance, 
    income, 
    expense, 
    setGoal, 
    goals, 
    getCategoryProgress 
  } = useTransactions();
  
  // Local state
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Housing");
  
  // Common categories
  const categories = ["Housing", "Food", "Transport", "Entertainment"];

  // Set a budget goal
  const handleSetGoal = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    setGoal(selectedCategory, parseFloat(amount));
    setAmount("");
  };

  // Memoize chart data to update on goals or transactions change
  const chartData = useMemo(() => ({
    labels: categories,
    datasets: [
      {
        label: "Budget Used (%)",
        data: categories.map(cat => getCategoryProgress(cat)),
        backgroundColor: "rgba(53, 162, 235, 0.5)"
      }
    ]
  }), [goals, getCategoryProgress]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Budget Usage Progress by Category"
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: function(value) {
            return value + "%";
          }
        }
      }
    }
  }), []);

  return (
    <div className="budgeting-container">
      <div className="budget-goal-card">
        <h2>Set Your Monthly Goals</h2>
        <form onSubmit={handleSetGoal}>
          <label>Budget Amount</label>
          <div className="budget-amount-row">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="budget-amount-input"
            />
          </div>
          
          <label>Category</label>
          <div className="budget-categories">
            {categories.map(cat => (
              <label key={cat} className="budget-radio">
                <input
                  type="radio"
                  value={cat}
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
          
          <button className="set-goal-btn" type="submit">Set Goal</button>
        </form>
        
        {/* Display summary of current finances */}
        <div className="budget-summary">
          <h3>Financial Summary</h3>
          <div className="summary-item">
            <span>Balance:</span>
            <span className="amount">${balance.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Income:</span>
            <span className="amount income">${income.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Expenses:</span>
            <span className="amount expense">${expense.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="budget-progress-card">
        <h2>Progress Overview</h2>
        <Bar data={chartData} options={options} />
        {categories.map(category => {
          const progress = getCategoryProgress(category);
          const goalAmount = goals.find(g => g.category === category)?.amount || 0;
          
          return (
            <div key={category} className="category-progress">
              <div className="category-header">
                <span>{category}</span>
                {goalAmount > 0 && (
                  <span className="goal-amount">Goal: ${goalAmount.toFixed(2)}</span>
                )}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {progress}% of budget used
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Budget;
