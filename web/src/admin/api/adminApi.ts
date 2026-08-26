const API_BASE_URL =
  "http://localhost:5001/api"


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
        ...(options.headers || {})
      }
    }
  )


  const contentType =
    response.headers.get("content-type") || ""


  let data: any


  if (
    contentType.includes("application/json")
  ) {

    data = await response.json()

  } else {

    const text =
      await response.text()

    throw new Error(
      `Server returned invalid response (${response.status})`
    )
  }


  if (!response.ok) {

    throw new Error(
      data?.message ||
      `Request failed (${response.status})`
    )
  }


  return data
}


// GET
export async function adminGet(
  path: string
) {

  return request(path, {
    method: "GET"
  })
}


// POST
export async function adminPost(
  path: string,
  body: unknown
) {

  return request(path, {
    method: "POST",
    body: JSON.stringify(body)
  })
}


// PUT
export async function adminPut(
  path: string,
  body: unknown
) {

  return request(path, {
    method: "PUT",
    body: JSON.stringify(body)
  })
}


// DELETE
export async function adminDelete(
  path: string
) {

  return request(path, {
    method: "DELETE"
  })
}