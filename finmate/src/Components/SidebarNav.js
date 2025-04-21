import React from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTachometerAlt, FaWallet, FaCog, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import "./SidebarNav.css";

function SidebarNav({ expanded, setExpanded }) {
  return (
    <aside className={`sidebar-nav ${expanded ? "expanded" : "collapsed"}`}>
      <button className="sidebar-toggle" onClick={() => setExpanded(e => !e)}>
        <FaBars />
      </button>
      <div className="sidebar-links">
        <NavLink to="/" className="sidebar-link" end>
          <FaTachometerAlt className="sidebar-icon" />
          {expanded && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/transactionmanagement" className="sidebar-link">
          <FaWallet className="sidebar-icon" />
          {expanded && <span>Transactions</span>}
        </NavLink>
        <NavLink to="/settings" className="sidebar-link">
          <FaCog className="sidebar-icon" />
          {expanded && <span>Settings</span>}
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
    </aside>
  );
}

export default SidebarNav;
