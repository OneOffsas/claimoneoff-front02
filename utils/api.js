const API_URL = "https://script.google.com/macros/s/AKfycbzC7iIJ9QWWFj_DelXABwGp-5JvDaDWLbRDEN7Wj__DoLTvoRmkqLKow0n09JtdWJdDGg/exec";

export async function apiCall(action, data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  return await res.json();
}
