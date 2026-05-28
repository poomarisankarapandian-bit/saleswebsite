import express from 'express'
import {
  getProducts, getFeaturedProducts, getProductById,
  createProduct, updateProduct, deleteProduct,
  createProductReview, getCategories
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/featured', getFeaturedProducts)
router.get('/categories', getCategories)
router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct)
router.post('/:id/reviews', protect, createProductReview)

export default router
