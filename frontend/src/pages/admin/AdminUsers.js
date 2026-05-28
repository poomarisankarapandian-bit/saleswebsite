import React, { useEffect, useState } from 'react'
import api from '../../utils/axiosConfig'
import { toast } from 'react-toastify'
import './Admin.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => api.get('/users').then(({ data }) => { setUsers(data); setLoading(false) })
  useEffect(() => { load() }, [])

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete user "${name}"?`)) {
      await api.delete(`/users/${id}`)
      toast.success('User deleted')
      load()
    }
  }

  return (
    <div className="admin-page page">
      <div className="container">
        <h1 className="page-title">👥 All Users ({users.length})</h1>
        {loading ? <div className="spinner" /> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td><div style={{display:'flex', alignItems:'center', gap:'10px'}}><div style={{width:'32px', height:'32px', background:'var(--primary)', color:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>{u.name?.charAt(0)}</div><strong style={{fontSize:'14px'}}>{u.name}</strong></div></td>
                    <td style={{fontSize:'13px'}}>{u.email}</td>
                    <td style={{fontSize:'13px'}}>{u.phone || '—'}</td>
                    <td><span className={`badge badge-${u.isAdmin ? 'danger' : 'success'}`}>{u.isAdmin ? 'Admin' : 'User'}</span></td>
                    <td style={{fontSize:'13px'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>{!u.isAdmin && <button className="btn btn-sm" style={{background:'#ffe5e7', color:'var(--danger)'}} onClick={() => handleDelete(u._id, u.name)}>Delete</button>}</td>
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
