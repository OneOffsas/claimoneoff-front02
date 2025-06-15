// /utils/api.js
export const API_URL = "https://script.google.com/macros/s/AKfycbyqgEfqr7VcWjw75Q4O5KBew3L2gbHL3_I8vMsz_mo1wsHKxnDTCixAFN4RQTC_3_xS/exec";

// Fonction utilitaire pour appeler l’API
export async function apiCall(action, data = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  return await res.json();
}
