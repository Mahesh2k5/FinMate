// src/pages/TransactionHistory/TransactionHistory.js
import React, { useState } from "react";
import { useTransactions } from "../../context/TransactionContext";
import "./TransactionHistory.css";

function TransactionHistory() {
  const { transactions, deleteTransaction, balance } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(tx => 
    tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="th-container">
      <aside className="th-sidebar">
        <h2>Filter Options</h2>
        <div className="th-search">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="th-search-input"
          />
        </div>
        <div className="th-balance">
          <h3>Current Balance</h3>
          <div className="th-balance-amount">${balance.toFixed(2)}</div>
        </div>
      </aside>
      
      <main className="th-main">
        <h2 className="th-title">Transaction History</h2>
        
        {filteredTransactions.length === 0 ? (
          <div className="th-empty">
            <p>No transactions found. Add some transactions to get started!</p>
          </div>
        ) : (
          <div className="th-list">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className={`th-item ${transaction.type}`}
              >
                <div className="th-item-left">
                  <div className="th-name">{transaction.name}</div>
                  <div className="th-date">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                  <div className="th-category">{transaction.category}</div>
                </div>
                <div className="th-item-right">
                  <span className={`th-amount ${transaction.type}`}>
                    {transaction.type === 'expense' ? '-' : '+'} 
                    ${parseFloat(transaction.amount).toFixed(2)}
                  </span>
                  <button 
                    className="th-delete"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default TransactionHistory;
