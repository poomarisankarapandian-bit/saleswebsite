import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../features/orders/orderSlice'
import { clearCart } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, itemsPrice, shippingPrice, taxPrice } = useSelector((s) => s.cart)
  const { loading } = useSelector((s) => s.orders)
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState({ name:'', phone:'', street:'', city:'', state:'', pincode:'' })
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const total = itemsPrice + shippingPrice + taxPrice

  const handlePlaceOrder = async () => {
    const orderData = {
      orderItems: items.map((i) => ({ product: i._id, name: i.name, image: i.image, price: i.price, qty: i.qty })),
      shippingAddress: address,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice: total,
    }
    const result = await dispatch(createOrder(orderData))
    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart())
      toast.success('Order placed successfully! 🎉')
      navigate(`/order-success/${result.payload._id}`)
    } else {
      toast.error(result.payload || 'Order failed')
    }
  }

  const addr = (k) => (e) => setAddress((a) => ({ ...a, [k]: e.target.value }))

  return (
    <div className="checkout-page page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <div className="checkout-steps">
          {['Shipping', 'Payment', 'Review'].map((s, i) => (
            <div key={s} className={`step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-form">
            {step === 1 && (
              <div className="checkout-section">
                <h2>Shipping Address</h2>
                <div className="form-group"><label>Full Name</label><input value={address.name} onChange={addr('name')} placeholder="Recipient name" required /></div>
                <div className="form-group"><label>Phone</label><input value={address.phone} onChange={addr('phone')} placeholder="10-digit mobile number" required /></div>
                <div className="form-group"><label>Street / Area</label><input value={address.street} onChange={addr('street')} placeholder="House no, Street, Area" required /></div>
                <div className="form-row">
                  <div className="form-group"><label>City</label><input value={address.city} onChange={addr('city')} placeholder="City" required /></div>
                  <div className="form-group"><label>State</label><input value={address.state} onChange={addr('state')} placeholder="State" required /></div>
                </div>
                <div className="form-group"><label>Pincode</label><input value={address.pincode} onChange={addr('pincode')} placeholder="6-digit pincode" required /></div>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(2)} disabled={!address.name || !address.phone || !address.street || !address.city || !address.pincode}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-section">
                <h2>Payment Method</h2>
                {[{id:'COD', label:'💵 Cash on Delivery', desc:'Pay when your order arrives'}, {id:'UPI', label:'📱 UPI Payment', desc:'Google Pay, PhonePe, Paytm'}, {id:'Card', label:'💳 Debit / Credit Card', desc:'Visa, Mastercard, RuPay'}, {id:'NetBanking', label:'🏦 Net Banking', desc:'All major banks supported'}].map((m) => (
                  <label key={m.id} className={`payment-option ${paymentMethod === m.id ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} />
                    <div><strong>{m.label}</strong><p>{m.desc}</p></div>
                  </label>
                ))}
                <div style={{display:'flex', gap:'12px', marginTop:'20px'}}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-section">
                <h2>Review Your Order</h2>
                <div className="review-address">
                  <h4>📍 Delivering to:</h4>
                  <p>{address.name} — {address.phone}</p>
                  <p>{address.street}, {address.city}, {address.state} — {address.pincode}</p>
                </div>
                <div className="review-payment"><h4>💳 Payment: {paymentMethod}</h4></div>
                <div className="review-items">
                  {items.map((i) => (
                    <div key={i._id} className="review-item">
                      <img src={i.image} alt={i.name} />
                      <span>{i.name} × {i.qty}</span>
                      <span>₹{(i.price * i.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex', gap:'12px', marginTop:'20px'}}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : '🎉 Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {items.map((i) => (
              <div key={i._id} className="summary-item">
                <img src={i.image} alt={i.name} />
                <div><p>{i.name}</p><small>Qty: {i.qty}</small></div>
                <span>₹{(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="summary-row"><span>Items</span><span>₹{itemsPrice.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>₹{taxPrice.toLocaleString()}</span></div>
            <hr />
            <div className="summary-row summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
