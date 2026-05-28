# 🚀 How to Run ShopEase

## Step 1 — Backend Setup

Open Terminal / PowerShell:

```
cd saleswebsite\backend
npm install
```

Create .env file (copy from .env.example):
```
cp .env.example .env
```

Open .env and add your MongoDB URI:
```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/salesdb
JWT_SECRET=mysecretkey123
PORT=5000
```

Run seed data (sample products + users):
```
node seed.js
```

Start backend server:
```
npm run dev
```
✅ Backend running at http://localhost:5000

---

## Step 2 — Frontend Setup

Open a NEW Terminal / PowerShell:

```
cd saleswebsite\frontend
npm install
npm start
```
✅ Frontend running at http://localhost:3000

---

## Step 3 — Login

Open browser → http://localhost:3000

Admin Login:
  Email:    admin@salessite.com
  Password: admin123

User Login:
  Email:    john@example.com
  Password: user123

---

## ⚠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| npm run dev not found (frontend) | Use: npm start |
| Cannot connect to MongoDB | Check MONGO_URI in .env file |
| Port 3000 already in use | Close other apps or use: set PORT=3001 && npm start |
| Port 5000 already in use | Change PORT=5001 in .env |
| CORS error | Make sure backend is running on port 5000 |

