import express from "express"
import cors from "cors"
import "dotenv/config"

import adminRoutes from "./routes/admin.routes.js"
import productRoutes from "./routes/product.routes.js"
import categoryRoutes from "./routes/category.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

// ================================
// Health
// ================================

app.get("/api/health", (_req, res) => {
  res.json({
    message: "MiniAmazon backend is running"
  })
})

// ================================
// Admin
// ================================

app.use("/api/admin", adminRoutes)

// ================================
// Products
// ================================

app.use(
  "/api/admin/products",
  productRoutes
)

// ================================
// Categories
// ================================

app.use(
  "/api/categories",
  categoryRoutes
)

// ================================
// 404
// ================================

app.use((_req, res) => {
  res.status(404).json({
    message: "API route not found"
  })
})

// ================================
// Server
// ================================

const PORT =
  Number(process.env.PORT) || 5001

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  )
})