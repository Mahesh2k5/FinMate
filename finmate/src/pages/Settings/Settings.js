import React from "react";
import "./Settings.css";

function Settings() {
  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Profile</h3>
        <p>Update your profile info here (feature coming soon).</p>
      </div>
      <div className="settings-section">
        <h3>Preferences</h3>
        <p>Theme, notifications, and more (feature coming soon).</p>
      </div>
      <div className="settings-section">
        <h3>Account</h3>
        <button className="settings-btn">Logout</button>
      </div>
    </div>
  );
}

export default Settings;
