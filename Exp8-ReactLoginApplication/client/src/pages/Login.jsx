import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api.js'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const validate = () => {
    if (!formData.email) return 'Please enter your email.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address.'
    if (!formData.password) return 'Please enter your password.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(formData)
      onLogin(res.data.token, res.data.user)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Animated blob background */}
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
      </div>

      <div className="auth-page">
        <div className="auth-card">
          {/* Left gradient panel */}
          <div className="auth-card-left">
            <div className="auth-brand-icon">&#128274;</div>
            <h1 className="auth-brand-name">SecureAuth</h1>
            <p className="auth-brand-tagline">Your trusted authentication platform</p>
            <p className="auth-brand-desc">
              Secure, fast, and reliable authentication for your applications.
            </p>
          </div>

          {/* Right form panel */}
          <div className="auth-card-right">
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">Sign in to your account</p>

            {error && (
              <div className="alert alert-error">
                <span>&#9888;</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  <span className="form-input-icon">&#9993;</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <span className="form-input-icon">&#128274;</span>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch-text">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="auth-switch-link">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
