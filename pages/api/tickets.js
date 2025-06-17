export default async function handler(req, res) {
  const action = req.method === 'GET'  ? 'getTickets'
               : req.method === 'POST' ? 'createTicket'
               : null;
  if (!action) return res.status(405).end('Method Not Allowed');

  const payload = req.method === 'GET' ? req.query : req.body;
  const url = `${process.env.CLOUDFLARE_WORKER_URL}?action=${action}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await resp.json();

  if (data.status === 'error') {
    return res.status(400).json({ error: data.message });
  }

  res.status(200).json(data);
}
