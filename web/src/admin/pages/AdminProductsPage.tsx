import { useEffect, useState } from "react"
import type { FormEvent } from "react"

import {
  adminGet,
  adminPost,
  adminPut,
  adminDelete
} from "../api/adminApi"


// =====================================================
// MODELS
// =====================================================

type Category = {
  id: number
  name: string
}


type Product = {
  id: number
  category_id: number
  category_name: string
  name: string
  description: string | null
  price: number
  stock: number
  is_active: boolean
  image_url: string | null
  created_at: string
}


// =====================================================
// PAGE
// =====================================================

function AdminProductsPage() {

  // ===================================================
  // PRODUCTS
  // ===================================================

  const [products, setProducts] =
    useState<Product[]>([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  // ===================================================
  // CATEGORIES
  // ===================================================

  const [categories, setCategories] =
    useState<Category[]>([])


  // ===================================================
  // ADD PRODUCT
  // ===================================================

  const [showAddForm, setShowAddForm] =
    useState(false)

  const [newCategoryId, setNewCategoryId] =
    useState("")

  const [newProductName, setNewProductName] =
    useState("")

  const [newDescription, setNewDescription] =
    useState("")

  const [newPrice, setNewPrice] =
    useState("")

  const [newStock, setNewStock] =
    useState("")

  const [newIsActive, setNewIsActive] =
    useState(true)

  const [newImageUrl, setNewImageUrl] =
    useState("")

  const [adding, setAdding] =
    useState(false)


  // ===================================================
  // EDIT PRODUCT
  // ===================================================

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null)

  const [editCategoryId, setEditCategoryId] =
    useState("")

  const [editProductName, setEditProductName] =
    useState("")

  const [editDescription, setEditDescription] =
    useState("")

  const [editPrice, setEditPrice] =
    useState("")

  const [editStock, setEditStock] =
    useState("")

  const [editIsActive, setEditIsActive] =
    useState(true)

  const [editImageUrl, setEditImageUrl] =
    useState("")

  const [updating, setUpdating] =
    useState(false)


  // ===================================================
  // DELETE
  // ===================================================

  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  const [searchQuery, setSearchQuery] =
    useState("")

  const [currentPage, setCurrentPage] =
    useState(1)

  const [itemsPerPage] =
    useState(10)


  // =====================================================
  // GET PRODUCTS
  // =====================================================

  const loadProducts = async () => {

    try {

      setLoading(true)
      setError("")

      const data =
        await adminGet("/admin/products") as { products: Product[] }

      setProducts(
        data.products || []
      )

    } catch (error) {

      console.error(
        "Load products error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load products"
      )

    } finally {

      setLoading(false)

    }
  }


  // =====================================================
  // GET CATEGORIES
  // =====================================================

  const loadCategories = async () => {

    try {

      const data =
        await adminGet("/categories") as { categories: { id: number; name: string }[] }

      setCategories(
        data.categories || []
      )

    } catch (error) {

      console.error(
        "Load categories error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load categories"
      )

    }
  }


  // =====================================================
  // LOAD PAGE
  // =====================================================

  useEffect(() => {

    loadProducts()
    loadCategories()

  }, [])


  // =====================================================
  // RESET ADD FORM
  // =====================================================

  const resetAddForm = () => {

    setNewCategoryId("")
    setNewProductName("")
    setNewDescription("")
    setNewPrice("")
    setNewStock("")
    setNewIsActive(true)
    setNewImageUrl("")

  }


  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleAddProduct = async (
    event: FormEvent
  ) => {

    event.preventDefault()

    const name =
      newProductName.trim()

    const description =
      newDescription.trim()

    const categoryId =
      Number(newCategoryId)

    const price =
      Number(newPrice)

    const stock =
      Number(newStock || 0)


    if (!categoryId) {

      setError(
        "Please select a category"
      )

      return
    }


    if (!name) {

      setError(
        "Product name is required"
      )

      return
    }


    if (
      !newPrice ||
      Number.isNaN(price) ||
      price < 0
    ) {

      setError(
        "Please enter a valid price"
      )

      return
    }


    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {

      setError(
        "Please enter a valid stock"
      )

      return
    }


    try {

      setAdding(true)
      setError("")


      await adminPost(
        "/admin/products",
        {
          category_id: categoryId,
          name,
          description: description || null,
          price,
          stock,
          is_active: newIsActive,
          image_url: newImageUrl || null
        }
      )


      resetAddForm()

      setShowAddForm(false)

      await loadProducts()

    } catch (error) {

      console.error(
        "Add product error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create product"
      )

    } finally {

      setAdding(false)

    }
  }


  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = (
    product: Product
  ) => {

    setEditingProduct(product)

    setEditCategoryId(
      String(product.category_id)
    )

    setEditProductName(
      product.name
    )

    setEditDescription(
      product.description || ""
    )

    setEditPrice(
      String(product.price)
    )

    setEditStock(
      String(product.stock)
    )

    setEditIsActive(
      product.is_active
    )

    setEditImageUrl(
      product.image_url || ""
    )

    setShowAddForm(false)

    setError("")

  }


  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdateProduct = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    if (!editingProduct) {
      return
    }


    const name =
      editProductName.trim()

    const description =
      editDescription.trim()

    const categoryId =
      Number(editCategoryId)

    const price =
      Number(editPrice)

    const stock =
      Number(editStock || 0)


    if (!categoryId) {

      setError(
        "Please select a category"
      )

      return
    }


    if (!name) {

      setError(
        "Product name is required"
      )

      return
    }


    if (
      !editPrice ||
      Number.isNaN(price) ||
      price < 0
    ) {

      setError(
        "Please enter a valid price"
      )

      return
    }


    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {

      setError(
        "Please enter a valid stock"
      )

      return
    }


    try {

      setUpdating(true)
      setError("")


      await adminPut(
        `/admin/products/${editingProduct.id}`,
        {
          category_id: categoryId,
          name,
          description: description || null,
          price,
          stock,
          is_active: editIsActive,
          image_url: editImageUrl || null
        }
      )


      setEditingProduct(null)

      await loadProducts()

    } catch (error) {

      console.error(
        "Update product error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update product"
      )

    } finally {

      setUpdating(false)

    }
  }


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      )


    if (!confirmed) {
      return
    }


    try {

      setDeletingId(id)
      setError("")


      await adminDelete(
        `/admin/products/${id}`
      )


      await loadProducts()

    } catch (error) {

      console.error(
        "Delete product error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete product"
      )

    } finally {

      setDeletingId(null)

    }
  }


  // =====================================================
  // CANCEL ADD
  // =====================================================

  const handleCancelAdd = () => {

    setShowAddForm(false)

    resetAddForm()

    setError("")

  }


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {

    setEditingProduct(null)

    setEditCategoryId("")
    setEditProductName("")
    setEditDescription("")
    setEditPrice("")
    setEditStock("")
    setEditIsActive(true)

    setError("")

  }


  // =====================================================
  // OPEN ADD
  // =====================================================

  const handleOpenAdd = () => {

    setShowAddForm(true)

    setEditingProduct(null)

    resetAddForm()

    setError("")

  }


  // =====================================================
  // UI
  // =====================================================

  const filteredProducts = (() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return products
    return products.filter(
      (product) =>
        String(product.id).includes(query) ||
        product.name.toLowerCase().includes(query)
    )
  })()

  const paginatedProducts = (() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  })()

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (

    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Products
          </h1>

          <p style={styles.subtitle}>
            Manage your products
          </p>

        </div>


        <button
          type="button"
          onClick={handleOpenAdd}
          style={styles.addButton}
        >
          + Add Product
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div style={styles.error}>
          {error}
        </div>

      )}


      {/* =================================================
          ADD PRODUCT FORM
      ================================================= */}

      {showAddForm && (

        <div style={styles.formCard}>

          <div style={styles.formHeader}>

            <div>

              <h2 style={styles.formTitle}>
                Add Product
              </h2>

              <p style={styles.formSubtitle}>
                Create a new product
              </p>

            </div>


            <button
              type="button"
              onClick={handleCancelAdd}
              style={styles.closeButton}
            >
              ×
            </button>

          </div>


          <form
            onSubmit={handleAddProduct}
          >

            <div style={styles.formGrid}>

              {/* Category */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Category
                </label>

                <select
                  value={newCategoryId}
                  onChange={(event) =>
                    setNewCategoryId(
                      event.target.value
                    )
                  }
                  disabled={adding}
                  style={styles.input}
                >

                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (category) => (

                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* Product Name */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Product Name
                </label>

                <input
                  type="text"
                  value={newProductName}
                  onChange={(event) =>
                    setNewProductName(
                      event.target.value
                    )
                  }
                  placeholder="Enter product name"
                  disabled={adding}
                  style={styles.input}
                />

              </div>


              {/* Price */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(event) =>
                    setNewPrice(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  disabled={adding}
                  style={styles.input}
                />

              </div>


              {/* Stock */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={newStock}
                  onChange={(event) =>
                    setNewStock(
                      event.target.value
                    )
                  }
                  placeholder="0"
                  disabled={adding}
                  style={styles.input}
                />

              </div>


              {/* Description */}

              <div style={styles.fieldFull}>

                <label style={styles.label}>
                  Description
                </label>

                <textarea
                  value={newDescription}
                  onChange={(event) =>
                    setNewDescription(
                      event.target.value
                    )
                  }
                  placeholder="Enter product description"
                  disabled={adding}
                  rows={4}
                  style={
                    styles.textarea
                  }
                />

              </div>


              {/* Active */}

              <div style={styles.fieldFull}>

                <label
                  style={
                    styles.checkboxLabel
                  }
                >

                  <input
                    type="checkbox"
                    checked={newIsActive}
                    onChange={(event) =>
                      setNewIsActive(
                        event.target.checked
                      )
                    }
                    disabled={adding}
                  />

                  Product is active

                </label>

              </div>


              {/* Product Image */}

              <div style={styles.fieldFull}>

                <label style={styles.label}>
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  disabled={adding}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    if (file.size > 5 * 1024 * 1024) {
                      setError("Image size must be less than 5MB")
                      return
                    }
                    const reader = new FileReader()
                    reader.onload = () => {
                      setNewImageUrl(
                        reader.result as string
                      )
                    }
                    reader.readAsDataURL(file)
                  }}
                  style={styles.input}
                />

                <p style={styles.uploadHint}>
                  Supported: PNG, JPG, JPEG, WEBP, GIF (Max 5MB)
                </p>

                {newImageUrl && (
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    style={
                      styles.imagePreview
                    }
                  />
                )}

              </div>

            </div>


            <div style={styles.formActions}>

              <button
                type="button"
                onClick={handleCancelAdd}
                disabled={adding}
                style={
                  styles.cancelButton
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={adding}
                style={
                  styles.saveButton
                }
              >
                {adding
                  ? "Adding..."
                  : "Add Product"}
              </button>

            </div>

          </form>

        </div>

      )}


      {/* =================================================
          EDIT PRODUCT FORM
      ================================================= */}

      {editingProduct && (

        <div style={styles.formCard}>

          <div style={styles.formHeader}>

            <div>

              <h2 style={styles.formTitle}>
                Edit Product
              </h2>

              <p style={styles.formSubtitle}>
                Update product information
              </p>

            </div>


            <button
              type="button"
              onClick={handleCancelEdit}
              style={styles.closeButton}
            >
              ×
            </button>

          </div>


          <form
            onSubmit={handleUpdateProduct}
          >

            <div style={styles.formGrid}>

              {/* Category */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Category
                </label>

                <select
                  value={editCategoryId}
                  onChange={(event) =>
                    setEditCategoryId(
                      event.target.value
                    )
                  }
                  disabled={updating}
                  style={styles.input}
                >

                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (category) => (

                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* Product Name */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Product Name
                </label>

                <input
                  type="text"
                  value={editProductName}
                  onChange={(event) =>
                    setEditProductName(
                      event.target.value
                    )
                  }
                  disabled={updating}
                  style={styles.input}
                />

              </div>


              {/* Price */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editPrice}
                  onChange={(event) =>
                    setEditPrice(
                      event.target.value
                    )
                  }
                  disabled={updating}
                  style={styles.input}
                />

              </div>


              {/* Stock */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={editStock}
                  onChange={(event) =>
                    setEditStock(
                      event.target.value
                    )
                  }
                  disabled={updating}
                  style={styles.input}
                />

              </div>


              {/* Description */}

              <div style={styles.fieldFull}>

                <label style={styles.label}>
                  Description
                </label>

                <textarea
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(
                      event.target.value
                    )
                  }
                  disabled={updating}
                  rows={4}
                  style={
                    styles.textarea
                  }
                />

              </div>


              {/* Active */}

              <div style={styles.fieldFull}>

                <label
                  style={
                    styles.checkboxLabel
                  }
                >

                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(event) =>
                      setEditIsActive(
                        event.target.checked
                      )
                    }
                    disabled={updating}
                  />

                  Product is active

                </label>

              </div>


              {/* Product Image */}

              <div style={styles.fieldFull}>

                <label style={styles.label}>
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  disabled={updating}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    if (file.size > 5 * 1024 * 1024) {
                      setError("Image size must be less than 5MB")
                      return
                    }
                    const reader = new FileReader()
                    reader.onload = () => {
                      setEditImageUrl(
                        reader.result as string
                      )
                    }
                    reader.readAsDataURL(file)
                  }}
                  style={styles.input}
                />

                <p style={styles.uploadHint}>
                  Supported: PNG, JPG, JPEG, WEBP, GIF (Max 5MB)
                </p>

                {editImageUrl && (
                  <img
                    src={editImageUrl}
                    alt="Preview"
                    style={
                      styles.imagePreview
                    }
                  />
                )}

              </div>

            </div>


            <div style={styles.formActions}>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={updating}
                style={
                  styles.cancelButton
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={updating}
                style={
                  styles.saveButton
                }
              >

                {updating
                  ? "Updating..."
                  : "Update Product"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =================================================
          PRODUCT LIST
      ================================================= */}

      <div style={styles.listCard}>

        <div style={styles.listHeader}>

          <div>

            <h2 style={styles.listTitle}>
              Product List
            </h2>

            <p style={styles.listSubtitle}>
              All products
            </p>

          </div>


          <input
            type="text"
            placeholder="Search by ID or name..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            style={styles.searchInput}
          />


          <span style={styles.count}>
            {filteredProducts.length}
          </span>

        </div>

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={styles.paginationButton}
            >
              Previous
            </button>
            <span style={styles.paginationInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}


        {/* LOADING */}

        {loading ? (

          <div style={styles.empty}>

            <p>
              Loading products...
            </p>

          </div>

        ) : paginatedProducts.length === 0 ? (

          /* EMPTY */

          <div style={styles.empty}>

            <p>
              No products found.
            </p>

            <button
              type="button"
              onClick={handleOpenAdd}
              style={
                styles.emptyButton
              }
            >
              Add your first product
            </button>

          </div>

        ) : (

          /* TABLE */

          <div
            style={
              styles.tableWrapper
            }
          >

            <table
              style={styles.table}
            >

              <thead>

                <tr>

                  <th style={styles.th}>
                    ID
                  </th>

                  <th style={styles.th}>
                    Product
                  </th>

                  <th style={styles.th}>
                    Category
                  </th>

                  <th style={styles.th}>
                    Price
                  </th>

                  <th style={styles.th}>
                    Stock
                  </th>

                  <th style={styles.th}>
                    Status
                  </th>

                  <th style={styles.th}>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {paginatedProducts.map(
                  (product) => (

                    <tr
                      key={product.id}
                      style={styles.tr}
                    >

                      {/* ID */}

                      <td style={styles.td}>
                        {product.id}
                      </td>


                      {/* Product */}

                      <td style={styles.td}>

                        <div>

                          <strong>
                            {product.name}
                          </strong>

                          {product.description && (

                            <p
                              style={
                                styles.description
                              }
                            >
                              {product.description}
                            </p>

                          )}

                        </div>

                      </td>


                      {/* Category */}

                      <td style={styles.td}>

                        {product.category_name}

                      </td>


                      {/* Price */}

                      <td style={styles.td}>

                        ₹{Number(
                          product.price
                        ).toFixed(2)}

                      </td>


                      {/* Stock */}

                      <td style={styles.td}>

                        <span
                          style={
                            product.stock === 0
                              ? styles.outOfStock
                              : styles.stock
                          }
                        >

                          {product.stock}

                        </span>

                      </td>


                      {/* Status */}

                      <td style={styles.td}>

                        <span
                          style={
                            product.is_active
                              ? styles.activeStatus
                              : styles.inactiveStatus
                          }
                        >

                          {product.is_active
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>


                      {/* Actions */}

                      <td style={styles.td}>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              product
                            )
                          }
                          style={
                            styles.editButton
                          }
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                          disabled={
                            deletingId ===
                            product.id
                          }
                          style={
                            styles.deleteButton
                          }
                        >

                          {deletingId ===
                          product.id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    padding: "32px",
    maxWidth: "1400px",
    margin: "0 auto"
  },


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },


  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700
  },


  subtitle: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#666"
  },


  addButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px"
  },


  error: {
    padding: "12px 16px",
    marginBottom: "20px",
    borderRadius: "7px",
    backgroundColor: "#ffe5e5",
    color: "#b00020",
    border: "1px solid #ffcccc"
  },


  formCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "24px",
    marginBottom: "24px"
  },


  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },


  formTitle: {
    margin: 0,
    fontSize: "20px"
  },


  formSubtitle: {
    margin: "5px 0 0",
    color: "#777",
    fontSize: "14px"
  },


  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "25px",
    cursor: "pointer"
  },


  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px"
  },


  field: {
    display: "flex",
    flexDirection: "column" as const
  },


  fieldFull: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column" as const
  },


  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    fontSize: "14px"
  },


  input: {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    backgroundColor: "#fff"
  },


  textarea: {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    resize: "vertical" as const
  },


  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
    cursor: "pointer"
  },


  imagePreview: {
    marginTop: "10px",
    width: "120px",
    height: "120px",
    objectFit: "cover" as const,
    borderRadius: "8px",
    border: "1px solid #ddd"
  },

  uploadHint: {
    fontSize: "12px",
    color: "#888",
    marginTop: "4px"
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "24px"
  },


  cancelButton: {
    padding: "10px 18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer"
  },


  saveButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600
  },


  listCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden"
  },


  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #eee"
  },


  searchInput: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    minWidth: "220px"
  },


  listTitle: {
    margin: 0,
    fontSize: "20px"
  },


  listSubtitle: {
    margin: "5px 0 0",
    color: "#777",
    fontSize: "14px"
  },


  count: {
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "#f0f0f0",
    fontWeight: 600
  },


  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "20px"
  },

  paginationButton: {
    padding: "8px 16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "14px"
  },

  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed"
  },

  paginationInfo: {
    fontSize: "14px",
    color: "#666"
  },

  tableWrapper: {
    overflowX: "auto" as const
  },


  table: {
    width: "100%",
    borderCollapse: "collapse" as const
  },


  th: {
    padding: "15px 20px",
    textAlign: "left" as const,
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    backgroundColor: "#fafafa",
    whiteSpace: "nowrap" as const
  },


  td: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle" as const
  },


  tr: {
    height: "65px"
  },


  description: {
    margin: "5px 0 0",
    color: "#777",
    fontSize: "13px",
    maxWidth: "300px",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis"
  },


  stock: {
    fontWeight: 600
  },


  outOfStock: {
    fontWeight: 600,
    color: "#b00020"
  },


  activeStatus: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "#e6f7ed",
    color: "#16794c",
    fontSize: "13px",
    fontWeight: 600
  },


  inactiveStatus: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "#f1f1f1",
    color: "#666",
    fontSize: "13px",
    fontWeight: 600
  },


  editButton: {
    marginRight: "8px",
    padding: "7px 14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    cursor: "pointer"
  },


  deleteButton: {
    padding: "7px 14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },


  empty: {
    padding: "50px",
    textAlign: "center" as const,
    color: "#666"
  },


  emptyButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }

}


export default AdminProductsPage