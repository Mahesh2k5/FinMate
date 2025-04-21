import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SidebarNav from "../components/SidebarNav";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dashboard from "../pages/Dashboard/Dashboard";
import TransactionManagement from "../pages/TransactionManagement/TransactionManagement";
import Settings from "../pages/Settings/Settings";
import Budget from "../pages/Budget/Budget";
import TransactionHistory from "../pages/TransactionHistory/TransactionHistory";

function MainLayout({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#222" }}>
      <SidebarNav expanded={expanded} setExpanded={setExpanded} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: "64px", marginLeft: expanded ? 180 : 70 }}>
        <Navbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            overflowX: "hidden"
          }}
        >
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
