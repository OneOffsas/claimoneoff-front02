import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  // On récupère TOUT ce qui vient du front
  const { email, password, nom, prenom, societe } = req.body;

  // LOG : tu dois voir TOUT rempli ici
  console.log("PAYLOAD AVANT ENVOI SCRIPT", { email, password, nom, prenom, societe });

  // Si un champ est manquant ici, TON FORMULAIRE est en cause !
  if (!email || !password || !nom || !prenom || !societe) {
    return res.status(400).json({ error: "Champs requis manquants côté front !" });
  }

  const passwordHash = sha256(password);

  const scriptUrl = "https://script.google.com/macros/s/AKfycbxVsHNzAtfR55M3t7A-vk7RAZz2EO6fqzxKmlUACnNWnauWuQAt3ecSuPiNSDvoCI5-lw/exec";

  // Envoie tout (pas d'erreur de casse)
  let resp = await fetch(scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
    return res.status(400).json({ error: data.message, debug: data.debug_data || null });
  }
  res.status(200).json(data);
}
