import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    brand: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Footwear', 'Home & Kitchen', 'Sports', 'Books', 'Beauty', 'Toys', 'Other'],
    },
    subCategory: { type: String, default: '' },
    countInStock: { type: Number, required: true, default: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sku: { type: String, unique: true, sparse: true },
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

// Auto discount calculation
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  next()
})

export default mongoose.model('Product', productSchema)
