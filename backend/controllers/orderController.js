import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'

// @desc    Create order
// @route   POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body

  if (!orderItems || orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  })

  // Update stock and sold count
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: -item.qty, sold: item.qty },
    })
  }

  res.status(201).json(order)
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(orders)
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')

  if (order) {
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403)
      throw new Error('Not authorized')
    }
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.orderStatus = 'Confirmed'
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      emailAddress: req.body.payer?.email_address,
    }

    const updated = await order.save()
    res.json(updated)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.orderStatus = req.body.status || order.orderStatus
    if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber
    if (req.body.status === 'Delivered') {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }

    const updated = await order.save()
    res.json(updated)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get all orders (admin)
// @route   GET /api/orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const statusFilter = req.query.status ? { orderStatus: req.query.status } : {}

  const count = await Order.countDocuments(statusFilter)
  const orders = await Order.find(statusFilter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))

  res.json({ orders, page, pages: Math.ceil(count / limit), total: count })
})

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      res.status(400)
      throw new Error('Cannot cancel shipped or delivered order')
    }

    order.orderStatus = 'Cancelled'

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: item.qty, sold: -item.qty },
      })
    }

    await order.save()
    res.json({ message: 'Order cancelled' })
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})
