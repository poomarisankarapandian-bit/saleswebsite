import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()

  const handleAdd = (e) => {
    e.preventDefault()
    dispatch(addToCart(product))
    toast.success(`${product.name} added to cart!`)
  }

  const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card__img-wrap">
        <img src={product.image} alt={product.name} className="product-card__img" />
        {product.discount > 0 && (
          <span className="product-card__discount">-{product.discount}%</span>
        )}
        {product.countInStock === 0 && (
          <div className="product-card__oos">Out of Stock</div>
        )}
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__rating">
          <span className="stars">{stars(product.rating)}</span>
          <span className="product-card__reviews">({product.numReviews})</span>
        </div>
        <div className="product-card__price-row">
          <span className="product-card__price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="product-card__original">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <button
          className="btn btn-primary btn-full btn-sm product-card__btn"
          onClick={handleAdd}
          disabled={product.countInStock === 0}
        >
          🛒 Add to Cart
        </button>
      </div>
    </Link>
  )
}
