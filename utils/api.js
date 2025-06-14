const API_URL = "https://script.google.com/macros/s/AKfycbzM3_gHbhIQsDvQXRFP8fPGzfeDoEbCCkY8lxSpWxaXSopU0u1X6jP2LPTjz8XkSShDKg/exec";

export async function apiCall(action, data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  return await res.json();
}
