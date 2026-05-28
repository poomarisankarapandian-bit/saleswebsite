import React from 'react'
import { Link } from 'react-router-dom'

export default function WishlistPage() {
  return (
    <div className="page container" style={{textAlign:'center', paddingTop:'60px'}}>
      <div style={{fontSize:'70px'}}>❤️</div>
      <h2 style={{margin:'20px 0 10px'}}>Your Wishlist</h2>
      <p style={{color:'var(--text-muted)', marginBottom:'24px'}}>Connect wishlist to your profile to save favourites!</p>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  )
}
