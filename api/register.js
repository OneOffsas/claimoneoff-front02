// pages/api/register.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Méthode non autorisée' });
  }
  const { societe, nom, prenom, email, password } = req.body;
  const url = process.env.GAS_URL;
  if (!url) {
    return res.status(500).json({ status: 'error', message: 'Variable GAS_URL non configurée' });
  }
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        societe,
        nom,
        prenom,
        email,
        password,
      }),
    });
    const data = await resp.json();
    if (data.status === 'success') {
      return res.status(200).json(data);
    } else {
      return res.status(400).json(data);
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
