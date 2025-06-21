import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const { email, password, nom, prenom, societe } = req.body;

  // LOG pour te montrer ce qui part vraiment
  console.log("PAYLOAD ENVOYÉ À APPS SCRIPT :", { email, password, nom, prenom, societe });

  if (!email || !password || !nom || !prenom || !societe) {
    return res.status(400).json({ error: "Champs requis manquants (email, mot de passe, nom, prénom, société)" });
  }

  const passwordHash = sha256(password);

  const scriptUrl = "https://script.google.com/macros/s/AKfycbxVsHNzAtfR55M3t7A-vk7RAZz2EO6fqzxKmlUACnNWnauWuQAt3ecSuPiNSDvoCI5-lw/exec";

  let resp = await fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email,
      passwordHash,
      nom,
      prenom,
      societe
    }),
  });

  const raw = await resp.text();
  let data;
  try { data = JSON.parse(raw); } catch (e) {
    return res.status(500).json({ error: `Réponse non JSON du Script: ${raw}` });
  }

  if (data.status === 'error') {
    return res.status(400).json({ error: data.message });
  }

  res.status(200).json(data);
}
