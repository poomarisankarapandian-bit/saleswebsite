import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById, cancelOrder } from '../features/orders/orderSlice'
import { toast } from 'react-toastify'

export default function OrderDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selected: order, loading } = useSelector((s) => s.orders)

  useEffect(() => { dispatch(fetchOrderById(id)) }, [dispatch, id])

  const handleCancel = async () => {
    if (window.confirm('Cancel this order?')) {
      await dispatch(cancelOrder(id))
      toast.success('Order cancelled')
      dispatch(fetchOrderById(id))
    }
  }

  if (loading || !order) return <div className="spinner" style={{marginTop:'80px'}} />

  const statusColors = { Pending:'warning', Confirmed:'info', Processing:'info', Shipped:'primary', Delivered:'success', Cancelled:'danger' }

  return (
    <div className="page container">
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{marginBottom:'20px'}}>← Back</button>
      <h1 className="page-title">Order #{order._id?.slice(-8).toUpperCase()}</h1>
      <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px'}}>
        <div>
          <div className="card" style={{padding:'24px', marginBottom:'20px'}}>
            <h3 style={{marginBottom:'16px'}}>Status: <span className={`badge badge-${statusColors[order.orderStatus]}`}>{order.orderStatus}</span></h3>
            {order.orderItems.map((item) => (
              <div key={item._id} style={{display:'flex', gap:'12px', marginBottom:'12px', alignItems:'center'}}>
                <img src={item.image} alt={item.name} style={{width:'60px', height:'60px', objectFit:'cover', borderRadius:'8px'}} />
                <div style={{flex:1}}><p style={{fontWeight:600}}>{item.name}</p><small>Qty: {item.qty}</small></div>
                <strong>₹{(item.price * item.qty).toLocaleString()}</strong>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:'24px'}}>
            <h3 style={{marginBottom:'12px'}}>Shipping Address</h3>
            <p>{order.shippingAddress?.name}</p>
            <p>{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
          </div>
        </div>
        <div className="card" style={{padding:'24px', height:'fit-content'}}>
          <h3 style={{marginBottom:'16px'}}>Order Summary</h3>
          <div className="summary-row"><span>Items</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>₹{order.taxPrice?.toLocaleString()}</span></div>
          <hr />
          <div className="summary-row" style={{fontWeight:800, fontSize:'17px'}}><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div>
          <p style={{fontSize:'13px', marginTop:'12px'}}><strong>Payment:</strong> {order.paymentMethod}</p>
          <p style={{fontSize:'13px'}}><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          {['Pending','Confirmed'].includes(order.orderStatus) && (
            <button className="btn btn-outline btn-full" style={{marginTop:'16px', color:'var(--danger)', borderColor:'var(--danger)'}} onClick={handleCancel}>Cancel Order</button>
          )}
        </div>
      </div>
    </div>
  )
}
