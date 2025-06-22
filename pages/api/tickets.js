// /pages/api/tickets.js
export default async function handler(req, res) {
  const { email, role, societe } = req.body;
  // Utilise l'URL Cloudflare Worker ou Apps Script
  const url = process.env.CLOUDFLARE_WORKER_URL || "https://yellow-violet-1ba5.oneoffsas.workers.dev/";
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getTickets", email, role, societe })
  });
  const json = await r.json();
  res.status(200).json(json);
}
