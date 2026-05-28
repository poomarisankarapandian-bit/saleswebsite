import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQty, clearCart } from '../features/cart/cartSlice'
import './CartPage.css'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, itemsPrice, shippingPrice, taxPrice, totalItems } = useSelector((s) => s.cart)
  const { user } = useSelector((s) => s.auth)

  const total = itemsPrice + shippingPrice + taxPrice

  if (items.length === 0) {
    return (
      <div className="page container" style={{textAlign:'center', paddingTop:'80px'}}>
        <div style={{fontSize:'80px'}}>🛒</div>
        <h2 style={{margin:'20px 0 10px'}}>Your cart is empty</h2>
        <p style={{color:'var(--text-muted)', marginBottom:'24px'}}>Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="cart-page page">
      <div className="container">
        <h1 className="page-title">🛒 My Cart ({totalItems} items)</h1>
        <div className="cart-page__layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item__img" />
                <div className="cart-item__info">
                  <Link to={`/products/${item._id}`} className="cart-item__name">{item.name}</Link>
                  <span className="cart-item__category">{item.category}</span>
                  <div className="cart-item__price">₹{item.price.toLocaleString()}</div>
                </div>
                <div className="cart-item__qty">
                  <button onClick={() => dispatch(updateQty({ id: item._id, qty: Math.max(1, item.qty - 1) }))}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => dispatch(updateQty({ id: item._id, qty: Math.min(item.countInStock, item.qty + 1) }))}>+</button>
                </div>
                <div className="cart-item__subtotal">₹{(item.price * item.qty).toLocaleString()}</div>
                <button className="cart-item__remove" onClick={() => dispatch(removeFromCart(item._id))}>🗑️</button>
              </div>
            ))}
            <button className="btn btn-outline btn-sm" onClick={() => dispatch(clearCart())}>Clear Cart</button>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Items ({totalItems})</span><span>₹{itemsPrice.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shippingPrice === 0 ? <span style={{color:'var(--success)'}}>FREE</span> : `₹${shippingPrice}`}</span></div>
            <div className="summary-row"><span>Tax (5%)</span><span>₹{taxPrice.toLocaleString()}</span></div>
            <hr />
            <div className="summary-row summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            {shippingPrice > 0 && <p className="free-ship-note">Add ₹{(500 - itemsPrice).toLocaleString()} more for FREE shipping!</p>}
            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=checkout')}
            >
              {user ? 'Proceed to Checkout →' : 'Login to Checkout'}
            </button>
            <Link to="/products" className="btn btn-outline btn-full" style={{marginTop:'12px'}}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
