// src/pages/TransactionManagement/TransactionManagement.js
import React, { useState } from 'react';
import { useCategories } from '../../context/CategoryContext';
import { useTransactions } from '../../context/TransactionContext';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import './TransactionManagement.css';

const TransactionManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { addTransaction, transactions } = useTransactions();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const [editingCategoryType, setEditingCategoryType] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' });
  const [transactionForm, setTransactionForm] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await addCategory(newCategory.name, newCategory.type);
      setNewCategory({ name: '', type: 'expense' });
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const startEditingCategory = (category) => {
    setEditingCategory(category._id);
    setEditingCategoryValue(category.name);
    setEditingCategoryType(category.type);
  };

  const saveEditedCategory = async () => {
    try {
      await updateCategory(editingCategory, editingCategoryValue, editingCategoryType);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const cancelEditing = () => {
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await addTransaction(transactionForm);
      setTransactionForm({
        name: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddTransaction(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');

  return (
    <div className="tm-container">
      <div className="tm-header">
        <h2>Transaction Management</h2>
        <button 
          className="tm-add-transaction-btn"
          onClick={() => setShowAddTransaction(true)}
        >
          Add Transaction
        </button>
      </div>

      <div className="tm-content">
        <div className="tm-categories">
          <h3>Categories</h3>
          
          <div className="tm-category-section">
            <h4>Expense Categories</h4>
            {expenseCategories.map(category => (
              <div key={category._id} className="tm-category-item">
                {editingCategory === category._id ? (
                  <div className="tm-category-edit">
                    <input
                      type="text"
                      value={editingCategoryValue}
                      onChange={(e) => setEditingCategoryValue(e.target.value)}
                    />
                    <div className="tm-category-actions">
                      <button onClick={saveEditedCategory}>
                        <FaCheck />
                      </button>
                      <button onClick={cancelEditing}>
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="tm-category-display">
                    <span>{category.name}</span>
                    <div className="tm-category-actions">
                      <button onClick={() => startEditingCategory(category)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteCategory(category._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="tm-category-section">
            <h4>Income Categories</h4>
            {incomeCategories.map(category => (
              <div key={category._id} className="tm-category-item">
                {editingCategory === category._id ? (
                  <div className="tm-category-edit">
                    <input
                      type="text"
                      value={editingCategoryValue}
                      onChange={(e) => setEditingCategoryValue(e.target.value)}
                    />
                    <div className="tm-category-actions">
                      <button onClick={saveEditedCategory}>
                        <FaCheck />
                      </button>
                      <button onClick={cancelEditing}>
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="tm-category-display">
                    <span>{category.name}</span>
                    <div className="tm-category-actions">
                      <button onClick={() => startEditingCategory(category)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteCategory(category._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleAddCategory} className="tm-add-category-form">
            <h4>Add New Category</h4>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
            <select
              value={newCategory.type}
              onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button type="submit">Add Category</button>
          </form>
        </div>

        <div className="tm-transactions">
          <h3>Recent Transactions</h3>
          <div className="tm-transaction-grid">
            {transactions.slice(0, 5).map(transaction => (
              <div key={transaction._id} className="tm-transaction-card">
                <div className="tm-transaction-header">
                  <h4>{transaction.name}</h4>
                  <span className={`tm-transaction-type ${transaction.type}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="tm-transaction-details">
                  <p>Amount: ${transaction.amount}</p>
                  <p>Category: {transaction.category.name}</p>
                  <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddTransaction && (
        <div className="tm-overlay">
          <div className="tm-form-container">
            <h3>Add Transaction</h3>
            <form onSubmit={handleAddTransaction}>
              <input
                type="text"
                placeholder="Transaction Name"
                value={transactionForm.name}
                onChange={(e) => setTransactionForm({ ...transactionForm, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={transactionForm.amount}
                onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                required
              />
              <select
                value={transactionForm.type}
                onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select
                value={transactionForm.category}
                onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {transactionForm.type === 'expense' 
                  ? expenseCategories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))
                  : incomeCategories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))
                }
              </select>
              <input
                type="date"
                value={transactionForm.date}
                onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                required
              />
              <div className="tm-form-actions">
                <button type="submit">Add Transaction</button>
                <button type="button" onClick={() => setShowAddTransaction(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
