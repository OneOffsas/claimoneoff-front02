import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const { email, password, nom, prenom, societe } = req.body;
    const passwordHash = sha256(password);

    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://yellow-violet-1ba5.workers.dev";

    // ENVOIE la requête et loggue tout
    const resp = await fetch(`${workerUrl}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: passwordHash, nom, prenom, societe }),
    });

    const raw = await resp.text();
    console.log('=== Réponse Worker brute ===');
    console.log(raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error('Réponse NON JSON reçue du Worker :', raw);
      return res.status(500).json({ error: `Réponse Worker non JSON : ${raw}` });
    }

    if (data.status === 'error') {
      console.error('Erreur Worker status:', data.message);
      return res.status(400).json({ error: data.message });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error('Erreur API /register:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

