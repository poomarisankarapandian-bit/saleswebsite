# 🛍️ ShopEase — Full Stack Sales Website

React + Redux Toolkit + Node.js + Express + MongoDB

---

## 📁 Folder Structure

```
saleswebsite/
├── frontend/          ← React app (Redux Toolkit)
└── backend/           ← Node.js + Express API
```

---

## ⚡ Quick Start

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI
npm run dev
```

### 2. Seed Sample Data
```bash
cd backend
node seed.js
# Admin: admin@salessite.com / admin123
# User:  john@example.com / user123
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

App runs at: http://localhost:3000
API runs at: http://localhost:5000

---

## 🔑 Features

### Customer
- 🏠 Homepage with hero, categories, featured products
- 🔍 Product search, filter by category/price, sort
- 🛒 Cart with quantity control (localStorage persisted)
- ✅ Checkout with address + payment method
- 📦 Order tracking and history
- ⭐ Product reviews and ratings
- 👤 User profile and settings

### Admin
- 📊 Dashboard with revenue, orders, top products stats
- 🛍️ Product CRUD (create, edit, delete, feature)
- 📋 Order management with status updates
- 👥 User management

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Redux Toolkit, React Router v6 |
| State | Redux Toolkit + createAsyncThunk |
| Styling | Plain CSS with CSS variables |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File Upload | Multer |

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/users/register | Register |
| POST | /api/users/login | Login |
| GET | /api/products | List products (filter/search/paginate) |
| GET | /api/products/:id | Product detail |
| POST | /api/orders | Create order |
| GET | /api/orders/myorders | My orders |
| GET | /api/dashboard/stats | Admin stats |

---

## 💡 MongoDB Setup

1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Copy connection string
4. Paste in backend/.env as MONGO_URI

