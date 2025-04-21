import React from "react";
import { FaUser, FaCog, FaSignOutAlt, FaMoon, FaBell, FaLock } from "react-icons/fa";
import "./Settings.css";

function Settings() {
  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-grid">
        <div className="settings-section">
          <div className="settings-header">
            <FaUser className="settings-icon" />
            <h3>Profile</h3>
          </div>
          <p>Update your profile info here (feature coming soon).</p>
        </div>
        
        <div className="settings-section">
          <div className="settings-header">
            <FaMoon className="settings-icon" />
            <h3>Appearance</h3>
          </div>
          <p>Customize your app theme and display preferences (feature coming soon).</p>
        </div>

        <div className="settings-section">
          <div className="settings-header">
            <FaBell className="settings-icon" />
            <h3>Notifications</h3>
          </div>
          <p>Manage your notification preferences (feature coming soon).</p>
        </div>

        <div className="settings-section">
          <div className="settings-header">
            <FaLock className="settings-icon" />
            <h3>Security</h3>
          </div>
          <p>Manage your account security settings (feature coming soon).</p>
        </div>

        <div className="settings-section">
          <div className="settings-header">
            <FaCog className="settings-icon" />
            <h3>Preferences</h3>
          </div>
          <p>Configure your app preferences (feature coming soon).</p>
        </div>

        <div className="settings-section">
          <div className="settings-header">
            <FaSignOutAlt className="settings-icon" />
            <h3>Account</h3>
          </div>
          <button className="settings-btn">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
