import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTachometerAlt, FaWallet, FaCog, FaChartLine, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./SidebarNav.css";

function SidebarNav({ expanded, setExpanded }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar-nav ${expanded ? "expanded" : "collapsed"}`}>
      <button className="sidebar-toggle" onClick={() => setExpanded(e => !e)}>
        <FaBars />
      </button>
      <div className="sidebar-links">
        <div className="nav-links-top">
          <NavLink to="/" className="sidebar-link" end>
            <FaTachometerAlt className="sidebar-icon" />
            {expanded && <span>Dashboard</span>}
          </NavLink>
          <NavLink to="/transactionmanagement" className="sidebar-link">
            <FaWallet className="sidebar-icon" />
            {expanded && <span>Transactions</span>}
          </NavLink>
          <NavLink to="/budget" className="sidebar-link">
            <FaChartLine className="sidebar-icon" />
            {expanded && <span>Budget</span>}
          </NavLink>
          <NavLink to="/transactionhistory" className="sidebar-link">
            <FaCalendarAlt className="sidebar-icon" />
            {expanded && <span>Transaction History</span>}
          </NavLink>
        </div>
        <div className="nav-links-bottom">
          <NavLink to="/settings" className="sidebar-link">
            <FaCog className="sidebar-icon" />
            {expanded && <span>Settings</span>}
          </NavLink>
          <button 
            className="sidebar-link logout-link" 
            onClick={handleLogout}
          >
            <FaSignOutAlt className="sidebar-icon" />
            {expanded && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SidebarNav;
