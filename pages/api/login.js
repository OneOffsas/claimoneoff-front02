import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { email, password } = req.body;
  const passwordHash = sha256(password);

  const url = `${process.env.CLOUDFLARE_WORKER_URL}?action=login`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, passwordHash }),
  });
  const data = await resp.json();

  if (data.status === 'error') {
    return res.status(401).json({ error: data.message });
  }

  res.status(200).json(data);
}
