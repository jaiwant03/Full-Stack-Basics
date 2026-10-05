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
      <Navbar />
      <div className="home-page">
        <div className="home-card">
          <div className="home-icon">&#128274;</div>
          <h1 className="home-welcome">Welcome, {storedUser?.name || 'User'}!</h1>
          <p className="home-message">You are successfully authenticated.</p>
          {storedUser?.email && (
            <p className="home-email">{storedUser.email}</p>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default Home
