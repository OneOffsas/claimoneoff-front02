import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  // Sécurise les champs du front :
  const email   = req.body.email   ? req.body.email.trim()   : "";
  const password = req.body.password ? req.body.password : "";
  const nom     = req.body.nom     ? req.body.nom.trim()     : "";
  const prenom  = req.body.prenom  ? req.body.prenom.trim()  : "";
  const societe = req.body.societe ? req.body.societe.trim() : "";

  // LOG (important !)
  console.log("REGISTER PAYLOAD FRONT →", {email, password, nom, prenom, societe});

  // Empêche l’appel au back si un champ est vide
  if (!email || !password || !nom || !prenom || !societe) {
    return res.status(400).json({ error: "Champs requis manquants côté front !" });
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
    // Remonte le debug s’il y a un souci
    return res.status(400).json({ error: data.message, debug: data.debug_data || null });
  }

  res.status(200).json(data);
}
