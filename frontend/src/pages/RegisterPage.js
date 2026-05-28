import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../features/auth/authSlice'
import './AuthPage.css'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [confirm, setConfirm] = useState('')

  useEffect(() => { if (user) navigate('/') }, [user, navigate])
  useEffect(() => { return () => dispatch(clearError()) }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== confirm) return alert('Passwords do not match!')
    dispatch(registerUser(form))
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>🛍️ ShopEase</h1>
          <h2>Create Account</h2>
          <p>Join us today!</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Full Name</label><input type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-group"><label>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
          <div className="form-group"><label>Phone</label><input type="tel" placeholder="9876543210" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
          <div className="form-group"><label>Password</label><input type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required /></div>
          <div className="form-group"><label>Confirm Password</label><input type="password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>{loading ? 'Creating...' : 'Create Account →'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  )
}
