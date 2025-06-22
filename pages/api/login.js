export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ status: "error", message: "Méthode non autorisée" });
    return;
  }
  const { email, passwordHash } = req.body;
  // Vérification basique
  if (!email || !passwordHash) {
    res.status(400).json({ status: "error", message: "Champs manquants" });
    return;
  }
  try {
    const response = await fetch("https://yellow-violet-1ba5.oneoffsas.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        email,
        passwordHash
      })
    });
    const data = await response.json();
    if (data.status === "success") {
      res.status(200).json(data);
    } else {
      res.status(400).json(data);
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: "Erreur de connexion au serveur !" });
  }
}
