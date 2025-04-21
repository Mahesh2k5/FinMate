import React, { useState, useMemo } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { FaBell, FaChartLine, FaCalendarAlt, FaLightbulb } from "react-icons/fa";
import "./Budget.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
    getCategoryProgress,
    transactions 
  } = useTransactions();
  
  // Local state
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Housing");
  const [budgetPeriod, setBudgetPeriod] = useState("monthly");
  const [showAlerts, setShowAlerts] = useState(false);
  
  // Common categories with icons and colors
  const categories = [
    { name: "Housing", color: "#e74c3c" },
    { name: "Food", color: "#2ecc71" },
    { name: "Transport", color: "#3498db" },
    { name: "Entertainment", color: "#9b59b6" },
    { name: "Utilities", color: "#f1c40f" },
    { name: "Healthcare", color: "#1abc9c" }
  ];

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

  // Calculate budget recommendations
  const getBudgetRecommendations = () => {
    const recommendations = [];
    const totalExpenses = expense;
    const totalIncome = income;

    // Calculate spending ratio
    const spendingRatio = totalExpenses / totalIncome;
    
    if (spendingRatio > 0.8) {
      recommendations.push({
        type: "warning",
        message: "Your spending is high relative to income. Consider reducing expenses."
      });
    }

    // Check category-specific recommendations
    categories.forEach(category => {
      const progress = getCategoryProgress(category.name);
      if (progress > 90) {
        recommendations.push({
          type: "alert",
          message: `${category.name} budget is almost depleted (${progress}% used)`
        });
      }
    });

    return recommendations;
  };

  // Memoize chart data for budget usage
  const budgetUsageData = useMemo(() => ({
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: "Budget Used (%)",
        data: categories.map(cat => getCategoryProgress(cat.name)),
        backgroundColor: categories.map(cat => cat.color)
      }
    ]
  }), [goals, getCategoryProgress]);

  // Memoize chart data for spending trends
  const spendingTrendsData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse();

    return {
      labels: last6Months,
      datasets: [
        {
          label: "Income",
          data: last6Months.map(() => Math.random() * 5000 + 3000), // Dummy data
          borderColor: "#2ecc71",
          tension: 0.4
        },
        {
          label: "Expenses",
          data: last6Months.map(() => Math.random() * 4000 + 2000), // Dummy data
          borderColor: "#e74c3c",
          tension: 0.4
        }
      ]
    };
  }, []);

  const chartOptions = {
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
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Income vs Expenses Trend"
      }
    }
  };

  const recommendations = getBudgetRecommendations();

  return (
    <div className="budgeting-container">
      <div className="budget-header">
        <h1>Budget Management</h1>
        <div className="budget-period-selector">
          <button 
            className={budgetPeriod === "monthly" ? "active" : ""}
            onClick={() => setBudgetPeriod("monthly")}
          >
            Monthly
          </button>
          <button 
            className={budgetPeriod === "quarterly" ? "active" : ""}
            onClick={() => setBudgetPeriod("quarterly")}
          >
            Quarterly
          </button>
          <button 
            className={budgetPeriod === "yearly" ? "active" : ""}
            onClick={() => setBudgetPeriod("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="budget-grid">
        <div className="budget-goal-card">
          <h2>Set Your Budget Goals</h2>
          <form onSubmit={handleSetGoal}>
            <div className="form-group">
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
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <div className="budget-categories">
                {categories.map(cat => (
                  <label 
                    key={cat.name} 
                    className="budget-radio"
                    style={{ 
                      backgroundColor: selectedCategory === cat.name ? cat.color : 'transparent',
                      borderColor: cat.color
                    }}
                  >
                    <input
                      type="radio"
                      value={cat.name}
                      checked={selectedCategory === cat.name}
                      onChange={() => setSelectedCategory(cat.name)}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
            
            <button className="set-goal-btn" type="submit">Set Goal</button>
          </form>
          
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

        <div className="budget-progress-section">
          <div className="budget-charts">
            <div className="chart-container">
              <h3>Budget Usage</h3>
              <Bar data={budgetUsageData} options={chartOptions} />
            </div>
            <div className="chart-container">
              <h3>Spending Trends</h3>
              <Line data={spendingTrendsData} options={trendOptions} />
            </div>
          </div>

          <div className="category-progress-list">
            {categories.map(category => {
              const progress = getCategoryProgress(category.name);
              const goalAmount = goals.find(g => g.category === category.name)?.amount || 0;
              
              return (
                <div key={category.name} className="category-progress">
                  <div className="category-header">
                    <span>{category.name}</span>
                    {goalAmount > 0 && (
                      <span className="goal-amount">Goal: ${goalAmount.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: category.color
                      }}
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

        <div className="budget-insights">
          <div className="insights-header">
            <h3><FaLightbulb /> Budget Insights</h3>
            <button 
              className="alert-toggle"
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <FaBell />
            </button>
          </div>
          
          {showAlerts && (
            <div className="recommendations-list">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className={`recommendation ${rec.type}`}
                >
                  {rec.message}
                </div>
              ))}
            </div>
          )}
          
          <div className="budget-tips">
            <h4>Tips to Stay Within Budget</h4>
            <ul>
              <li>Track your daily expenses</li>
              <li>Set realistic budget goals</li>
              <li>Review your spending patterns regularly</li>
              <li>Look for areas to cut back</li>
              <li>Save for unexpected expenses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;
