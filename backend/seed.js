import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from './models/userModel.js'
import Product from './models/productModel.js'

dotenv.config()

const users = [
  {
    name: 'Admin User',
    email: 'admin@salessite.com',
    password: await bcrypt.hash('admin123', 10),
    isAdmin: true,
    phone: '9876543210',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: await bcrypt.hash('user123', 10),
    phone: '9876543211',
  },
]

const products = [
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.',
    price: 24999,
    originalPrice: 34999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    brand: 'Sony',
    category: 'Electronics',
    countInStock: 25,
    rating: 4.8,
    numReviews: 124,
    isFeatured: true,
    tags: ['headphones', 'wireless', 'noise-canceling'],
  },
  {
    name: 'Apple iPhone 15 Pro',
    description: 'Titanium design, A17 Pro chip, 48MP camera system with USB-C.',
    price: 134900,
    originalPrice: 144900,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    brand: 'Apple',
    category: 'Electronics',
    countInStock: 10,
    rating: 4.9,
    numReviews: 89,
    isFeatured: true,
    tags: ['iphone', 'smartphone', 'apple'],
  },
  {
    name: 'Nike Air Max 270',
    description: 'Inspired by the AW77 and Air Max 180, the Nike Air Max 270 features Nike biggest heel Air unit.',
    price: 9495,
    originalPrice: 12995,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    brand: 'Nike',
    category: 'Footwear',
    countInStock: 40,
    rating: 4.6,
    numReviews: 203,
    isFeatured: true,
    tags: ['shoes', 'running', 'nike'],
  },
  {
    name: 'Samsung 65" 4K OLED TV',
    description: 'Experience breathtaking visuals with OLED technology, 120Hz refresh rate and smart features.',
    price: 89999,
    originalPrice: 109999,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
    brand: 'Samsung',
    category: 'Electronics',
    countInStock: 8,
    rating: 4.7,
    numReviews: 56,
    isFeatured: true,
    tags: ['tv', '4k', 'oled', 'samsung'],
  },
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    description: 'Classic slim fit jeans with stretch comfort. Perfect for everyday wear.',
    price: 2999,
    originalPrice: 4499,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    brand: 'Levis',
    category: 'Clothing',
    countInStock: 60,
    rating: 4.4,
    numReviews: 312,
    tags: ['jeans', 'slim', 'denim'],
  },
  {
    name: 'MacBook Air M3',
    description: 'Supercharged by M3 chip. All-day battery, stunning display, and ultra-thin design.',
    price: 114900,
    originalPrice: 124900,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    brand: 'Apple',
    category: 'Electronics',
    countInStock: 15,
    rating: 4.9,
    numReviews: 78,
    isFeatured: true,
    tags: ['laptop', 'macbook', 'apple', 'm3'],
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Electric pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer.',
    price: 7999,
    originalPrice: 10999,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    brand: 'Instant Pot',
    category: 'Home & Kitchen',
    countInStock: 30,
    rating: 4.5,
    numReviews: 445,
    tags: ['kitchen', 'cooking', 'instant-pot'],
  },
  {
    name: 'Adidas Ultraboost 23',
    description: 'Responsive cushioning meets Primeknit upper for the perfect running experience.',
    price: 12999,
    originalPrice: 16999,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    brand: 'Adidas',
    category: 'Footwear',
    countInStock: 35,
    rating: 4.7,
    numReviews: 167,
    tags: ['shoes', 'running', 'adidas'],
  },
]

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB...')

    await User.deleteMany()
    await Product.deleteMany()

    await User.insertMany(users)
    await Product.insertMany(products)

    console.log('✅ Data seeded successfully!')
    console.log('Admin: admin@salessite.com / admin123')
    console.log('User: john@example.com / user123')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err)
    process.exit(1)
  }
}

seedData()
