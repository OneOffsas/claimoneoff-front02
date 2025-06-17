import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { email, password, nom, prenom, societe } = req.body;
  const passwordHash = sha256(password);

  const url = `${process.env.CLOUDFLARE_WORKER_URL}?action=register`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, passwordHash, nom, prenom, societe }),
  });
  const data = await resp.json();

  if (data.status === 'error') {
    return res.status(400).json({ error: data.message });
  }

  res.status(200).json(data);
}
