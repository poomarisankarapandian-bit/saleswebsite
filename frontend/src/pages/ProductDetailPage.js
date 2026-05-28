import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, createReview } from '../features/products/productSlice'
import { addToCart } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selected: product, loading, error } = useSelector((s) => s.products)
  const { user } = useSelector((s) => s.auth)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [review, setReview] = useState({ rating: 5, comment: '' })

  useEffect(() => { dispatch(fetchProductById(id)) }, [dispatch, id])

  const handleAddCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product))
    toast.success(`${qty} item(s) added to cart!`)
  }

  const handleBuyNow = () => {
    handleAddCart()
    navigate('/cart')
  }

  const handleReview = (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to review')
    dispatch(createReview({ id, review })).then(() => {
      toast.success('Review submitted!')
      dispatch(fetchProductById(id))
    })
  }

  const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))

  if (loading) return <div className="spinner" style={{marginTop:'80px'}} />
  if (error) return <div className="alert alert-error container" style={{marginTop:'40px'}}>{error}</div>
  if (!product) return null

  const allImages = [product.image, ...(product.images || [])]

  return (
    <div className="product-detail page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="product-detail__grid">
          {/* Images */}
          <div className="product-detail__images">
            <div className="main-img">
              <img src={allImages[activeImg]} alt={product.name} />
              {product.discount > 0 && <span className="detail-discount">-{product.discount}%</span>}
            </div>
            {allImages.length > 1 && (
              <div className="thumb-list">
                {allImages.map((img, i) => (
                  <img key={i} src={img} alt="" className={`thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <span className="product-detail__cat">{product.category}</span>
            <h1 className="product-detail__name">{product.name}</h1>
            <div className="product-detail__rating">
              <span className="stars">{stars(product.rating)}</span>
              <span>{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>
            <div className="product-detail__price-row">
              <span className="product-detail__price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="product-detail__original">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.discount > 0 && <span className="badge badge-primary">{product.discount}% OFF</span>}
            </div>
            <p className="product-detail__desc">{product.description}</p>

            <div className="product-detail__meta">
              <div><strong>Brand:</strong> {product.brand || 'N/A'}</div>
              <div><strong>SKU:</strong> {product.sku || 'N/A'}</div>
              <div>
                <strong>Status:</strong>{' '}
                {product.countInStock > 0 ? (
                  <span className="badge badge-success">In Stock ({product.countInStock})</span>
                ) : (
                  <span className="badge badge-danger">Out of Stock</span>
                )}
              </div>
            </div>

            {product.countInStock > 0 && (
              <div className="product-detail__qty">
                <label>Quantity:</label>
                <div className="qty-control">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="product-detail__actions">
              <button className="btn btn-primary btn-lg" onClick={handleAddCart} disabled={!product.countInStock}>🛒 Add to Cart</button>
              <button className="btn btn-secondary btn-lg" onClick={handleBuyNow} disabled={!product.countInStock}>⚡ Buy Now</button>
            </div>

            <div className="product-detail__features">
              <div>✅ Free delivery over ₹500</div>
              <div>🔄 7-day easy returns</div>
              <div>🔒 Secure payments</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.reviews?.length === 0 && <p className="no-reviews">No reviews yet. Be the first!</p>}
          <div className="reviews-list">
            {product.reviews?.map((r) => (
              <div key={r._id} className="review-card">
                <div className="review-card__header">
                  <div className="review-avatar">{r.name?.charAt(0)}</div>
                  <div>
                    <strong>{r.name}</strong>
                    <div className="stars" style={{fontSize:'13px'}}>{stars(r.rating)}</div>
                  </div>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>

          {/* Write Review */}
          {user && (
            <form className="review-form" onSubmit={handleReview}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label>Rating</label>
                <select value={review.rating} onChange={(e) => setReview((r) => ({ ...r, rating: Number(e.target.value) }))}>
                  {[5,4,3,2,1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n} stars)</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea rows={4} value={review.comment} onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))} required placeholder="Share your experience..." />
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
