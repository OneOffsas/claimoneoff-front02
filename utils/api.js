// /utils/api.js

export const API_URL = "https://script.google.com/macros/s/AKfycbz4oaV2F4-DeHC4-oYaR8wiTgha1ROTXN1WAMQT9H72SPI6b1NCtlClxZ8WwR0f6rZ9lg/exec";

// Fonction générique d'appel à l'API
export async function apiCall(action, data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  return await res.json();
}
