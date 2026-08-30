const API_BASE_URL =
  "http://localhost:5001/api"


function getAuthHeaders(): Record<string, string> {
  const token =
    localStorage.getItem(
      "mini-amazon-admin-token"
    )

  if (token) {
    return {
      Authorization: `Bearer ${token}`
    }
  }

  return {}
}


async function request(
  path: string,
  options: RequestInit = {}
) {

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    }
  )


  const contentType =
    response.headers.get("content-type") || ""


  let data: unknown


  if (
    contentType.includes("application/json")
  ) {

    data = await response.json()

  } else {

    await response.text()

    throw new Error(
      `Server returned invalid response (${response.status})`
    )
  }


  if (!response.ok) {

    const errorData = data as { message?: string }

    throw new Error(
      errorData.message ||
      `Request failed (${response.status})`
    )
  }


  return data
}


export async function adminGet(
  path: string
) {

  return request(path, {
    method: "GET"
  })
}


export async function adminPost(
  path: string,
  body: unknown
) {

  return request(path, {
    method: "POST",
    body: JSON.stringify(body)
  })
}


export async function adminPut(
  path: string,
  body: unknown
) {

  return request(path, {
    method: "PUT",
    body: JSON.stringify(body)
  })
}


export async function adminDelete(
  path: string
) {

  return request(path, {
    method: "DELETE"
  })
}


export async function adminLogin(
  email: string,
  password: string
) {

  const response = await fetch(
    `${API_BASE_URL}/admin/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    )
  }

  return data
}


export async function getAdminStats() {

  return request("/admin/orders/stats")
}


export async function getAdminCustomers() {

  return request("/admin/customers")
}


export async function getAdminProducts() {

  return request("/admin/products")
}


export async function getAdminOrders() {

  return request("/admin/orders")
}


export async function getAdminComplaints() {

  return request("/admin/complaints")
}


export async function getSiteSettings() {

  return request("/site/settings")
}


export async function updateSiteSetting(
  key: string,
  value: string
) {

  return request("/site/settings", {
    method: "PUT",
    body: JSON.stringify({ key, value })
  })
}


export async function updateAdminProfile(
  data: { name?: string; image_url?: string | null }
) {

  return request("/admin/profile", {
    method: "PUT",
    body: JSON.stringify(data)
  })
}
