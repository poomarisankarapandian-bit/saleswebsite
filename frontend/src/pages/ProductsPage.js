import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../features/products/productSlice'
import ProductCard from '../components/ProductCard'
import './ProductsPage.css'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { items, categories, loading, pages, total } = useSelector((s) => s.products)

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '', sort: 'newest', page: 1,
  })

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  useEffect(() => {
    const params = {}
    if (filters.keyword) params.keyword = filters.keyword
    if (filters.category) params.category = filters.category
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    params.sort = filters.sort
    params.page = filters.page
    dispatch(fetchProducts(params))
  }, [dispatch, filters])

  const update = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }))

  return (
    <div className="products-page page">
      <div className="container">
        <div className="products-page__layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <h3 className="sidebar__title">Filters</h3>
            <div className="sidebar__section">
              <label>Category</label>
              <select value={filters.category} onChange={(e) => update('category', e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sidebar__section">
              <label>Price Range</label>
              <div className="price-inputs">
                <input type="number" placeholder="Min ₹" value={filters.minPrice} onChange={(e) => update('minPrice', e.target.value)} />
                <input type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={(e) => update('maxPrice', e.target.value)} />
              </div>
            </div>
            <button className="btn btn-outline btn-full btn-sm" onClick={() => setFilters({ keyword:'', category:'', minPrice:'', maxPrice:'', sort:'newest', page:1 })}>
              Clear Filters
            </button>
          </aside>

          {/* Products */}
          <div className="products-page__main">
            <div className="products-page__toolbar">
              <p className="results-count">{total} products found</p>
              <select value={filters.sort} onChange={(e) => update('sort', e.target.value)} className="sort-select">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {loading ? (
              <div className="spinner" />
            ) : items.length === 0 ? (
              <div className="empty-state">
                <span>🔍</span>
                <h3>No products found</h3>
                <p>Try different filters or search terms</p>
              </div>
            ) : (
              <div className="products-grid">
                {items.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`} onClick={() => setFilters((f) => ({ ...f, page: p }))}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
