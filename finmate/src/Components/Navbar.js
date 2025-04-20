import React from "react";
import "./Navbar.css";
import logo from "../assets/finmate-logo.png"
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="FinMate Logo" className="navbar-logo-img" />
        <span className="navbar-title">FinMate</span>
      </div>
      <nav className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </nav>
    </header>
  );
}

export default Navbar;
