import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../utils/axiosConfig'
import { useState } from 'react'
import './Admin.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => {
      setStats(data.stats)
      setTopProducts(data.topProducts)
      setRecentOrders(data.recentOrders)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" style={{marginTop:'80px'}} />

  const cards = [
    { label:'Total Revenue', value:`₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon:'💰', color:'#e63946' },
    { label:'Total Orders', value:stats?.totalOrders || 0, icon:'📦', color:'#457b9d' },
    { label:'Total Products', value:stats?.totalProducts || 0, icon:'🛍️', color:'#2d6a4f' },
    { label:'Total Users', value:stats?.totalUsers || 0, icon:'👥', color:'#f4a261' },
    { label:'Pending Orders', value:stats?.pendingOrders || 0, icon:'⏳', color:'#e9c46a' },
    { label:'Low Stock Items', value:stats?.lowStockProducts || 0, icon:'⚠️', color:'#e63946' },
  ]

  return (
    <div className="admin-page page">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">🛠️ Admin Dashboard</h1>
          <div className="admin-nav">
            <Link to="/admin/products" className="btn btn-outline btn-sm">Products</Link>
            <Link to="/admin/orders" className="btn btn-outline btn-sm">Orders</Link>
            <Link to="/admin/users" className="btn btn-outline btn-sm">Users</Link>
          </div>
        </div>

        <div className="stats-grid">
          {cards.map((c) => (
            <div key={c.label} className="stat-card" style={{'--accent-color': c.color}}>
              <div className="stat-card__icon">{c.icon}</div>
              <div className="stat-card__body">
                <div className="stat-card__value">{c.value}</div>
                <div className="stat-card__label">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-grid">
          <div className="card" style={{padding:'24px'}}>
            <h3 style={{marginBottom:'16px', fontSize:'17px', fontWeight:'700'}}>🏆 Top Selling Products</h3>
            {topProducts.map((p, i) => (
              <div key={p._id} style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px'}}>
                <span style={{width:'24px', fontWeight:'700', color:'var(--text-muted)'}}>{i+1}</span>
                <img src={p.image} alt={p.name} style={{width:'44px', height:'44px', objectFit:'cover', borderRadius:'8px'}} />
                <div style={{flex:1}}><p style={{fontWeight:600, fontSize:'14px'}}>{p.name}</p><small style={{color:'var(--text-muted)'}}>{p.category}</small></div>
                <div style={{textAlign:'right'}}><p style={{fontWeight:700, fontSize:'14px'}}>₹{p.price?.toLocaleString()}</p><small style={{color:'var(--text-muted)'}}>{p.sold} sold</small></div>
              </div>
            ))}
          </div>

          <div className="card" style={{padding:'24px'}}>
            <h3 style={{marginBottom:'16px', fontSize:'17px', fontWeight:'700'}}>📋 Recent Orders</h3>
            {recentOrders.slice(0,6).map((o) => (
              <div key={o._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:'14px'}}>
                <div>
                  <p style={{fontWeight:600}}>#{o._id.slice(-6).toUpperCase()}</p>
                  <small style={{color:'var(--text-muted)'}}>{o.user?.name}</small>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontWeight:700}}>₹{o.totalPrice?.toLocaleString()}</p>
                  <span className={`badge badge-${o.orderStatus === 'Delivered' ? 'success' : o.orderStatus === 'Cancelled' ? 'danger' : 'warning'}`} style={{fontSize:'11px'}}>{o.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
