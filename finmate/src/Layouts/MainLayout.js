import React, { useState } from "react";
import SidebarNav from "../Components/SidebarNav";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
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
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
