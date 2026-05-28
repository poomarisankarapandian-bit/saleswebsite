import { createSlice } from '@reduxjs/toolkit'

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
}

const saveCart = (items) => localStorage.setItem('cart', JSON.stringify(items))

const calcTotals = (items) => ({
  itemsPrice: items.reduce((sum, i) => sum + i.price * i.qty, 0),
  shippingPrice: items.reduce((sum, i) => sum + i.price * i.qty, 0) > 500 ? 0 : 49,
  taxPrice: Math.round(items.reduce((sum, i) => sum + i.price * i.qty, 0) * 0.05),
  totalItems: items.reduce((sum, i) => sum + i.qty, 0),
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
    ...calcTotals(loadCart()),
  },
  reducers: {
    addToCart: (state, { payload }) => {
      const existing = state.items.find((i) => i._id === payload._id)
      if (existing) {
        if (existing.qty < payload.countInStock) existing.qty += 1
      } else {
        state.items.push({ ...payload, qty: 1 })
      }
      Object.assign(state, calcTotals(state.items))
      saveCart(state.items)
    },
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter((i) => i._id !== payload)
      Object.assign(state, calcTotals(state.items))
      saveCart(state.items)
    },
    updateQty: (state, { payload: { id, qty } }) => {
      const item = state.items.find((i) => i._id === id)
      if (item) item.qty = qty
      Object.assign(state, calcTotals(state.items))
      saveCart(state.items)
    },
    clearCart: (state) => {
      state.items = []
      Object.assign(state, calcTotals([]))
      localStorage.removeItem('cart')
    },
  },
})

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions
export default cartSlice.reducer
