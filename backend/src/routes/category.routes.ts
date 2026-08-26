import { Router } from "express"

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js"

const router = Router()

// GET all categories
router.get("/", getCategories)

// GET single category
router.get("/:id", getCategoryById)

// CREATE category
router.post("/", createCategory)

// UPDATE category
router.put("/:id", updateCategory)

// DELETE category
router.delete("/:id", deleteCategory)

export default router