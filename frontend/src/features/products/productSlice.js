import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axiosConfig'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString()
    const { data } = await api.get(`/products?${query}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products')
  }
})

export const fetchProductById = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Product not found')
  }
})

export const fetchFeatured = createAsyncThunk('products/featured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/featured')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchCategories = createAsyncThunk('products/categories', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/categories')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const createReview = createAsyncThunk('products/review', async ({ id, review }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/products/${id}/reviews`, review)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Review failed')
  }
})

// Admin thunks
export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/products', productData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/products/${id}`, productData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    featured: [],
    categories: [],
    selected: null,
    page: 1,
    pages: 1,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected: (state) => { state.selected = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items = payload.products
        state.page = payload.page
        state.pages = payload.pages
        state.total = payload.total
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.selected = null })
      .addCase(fetchProductById.fulfilled, (state, { payload }) => { state.loading = false; state.selected = payload })
      .addCase(fetchProductById.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(fetchFeatured.fulfilled, (state, { payload }) => { state.featured = payload })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => { state.categories = payload })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((p) => p._id !== payload)
      })
  },
})

export const { clearSelected, clearError } = productSlice.actions
export default productSlice.reducer
