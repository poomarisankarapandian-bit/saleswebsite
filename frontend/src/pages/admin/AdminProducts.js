import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, deleteProduct, createProduct, updateProduct } from '../../features/products/productSlice'
import { toast } from 'react-toastify'
import './Admin.css'

const EMPTY = { name:'', price:'', originalPrice:'', category:'Electronics', brand:'', description:'', image:'', countInStock:'', isFeatured:false }

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { items, loading, total } = useSelector((s) => s.products)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  useEffect(() => { dispatch(fetchProducts({ limit: 50 })) }, [dispatch])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowModal(true) }
  const openEdit = (p) => { setForm({...p, price: p.price, originalPrice: p.originalPrice || ''}); setEditing(p._id); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      const r = await dispatch(updateProduct({ id: editing, productData: form }))
      if (updateProduct.fulfilled.match(r)) { toast.success('Product updated!'); setShowModal(false); dispatch(fetchProducts({ limit:50 })) }
    } else {
      const r = await dispatch(createProduct(form))
      if (createProduct.fulfilled.match(r)) { toast.success('Product created!'); setShowModal(false); dispatch(fetchProducts({ limit:50 })) }
    }
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      await dispatch(deleteProduct(id))
      toast.success('Product deleted')
    }
  }

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="admin-page page">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">🛍️ Products ({total})</h1>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image} alt={p.name} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'8px'}} /></td>
                  <td><strong style={{fontSize:'13px'}}>{p.name}</strong></td>
                  <td><span className="badge badge-primary">{p.category}</span></td>
                  <td><strong>₹{p.price?.toLocaleString()}</strong></td>
                  <td><span className={`badge badge-${p.countInStock > 5 ? 'success' : p.countInStock > 0 ? 'warning' : 'danger'}`}>{p.countInStock}</span></td>
                  <td>{p.isFeatured ? '⭐' : '—'}</td>
                  <td style={{display:'flex', gap:'8px'}}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-sm" style={{background:'#ffe5e7', color:'var(--danger)'}} onClick={() => handleDelete(p._id, p.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-row2">
                  <div className="form-group"><label>Product Name *</label><input value={form.name} onChange={f('name')} required /></div>
                  <div className="form-group"><label>Brand</label><input value={form.brand} onChange={f('brand')} /></div>
                </div>
                <div className="form-row2">
                  <div className="form-group"><label>Price (₹) *</label><input type="number" value={form.price} onChange={f('price')} required /></div>
                  <div className="form-group"><label>Original Price (₹)</label><input type="number" value={form.originalPrice} onChange={f('originalPrice')} /></div>
                </div>
                <div className="form-row2">
                  <div className="form-group"><label>Category *</label>
                    <select value={form.category} onChange={f('category')}>
                      {['Electronics','Clothing','Footwear','Home & Kitchen','Sports','Books','Beauty','Toys','Other'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Stock *</label><input type="number" value={form.countInStock} onChange={f('countInStock')} required /></div>
                </div>
                <div className="form-group"><label>Image URL *</label><input value={form.image} onChange={f('image')} required placeholder="https://..." /></div>
                <div className="form-group"><label>Description *</label><textarea rows={3} value={form.description} onChange={f('description')} required /></div>
                <label style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px', cursor:'pointer'}}>
                  <input type="checkbox" checked={form.isFeatured} onChange={f('isFeatured')} /> Feature this product on homepage
                </label>
                <div style={{display:'flex', gap:'12px'}}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
