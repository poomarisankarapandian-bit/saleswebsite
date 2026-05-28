import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserProfile, updateProfile } from '../features/auth/authSlice'
import { fetchMyOrders } from '../features/orders/orderSlice'
import { toast } from 'react-toastify'
import './ProfilePage.css'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { profile, loading } = useSelector((s) => s.auth)
  const { myOrders } = useSelector((s) => s.orders)
  const [tab, setTab] = useState('orders')
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' })

  useEffect(() => {
    dispatch(getUserProfile())
    dispatch(fetchMyOrders())
  }, [dispatch])

  useEffect(() => {
    if (profile) setForm({ name: profile.name, email: profile.email, phone: profile.phone || '', password: '' })
  }, [profile])

  const handleUpdate = async (e) => {
    e.preventDefault()
    const result = await dispatch(updateProfile(form))
    if (updateProfile.fulfilled.match(result)) toast.success('Profile updated!')
  }

  const statusColors = { Pending:'warning', Confirmed:'info', Processing:'info', Shipped:'primary', Delivered:'success', Cancelled:'danger' }

  return (
    <div className="profile-page page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">{profile?.name?.charAt(0)}</div>
          <div><h1>{profile?.name}</h1><p>{profile?.email}</p></div>
        </div>
        <div className="profile-tabs">
          {['orders','settings'].map((t) => <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={() => setTab(t)}>{t === 'orders' ? '📦 My Orders' : '⚙️ Settings'}</button>)}
        </div>

        {tab === 'orders' && (
          <div>
            {myOrders.length === 0 ? (
              <div style={{textAlign:'center', padding:'60px 20px'}}>
                <div style={{fontSize:'60px'}}>📦</div>
                <h3 style={{margin:'16px 0 8px'}}>No orders yet</h3>
                <Link to="/products" className="btn btn-primary" style={{marginTop:'8px'}}>Start Shopping</Link>
              </div>
            ) : (
              <div className="orders-table-wrap">
                <table className="orders-table">
                  <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {myOrders.map((o) => (
                      <tr key={o._id}>
                        <td><strong>#{o._id.slice(-8).toUpperCase()}</strong></td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>{o.orderItems.length} item(s)</td>
                        <td><strong>₹{o.totalPrice?.toLocaleString()}</strong></td>
                        <td><span className={`badge badge-${statusColors[o.orderStatus]}`}>{o.orderStatus}</span></td>
                        <td><Link to={`/orders/${o._id}`} className="btn btn-outline btn-sm">View</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="settings-form card" style={{padding:'28px', maxWidth:'480px'}}>
            <h2 style={{marginBottom:'20px', fontSize:'18px', fontWeight:'700'}}>Update Profile</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({...form, phone:e.target.value})} /></div>
              <div className="form-group"><label>New Password (optional)</label><input type="password" placeholder="Leave blank to keep current" value={form.password} onChange={(e) => setForm({...form, password:e.target.value})} /></div>
              <button type="submit" className="btn btn-primary" disabled={loading}>Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
