import React from 'react'
import { Link, useParams } from 'react-router-dom'
import './OrderSuccessPage.css'

export default function OrderSuccessPage() {
  const { id } = useParams()
  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for shopping with us. Your order has been confirmed.</p>
        <div className="order-id-box">Order ID: <strong>#{id?.slice(-8).toUpperCase()}</strong></div>
        <div className="success-actions">
          <Link to="/profile" className="btn btn-primary btn-lg">View My Orders</Link>
          <Link to="/products" className="btn btn-outline btn-lg">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
