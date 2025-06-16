// utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiCall(action, data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  })
  return res.json()
}

