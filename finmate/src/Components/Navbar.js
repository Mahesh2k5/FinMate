import React from "react";
import "./Navbar.css";
import logo from "../assets/finmate-logo.png"
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="FinMate Logo" className="navbar-logo-img" />
          <span className="navbar-title">FinMate</span>
        </Link>
      </div>
      <nav className="navbar-links">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/transactionhistory" className="nav-link">Transactions</Link>
        <Link to="/settings" className="nav-link">Settings</Link>
      </nav>
    </header>
  );
}

export default Navbar;
