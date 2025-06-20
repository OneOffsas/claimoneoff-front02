import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const { email, password } = req.body;
    const passwordHash = sha256(password);

    // Utilise la variable d'env et par défaut le bon lien fourni
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://yellow-violet-1ba5.oneoffsas.workers.dev";

    // Envoie la requête au Worker
    let resp;
    try {
      resp = await fetch(`${workerUrl}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordHash }),
      });
    } catch (e) {
      return res.status(500).json({ error: "Connexion au Worker impossible : " + e.message });
    }

    const raw = await resp.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({ error: `Réponse non JSON du Worker: ${raw}` });
    }

    if (data.status === 'error') {
      return res.status(400).json({ error: data.message });
    }

    res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erreur serveur inconnue' });
  }
}

