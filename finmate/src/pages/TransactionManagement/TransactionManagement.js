// src/pages/TransactionManagement/TransactionManagement.js
import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './TransactionManagement.css';

function TransactionManagement() {
  // Access the global state functions
  const { addTransaction, transactions, deleteTransaction } = useTransactions();
  
  // Local state for UI
  const [expenseCategories, setExpenseCategories] = useState([
    'Food & Dining',
    'Utilities',
    'Transport',
    'Entertainment'
  ]);
  
  const [incomeCategories, setIncomeCategories] = useState([
    'Salary',
    'Gift',
    'Pocket Money',
    'Freelance'
  ]);

  // State for category editing
  const [editingCategoryIdx, setEditingCategoryIdx] = useState(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    date: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining'
  });

  // Other state
  const [recurringRent, setRecurringRent] = useState(false);

  // Handler for adding a new category
  const handleAddCategory = () => {
    const categoryName = prompt('Enter new category name:');
    if (categoryName && categoryName.trim() !== '') {
      if (newTransaction.type === 'expense') {
        if (!expenseCategories.includes(categoryName)) {
          setExpenseCategories([...expenseCategories, categoryName]);
        }
      } else {
        if (!incomeCategories.includes(categoryName)) {
          setIncomeCategories([...incomeCategories, categoryName]);
        }
      }
    }
  };

  // Category editing functions
  const startEditingCategory = (idx, value) => {
    setEditingCategoryIdx(idx);
    setEditingCategoryValue(value);
  };

  const saveEditedCategory = (idx) => {
    if (editingCategoryValue.trim() === '') return;
    const updated = [...expenseCategories];
    updated[idx] = editingCategoryValue;
    setExpenseCategories(updated);
    setEditingCategoryIdx(null);
    setEditingCategoryValue('');
  };

  const cancelEdit = () => {
    setEditingCategoryIdx(null);
    setEditingCategoryValue('');
  };

  // Type change handler
  const handleTypeChange = (type) => {
    setNewTransaction({
      ...newTransaction,
      type: type,
      category: type === 'expense' ? expenseCategories[0] : incomeCategories[0]
    });
  };

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value
    });
  };

  // Add transaction handler - KEY FUNCTION TO UPDATE GLOBAL STATE
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTransaction.name || !newTransaction.date || !newTransaction.amount) {
      alert('Please fill in all fields');
      return;
    }
    
    // Add to global state through context
    addTransaction(newTransaction);
    
    // Reset form
    setNewTransaction({
      name: '',
      date: '',
      amount: '',
      type: 'expense',
      category: 'Food & Dining'
    });
    
    setShowAddForm(false);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Rest of your component JSX remains mostly the same, just ensure
  // the add transaction form and transaction cards use the right handlers
  
  return (
    <div className="tm-container">
      {/* Left sidebar with categories */}
      <aside className="tm-sidebar">
        {/* Categories sidebar UI */}
        <div className="tm-categories">
          <h2>Categories</h2>
          <ul>
            {expenseCategories.map((category, idx) => (
              <li key={`expense-${category}`} style={{ display: 'flex', alignItems: 'center' }}>
                {editingCategoryIdx === idx ? (
                  <>
                    <input
                      value={editingCategoryValue}
                      onChange={e => setEditingCategoryValue(e.target.value)}
                      style={{ marginRight: 8 }}
                      autoFocus
                    />
                    <button onClick={() => saveEditedCategory(idx)}>
                      <FaCheck />
                    </button>
                    <button onClick={cancelEdit}>
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <span>{category}</span>
                    <button onClick={() => startEditingCategory(idx, category)}>
                      <FaEdit />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <button className="tm-add-category-btn" onClick={handleAddCategory}>
            Add Category
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="tm-main">
        <div className="tm-content">
          <div className="tm-section-header">
            <h2>Transaction Management</h2>
            <button
              className="tm-add-transaction-btn"
              onClick={() => setShowAddForm(true)}
            >
              Add Transaction
            </button>
          </div>

          {/* Add Transaction Form */}
          {showAddForm && (
            <div className="tm-add-form-overlay">
              <div className="tm-add-form">
                <h3>Add New Transaction</h3>
                <form onSubmit={handleAddTransaction}>
                  {/* Form fields remain the same */}
                  <div className="tm-form-row">
                    <div className="tm-form-group">
                      <label>Type</label>
                      <div className="tm-radio-group">
                        <label className="tm-radio">
                          <input
                            type="radio"
                            name="type"
                            value="expense"
                            checked={newTransaction.type === 'expense'}
                            onChange={() => handleTypeChange('expense')}
                          />
                          <span>Expense</span>
                        </label>
                        <label className="tm-radio">
                          <input
                            type="radio"
                            name="type"
                            value="income"
                            checked={newTransaction.type === 'income'}
                            onChange={() => handleTypeChange('income')}
                          />
                          <span>Income</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="tm-form-row">
                    <div className="tm-form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newTransaction.name}
                        onChange={handleInputChange}
                        placeholder="Transaction name"
                        required
                      />
                    </div>

                    <div className="tm-form-group">
                      <label>Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={newTransaction.amount}
                        onChange={handleInputChange}
                        placeholder="Amount"
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="tm-form-row">
                    <div className="tm-form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={newTransaction.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="tm-form-group">
                      <label>Category</label>
                      <select
                        name="category"
                        value={newTransaction.category}
                        onChange={handleInputChange}
                      >
                        {newTransaction.type === 'expense'
                          ? expenseCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))
                          : incomeCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))
                        }
                      </select>
                    </div>
                  </div>

                  <div className="tm-form-buttons">
                    <button type="submit" className="tm-submit-btn">Add</button>
                    <button
                      type="button"
                      className="tm-cancel-btn"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <div className="tm-section">
            <h3 className="tm-section-title">Recent Transactions</h3>
            <div className="tm-transactions-grid">
              {transactions.slice(0, 4).map(transaction => (
                <div
                  key={transaction.id}
                  className={`tm-transaction-card ${transaction.type}`}
                >
                  <div className="tm-transaction-details">
                    <h4>{transaction.name}</h4>
                    <p className="tm-date">
                      {transaction.date.includes('-')
                        ? formatDate(transaction.date)
                        : transaction.date}
                    </p>
                    <p className="tm-amount">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="tm-category">{transaction.category}</p>
                  </div>
                  <button 
                    className="tm-edit-btn"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Other UI elements remain the same */}
        </div>
      </main>
    </div>
  );
}

export default TransactionManagement;
