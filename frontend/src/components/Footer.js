import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <h3>🛍️ ShopEase</h3>
          <p>Your one-stop destination for everything you need. Quality products, fast delivery.</p>
        </div>
        <div className="footer__links">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Clothing">Clothing</Link>
          <Link to="/products?category=Footwear">Footwear</Link>
        </div>
        <div className="footer__links">
          <h4>Account</h4>
          <Link to="/profile">My Profile</Link>
          <Link to="/profile">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="footer__links">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Returns</a>
          <a href="#">Track Order</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2024 ShopEase. All rights reserved.</p>
        <p>Made with ❤️ using React + Redux Toolkit + MongoDB</p>
      </div>
    </footer>
  )
}
