// utils/api.js
export const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/"; // remplace

export async function apiCall(action, data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  return await res.json();
}
