import React from 'react'

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">&#128274;</span>
        <span className="navbar-title">SecureAuth</span>
      </div>
      {onLogout && (
        <div className="navbar-links">
          <button className="navbar-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
