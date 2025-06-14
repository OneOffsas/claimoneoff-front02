const API_URL = "https://script.google.com/macros/s/AKfycbzdNBpYqhrXe0kuIkBODAW9NLziYWjK-E8vspuwGqh6KBLjMeCwD_mfE-MfZtJmsmo0tw/exec";

export async function apiCall(action, data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  return await res.json();
}
