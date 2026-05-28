// routes/uploadRoutes.js
import express from 'express'
import multer from 'multer'
import path from 'path'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/') },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  if (extname && mimetype) cb(null, true)
  else cb(new Error('Images only (jpeg, jpg, png, webp)'))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  res.json({ imageUrl: `/uploads/${req.file.filename}` })
})

export default router
