import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api.js'

function getStrength(password) {
  if (!password) return null
  if (password.length < 4) return 'weak'
  if (password.length < 6) return 'fair'
  if (password.length < 10) return 'good'
  return 'strong'
}

const strengthMap = {
  weak:   { barClass: 'strength-weak',   labelClass: 'strength-weak-text',   label: 'Weak' },
  fair:   { barClass: 'strength-fair',   labelClass: 'strength-fair-text',   label: 'Fair' },
  good:   { barClass: 'strength-good',   labelClass: 'strength-good-text',   label: 'Good' },
  strong: { barClass: 'strength-strong', labelClass: 'strength-strong-text', label: 'Strong' },
}

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const validate = () => {
    if (!formData.name.trim()) return 'Please enter your full name.'
    if (!formData.email) return 'Please enter your email.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address.'
    if (!formData.password) return 'Please enter a password.'
    if (formData.password.length < 6) return 'Password must be at least 6 characters.'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setLoading(true)
    setError('')
    try {
      const { name, email, password } = formData
      await registerUser({ name, email, password })
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const strength = getStrength(formData.password)
  const strengthInfo = strength ? strengthMap[strength] : null

  return (
    <>
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
      </div>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card-left">
            <div className="auth-brand-icon">&#128274;</div>
            <h1 className="auth-brand-name">SecureAuth</h1>
            <p className="auth-brand-tagline">Your trusted authentication platform</p>
            <p className="auth-brand-desc">
              Create your account and get started in seconds.
            </p>
          </div>

          <div className="auth-card-right">
            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-subtitle">Register a new account</p>

            {error && (
              <div className="alert alert-error">
                <span>&#9888;</span> {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <span>&#10003;</span> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="form-input-wrapper">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                  <span className="form-input-icon">&#128100;</span>
                </div>
              </div>

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
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <span className="form-input-icon">&#128274;</span>
                </div>
                {strengthInfo && (
                  <div>
                    <div className="password-strength">
                      <div className={`password-strength-bar ${strengthInfo.barClass}`} />
                    </div>
                    <span className={`password-strength-label ${strengthInfo.labelClass}`}>
                      {strengthInfo.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="form-input-wrapper">
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <span className="form-input-icon">&#128275;</span>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
