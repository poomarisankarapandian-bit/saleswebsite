import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/orderSlice'
import { toast } from 'react-toastify'
import './Admin.css'

const statusColors = { Pending:'warning', Confirmed:'info', Processing:'info', Shipped:'primary', Delivered:'success', Cancelled:'danger' }
const nextStatus = { Pending:'Confirmed', Confirmed:'Processing', Processing:'Shipped', Shipped:'Delivered' }

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { allOrders, loading } = useSelector((s) => s.orders)

  useEffect(() => { dispatch(fetchAllOrders({ limit: 100 })) }, [dispatch])

  const handleStatus = async (id, status) => {
    await dispatch(updateOrderStatus({ id, status }))
    toast.success(`Order marked as ${status}`)
  }

  return (
    <div className="admin-page page">
      <div className="container">
        <h1 className="page-title">📦 All Orders ({allOrders.length})</h1>
        {loading ? <div className="spinner" /> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                {allOrders.map((o) => (
                  <tr key={o._id}>
                    <td><strong>#{o._id.slice(-8).toUpperCase()}</strong></td>
                    <td><div style={{fontSize:'13px'}}><p style={{fontWeight:600}}>{o.user?.name}</p><small style={{color:'var(--text-muted)'}}>{o.user?.email}</small></div></td>
                    <td>{o.orderItems?.length}</td>
                    <td><strong>₹{o.totalPrice?.toLocaleString()}</strong></td>
                    <td><span className="badge badge-info">{o.paymentMethod}</span></td>
                    <td><span className={`badge badge-${statusColors[o.orderStatus]}`}>{o.orderStatus}</span></td>
                    <td style={{fontSize:'13px'}}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      {nextStatus[o.orderStatus] && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleStatus(o._id, nextStatus[o.orderStatus])}>
                          → {nextStatus[o.orderStatus]}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
