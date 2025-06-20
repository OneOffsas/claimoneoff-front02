import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const { email, password } = req.body;
    const passwordHash = sha256(password);

    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://yellow-violet-1ba5.workers.dev";

    // Envoie la requête
    const resp = await fetch(`${workerUrl}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: passwordHash }),
    });

    // Récupère la réponse brute (texte)
    const raw = await resp.text();

    // Tente de parser le JSON
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      // Si ce n'est pas du JSON, affiche le texte reçu
      return res.status(500).json({ error: `Réponse non JSON du Worker: ${raw}` });
    }

    if (data.status === 'error') {
      // Affiche l'erreur du worker directement côté front
      return res.status(400).json({ error: data.message });
    }

    res.status(200).json(data);

  } catch (err) {
    // Si tout plante, affiche l'erreur du serveur
    return res.status(500).json({ error: err.message || 'Erreur serveur inconnue' });
  }
}

