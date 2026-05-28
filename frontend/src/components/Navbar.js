import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import './Navbar.css'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { totalItems } = useSelector((s) => s.cart)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setDropOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="brand-icon">🛍️</span>
          <span>ShopEase</span>
        </Link>

        <div className="navbar__search">
          <input
            type="text"
            placeholder="Search products..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/products?keyword=${e.target.value.trim()}`)
                e.target.value = ''
              }
            }}
          />
          <span className="search-icon">🔍</span>
        </div>

        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products" className="navbar__link" onClick={() => setMenuOpen(false)}>Products</Link>

          <Link to="/cart" className="navbar__link navbar__cart" onClick={() => setMenuOpen(false)}>
            <span>🛒</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="navbar__dropdown" onMouseLeave={() => setDropOpen(false)}>
              <button className="navbar__user-btn" onClick={() => setDropOpen(!dropOpen)}>
                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span>{user.name?.split(' ')[0]}</span>
                <span>▾</span>
              </button>
              {dropOpen && (
                <div className="dropdown__menu">
                  <Link to="/profile" onClick={() => setDropOpen(false)}>👤 My Profile</Link>
                  <Link to="/profile" onClick={() => setDropOpen(false)}>📦 My Orders</Link>
                  <Link to="/wishlist" onClick={() => setDropOpen(false)}>❤️ Wishlist</Link>
                  {user.isAdmin && (
                    <>
                      <hr />
                      <Link to="/admin" onClick={() => setDropOpen(false)}>🛠️ Admin Dashboard</Link>
                    </>
                  )}
                  <hr />
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
