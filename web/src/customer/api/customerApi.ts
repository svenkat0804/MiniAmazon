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


export async function customerGet(
  path: string
) {

  return request(path, {
    method: "GET"
  })
}


export async function customerPost(
  path: string,
  body: unknown
) {

  return request(path, {
    method: "POST",
    body: JSON.stringify(body)
  })
}


export async function customerPut(
  path: string,
  body: unknown
) {

  return request(path, {
    method: "PUT",
    body: JSON.stringify(body)
  })
}


export async function customerDelete(
  path: string
) {

  return request(path, {
    method: "DELETE"
  })
}


export async function getSiteSettings() {

  return request("/site/settings")
}


export async function getNotifications(params: Record<string, string | number>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    query.append(key, String(value))
  })
  return request(`/notifications?${query.toString()}`)
}


export async function getUnreadNotificationCount(role: string, referenceId: number) {
  return request(`/notifications/unread-count?role=${encodeURIComponent(role)}&reference_id=${referenceId}`)
}


export async function markNotificationRead(id: number) {
  return request(`/notifications/${id}/read`, {
    method: "PUT"
  })
}


export async function markAllNotificationsRead(role: string, referenceId: number) {
  return request("/notifications/mark-all-read", {
    method: "PUT",
    body: JSON.stringify({ role, reference_id: referenceId })
  })
}
