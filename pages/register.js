// pages/api/register.js

export default async function handler(req, res) {
  // 1. Autorise uniquement les requêtes POST
  if (req.method !== "POST") {
    res.status(405).json({ status: "error", message: "Méthode non autorisée" });
    return;
  }

  // 2. Déstructure les champs reçus
  const { email, passwordHash, nom, prenom, societe } = req.body;

  // 3. Vérifie la présence de tous les champs requis
  if (!email || !passwordHash || !nom || !prenom || !societe) {
    res.status(400).json({
      status: "error",
      message: "Champs manquants : email, passwordHash, nom, prenom, societe sont requis."
    });
    return;
  }

  try {
    // 4. Appelle ton Worker ou Apps Script
    const response = await fetch("https://yellow-violet-1ba5.oneoffsas.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        email,
        passwordHash,
        nom,
        prenom,
        societe
      }),
    });

    // 5. Tente de lire la réponse (en JSON)
    const data = await response.json();

    // 6. Renvoie le résultat côté front
    if (data.status === "success") {
      res.status(200).json(data);
    } else {
      // Message d’erreur retourné par le backend (ex: email déjà utilisé)
      res.status(400).json(data);
    }
  } catch (err) {
    // Erreur de connexion ou autre
    res.status(500).json({ status: "error", message: "Erreur serveur lors de l'inscription !" });
  }
}
