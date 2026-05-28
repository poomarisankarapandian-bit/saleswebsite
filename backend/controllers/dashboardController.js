import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments()
  const totalProducts = await Product.countDocuments({ isActive: true })
  const totalUsers = await User.countDocuments({ isAdmin: false })

  const revenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ])
  const totalRevenue = revenueResult[0]?.total || 0

  const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' })
  const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' })
  const lowStockProducts = await Product.countDocuments({ countInStock: { $lte: 5 }, isActive: true })

  // Monthly revenue for chart (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ])

  // Top selling products
  const topProducts = await Product.find({ isActive: true })
    .sort({ sold: -1 })
    .limit(5)
    .select('name sold price image category')

  // Recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(10)

  // Orders by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ])

  res.json({
    stats: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      lowStockProducts,
    },
    monthlyRevenue,
    topProducts,
    recentOrders,
    ordersByStatus,
  })
})
