import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const { email, password, nom, prenom, societe } = req.body;
    const passwordHash = sha256(password);

    // Récupère l'URL Worker de l'env, fallback possible si tu veux tester en local
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://yellow-violet-1ba5.workers.dev";

    const resp = await fetch(`${workerUrl}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: passwordHash, nom, prenom, societe }),
    });

    let data;
    try {
      data = await resp.json();
    } catch (e) {
      const text = await resp.text();
      console.error('Réponse non JSON du worker:', text);
      return res.status(500).json({ error: text });
    }

    if (data.status === 'error') {
      return res.status(400).json({ error: data.message });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error('Erreur API /register:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
