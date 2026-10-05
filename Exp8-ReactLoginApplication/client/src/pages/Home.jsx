import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

function Home({ user, onLogout }) {
  const navigate = useNavigate()

  const storedUser = user || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <>
      {/* Subtle home background */}
      <div className="home-bg" />

      <Navbar onLogout={handleLogout} />

      <div className="home-page">
        {/* Hero section */}
        <div className="home-hero">
          <h1 className="home-hero-title">Dashboard</h1>
          <p className="home-hero-sub">Welcome to your secure space &#128274;</p>
        </div>

        {/* User welcome card */}
        <div className="home-card">
          <div className="home-icon">&#128274;</div>
          <h2 className="home-welcome">Hello, {storedUser?.name || 'User'}!</h2>
          <p className="home-message">You are successfully authenticated.</p>
          {storedUser?.email && (
            <span className="home-email">{storedUser.email}</span>
          )}
          <br />
          <button className="btn-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {/* Stats / feature cards */}
        <div className="home-stats">
          <div className="stat-card">
            <span className="stat-icon">&#128274;</span>
            <span className="stat-value">256-bit</span>
            <span className="stat-label">Encryption</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#9889;</span>
            <span className="stat-value">&lt;50ms</span>
            <span className="stat-label">Response Time</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#128200;</span>
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
