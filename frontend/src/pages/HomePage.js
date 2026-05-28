import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatured, fetchCategories } from '../features/products/productSlice'
import ProductCard from '../components/ProductCard'
import './HomePage.css'

export default function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { featured, categories, loading } = useSelector((s) => s.products)

  useEffect(() => {
    dispatch(fetchFeatured())
    dispatch(fetchCategories())
  }, [dispatch])

  const categoryIcons = { Electronics:'💻', Clothing:'👕', Footwear:'👟', 'Home & Kitchen':'🏠', Sports:'⚽', Books:'📚', Beauty:'💄', Toys:'🧸', Other:'📦' }

  return (
    <div className="homepage">
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="hero__tag">🔥 New Arrivals 2024</span>
            <h1>Shop the Best Deals <span>Online</span></h1>
            <p>Discover thousands of products at unbeatable prices. Fast delivery, easy returns.</p>
            <div className="hero__actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>Shop Now →</button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/products?category=Electronics')}>Electronics</button>
            </div>
            <div className="hero__stats">
              <div><strong>10K+</strong><span>Products</span></div>
              <div><strong>50K+</strong><span>Customers</span></div>
              <div><strong>4.8★</strong><span>Rating</span></div>
            </div>
          </div>
          <div className="hero__img">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600" alt="Shopping" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section__title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link key={cat} to={`/products?category=${cat}`} className="category-card">
                <span className="category-card__icon">{categoryIcons[cat] || '📦'}</span>
                <span className="category-card__name">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Featured Products</h2>
            <Link to="/products" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-banner__text">
              <h2>Free Shipping on Orders Over ₹500</h2>
              <p>Use code <strong>FREESHIP</strong> at checkout</p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>Shop Now</button>
            </div>
            <div className="promo-banner__img">🚚</div>
          </div>
        </div>
      </section>
    </div>
  )
}
