// pages/api/login.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Méthode non autorisée' });
  }
  const { email, password } = req.body;
  const url = process.env.GAS_URL;
  if (!url) {
    // Si la variable n'est pas définie, on renvoie une erreur claire
    return res.status(500).json({ status: 'error', message: 'Variable GAS_URL non configurée' });
  }
  try {
    // Appel au backend réel (Apps Script ou Worker) via fetch côté serveur
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });
    // Si le backend renvoie quelque chose qui n'est pas JSON, ce sera catché
    const data = await resp.json();
    if (data.status === 'success') {
      // Succès : on renvoie au client Next.js
      return res.status(200).json(data);
    } else {
      // Erreur métier (mauvais identifiants, etc.)
      return res.status(400).json(data);
    }
  } catch (err) {
    // Erreur réseau ou crash
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
