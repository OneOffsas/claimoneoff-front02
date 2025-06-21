export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end('Method Not Allowed');
  const { societe, email, role } = req.body;
  const scriptUrl = "https://script.google.com/macros/s/AKfycbxVsHNzAtfR55M3t7A-vk7RAZz2EO6fqzxKmlUACnNWnauWuQAt3ecSuPiNSDvoCI5-lw/exec";

  // Action à prévoir côté Apps Script
  const resp = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getStats", societe, email, role }),
  });
  const text = await resp.text();
  let data;
  try { data = JSON.parse(text); } catch (e) { return res.status(500).json({ error: text }); }
  res.status(200).json(data);
}
