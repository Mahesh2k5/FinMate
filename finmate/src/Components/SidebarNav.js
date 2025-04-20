import React from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTachometerAlt, FaWallet, FaChartPie, FaCog, FaHistory } from "react-icons/fa";
import "./SidebarNav.css";

function SidebarNav({ expanded, setExpanded }) {
  return (
    <aside className={`sidebar-nav ${expanded ? "expanded" : "collapsed"}`}>
      <button className="sidebar-toggle" onClick={() => setExpanded(e => !e)}>
        <FaBars />
      </button>
      <div className="sidebar-links">
        <NavLink to="/dashboard" className="sidebar-link">
          <FaTachometerAlt className="sidebar-icon" />
          {expanded && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/transaction-management" className="sidebar-link">
          <FaWallet className="sidebar-icon" />
          {expanded && <span>Transactions</span>}
        </NavLink>
        <NavLink to="/budget" className="sidebar-link">
          <FaChartPie className="sidebar-icon" />
          {expanded && <span>Budgeting</span>}
        </NavLink>
        <NavLink to="/transactions" className="sidebar-link">
          <FaHistory className="sidebar-icon" />
          {expanded && <span>Transaction History</span>}
        </NavLink>
        <NavLink to="/settings" className="sidebar-link">
          <FaCog className="sidebar-icon" />
          {expanded && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}

export default SidebarNav;
