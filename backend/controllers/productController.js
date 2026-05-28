import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Get all products with filter, search, pagination
// @route   GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12
  const page = Number(req.query.page) || 1

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {}

  const categoryFilter = req.query.category ? { category: req.query.category } : {}
  const brandFilter = req.query.brand ? { brand: req.query.brand } : {}
  const activeFilter = { isActive: true }

  const priceFilter =
    req.query.minPrice || req.query.maxPrice
      ? {
          price: {
            ...(req.query.minPrice && { $gte: Number(req.query.minPrice) }),
            ...(req.query.maxPrice && { $lte: Number(req.query.maxPrice) }),
          },
        }
      : {}

  const sortOptions = {
    newest: { createdAt: -1 },
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    rating: { rating: -1 },
    popular: { sold: -1 },
  }
  const sort = sortOptions[req.query.sort] || { createdAt: -1 }

  const filter = { ...keyword, ...categoryFilter, ...brandFilter, ...priceFilter, ...activeFilter }

  const count = await Product.countDocuments(filter)
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  })
})

// @desc    Get featured products
// @route   GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8)
  res.json(products)
})

// @desc    Get single product
// @route   GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create product (admin)
// @route   POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json(product)
})

// @desc    Update product (admin)
// @route   PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    Object.assign(product, req.body)
    const updated = await product.save()
    res.json(updated)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.deleteOne()
    res.json({ message: 'Product deleted' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Add product review
// @route   POST /api/products/:id/reviews
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed by you')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get all categories
// @route   GET /api/products/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true })
  res.json(categories)
})
