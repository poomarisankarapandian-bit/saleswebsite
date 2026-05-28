import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axiosConfig'

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', orderData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order failed')
  }
})

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/myorders')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchOrderById = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString()
    const { data } = await api.get(`/orders?${query}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/orders/${id}/status`, { status })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/orders/${id}/cancel`)
    return { id, message: data.message }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders: [],
    allOrders: [],
    selected: null,
    newOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearNewOrder: (state) => { state.newOrder = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, { payload }) => { state.loading = false; state.error = payload }
    builder
      .addCase(createOrder.pending, pending)
      .addCase(createOrder.fulfilled, (state, { payload }) => { state.loading = false; state.newOrder = payload })
      .addCase(createOrder.rejected, rejected)
      .addCase(fetchMyOrders.pending, pending)
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => { state.loading = false; state.myOrders = payload })
      .addCase(fetchMyOrders.rejected, rejected)
      .addCase(fetchOrderById.pending, pending)
      .addCase(fetchOrderById.fulfilled, (state, { payload }) => { state.loading = false; state.selected = payload })
      .addCase(fetchOrderById.rejected, rejected)
      .addCase(fetchAllOrders.pending, pending)
      .addCase(fetchAllOrders.fulfilled, (state, { payload }) => { state.loading = false; state.allOrders = payload.orders })
      .addCase(fetchAllOrders.rejected, rejected)
      .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
        state.allOrders = state.allOrders.map((o) => o._id === payload._id ? payload : o)
      })
  },
})

export const { clearNewOrder, clearError } = orderSlice.actions
export default orderSlice.reducer
