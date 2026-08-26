import { useEffect, useState } from "react"
import type { FormEvent } from "react"

import {
  adminGet,
  adminPost,
  adminPut,
  adminDelete
} from "../api/adminApi"


// =====================================================
// MODEL
// =====================================================

type Category = {
  id: number
  name: string
}


// =====================================================
// PAGE
// =====================================================

function AdminCategoriesPage() {

  // ===================================================
  // LIST
  // ===================================================

  const [categories, setCategories] =
    useState<Category[]>([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  // ===================================================
  // ADD
  // ===================================================

  const [showAddForm, setShowAddForm] =
    useState(false)

  const [newCategoryName, setNewCategoryName] =
    useState("")

  const [adding, setAdding] =
    useState(false)


  // ===================================================
  // EDIT
  // ===================================================

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null)

  const [editCategoryName, setEditCategoryName] =
    useState("")

  const [updating, setUpdating] =
    useState(false)


  // ===================================================
  // DELETE
  // ===================================================

  const [deletingId, setDeletingId] =
    useState<number | null>(null)


  // =====================================================
  // GET CATEGORIES
  // =====================================================

  const loadCategories = async () => {

    try {

      setLoading(true)
      setError("")

      const data =
        await adminGet("/categories")

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

    } finally {

      setLoading(false)

    }
  }


  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {

    loadCategories()

  }, [])


  // =====================================================
  // ADD CATEGORY
  // =====================================================

  const handleAddCategory = async (
    event: FormEvent
  ) => {

    event.preventDefault()

    const name =
      newCategoryName.trim()


    if (!name) {

      setError(
        "Category name is required"
      )

      return
    }


    try {

      setAdding(true)
      setError("")


      await adminPost(
        "/categories",
        {
          name
        }
      )


      // Clear form

      setNewCategoryName("")

      setShowAddForm(false)


      // Refresh list

      await loadCategories()

    } catch (error) {

      console.error(
        "Add category error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create category"
      )

    } finally {

      setAdding(false)

    }
  }


  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = (
    category: Category
  ) => {

    setEditingCategory(
      category
    )

    setEditCategoryName(
      category.name
    )

    setError("")

  }


  // =====================================================
  // UPDATE CATEGORY
  // =====================================================

  const handleUpdateCategory = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    if (!editingCategory) {
      return
    }


    const name =
      editCategoryName.trim()


    if (!name) {

      setError(
        "Category name is required"
      )

      return
    }


    try {

      setUpdating(true)
      setError("")


      await adminPut(
        `/categories/${editingCategory.id}`,
        {
          name
        }
      )


      // Close edit

      setEditingCategory(null)

      setEditCategoryName("")


      // Refresh

      await loadCategories()

    } catch (error) {

      console.error(
        "Update category error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update category"
      )

    } finally {

      setUpdating(false)

    }
  }


  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const handleDelete = async (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this category?"
      )


    if (!confirmed) {
      return
    }


    try {

      setDeletingId(id)
      setError("")


      await adminDelete(
        `/categories/${id}`
      )


      // Refresh

      await loadCategories()

    } catch (error) {

      console.error(
        "Delete category error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete category"
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

    setNewCategoryName("")

    setError("")

  }


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {

    setEditingCategory(null)

    setEditCategoryName("")

    setError("")

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div style={styles.page}>


      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Categories
          </h1>

          <p style={styles.subtitle}>
            Manage product categories
          </p>

        </div>


        <button
          type="button"
          onClick={() => {

            setShowAddForm(true)

            setEditingCategory(null)

            setError("")

          }}
          style={styles.addButton}
        >
          + Add Category
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
          ADD CATEGORY
      ================================================= */}

      {showAddForm && (

        <div style={styles.formCard}>


          <div style={styles.formHeader}>

            <h2 style={styles.formTitle}>
              Add Category
            </h2>


            <button
              type="button"
              onClick={
                handleCancelAdd
              }
              style={styles.closeButton}
            >
              ×
            </button>

          </div>


          <form
            onSubmit={
              handleAddCategory
            }
          >

            <label style={styles.label}>
              Category Name
            </label>


            <input
              type="text"
              value={
                newCategoryName
              }
              onChange={(event) =>
                setNewCategoryName(
                  event.target.value
                )
              }
              placeholder="Enter category name"
              autoFocus
              disabled={adding}
              style={styles.input}
            />


            <div style={styles.formActions}>


              <button
                type="button"
                onClick={
                  handleCancelAdd
                }
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
                  : "Add Category"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =================================================
          EDIT CATEGORY
      ================================================= */}

      {editingCategory && (

        <div style={styles.formCard}>


          <div style={styles.formHeader}>

            <h2 style={styles.formTitle}>
              Edit Category
            </h2>


            <button
              type="button"
              onClick={
                handleCancelEdit
              }
              style={styles.closeButton}
            >
              ×
            </button>

          </div>


          <form
            onSubmit={
              handleUpdateCategory
            }
          >


            <label style={styles.label}>
              Category Name
            </label>


            <input
              type="text"
              value={
                editCategoryName
              }
              onChange={(event) =>
                setEditCategoryName(
                  event.target.value
                )
              }
              autoFocus
              disabled={updating}
              style={styles.input}
            />


            <div style={styles.formActions}>


              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
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
                  : "Update Category"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =================================================
          CATEGORY LIST
      ================================================= */}

      <div style={styles.listCard}>


        <div style={styles.listHeader}>

          <div>

            <h2 style={styles.listTitle}>
              Category List
            </h2>

            <p style={styles.listSubtitle}>
              All product categories
            </p>

          </div>


          <span style={styles.count}>
            {categories.length}
          </span>

        </div>


        {/* LOADING */}

        {loading ? (

          <div style={styles.empty}>

            <p>
              Loading categories...
            </p>

          </div>

        ) : categories.length === 0 ? (


          /* EMPTY */

          <div style={styles.empty}>

            <p>
              No categories found.
            </p>


            <button
              type="button"
              onClick={() => {

                setShowAddForm(true)

                setError("")

              }}
              style={
                styles.emptyButton
              }
            >
              Add your first category
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

                  <th
                    style={styles.th}
                  >
                    ID
                  </th>


                  <th
                    style={styles.th}
                  >
                    Category Name
                  </th>


                  <th
                    style={styles.th}
                  >
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {categories.map(
                  (category) => (

                    <tr
                      key={
                        category.id
                      }
                      style={styles.tr}
                    >


                      <td
                        style={styles.td}
                      >
                        {category.id}
                      </td>


                      <td
                        style={styles.td}
                      >

                        <strong>
                          {category.name}
                        </strong>

                      </td>


                      <td
                        style={styles.td}
                      >


                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              category
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
                              category.id
                            )
                          }
                          disabled={
                            deletingId ===
                            category.id
                          }
                          style={
                            styles.deleteButton
                          }
                        >

                          {deletingId ===
                          category.id
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
    maxWidth: "1200px",
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
    marginBottom: "20px"
  },


  formTitle: {
    margin: 0,
    fontSize: "20px"
  },


  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: "25px",
    cursor: "pointer"
  },


  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600
  },


  input: {
    width: "100%",
    maxWidth: "500px",
    boxSizing: "border-box" as const,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px"
  },


  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px"
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
    backgroundColor: "#fafafa"
  },


  td: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee"
  },


  tr: {
    height: "55px"
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


export default AdminCategoriesPage