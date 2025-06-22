import { GoogleSpreadsheet } from "google-spreadsheet";

// On récupère les variables d’environnement
const SHEET_ID = process.env.SHEET_ID; // L'ID du Google Sheet
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { nom, prenom, societe, email, motdepasse, role } = req.body;

  if (!nom || !prenom || !societe || !email || !motdepasse || !role) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["Utilisateurs_ClaimOneOff"];

    // Vérification si l'email existe déjà
    await sheet.loadCells(); // Optionnel, mais mieux pour éviter les doublons
    const rows = await sheet.getRows();
    if (rows.some(r => r.email === email)) {
      return res.status(400).json({ error: "Cet email existe déjà." });
    }

    // Ajout du nouvel utilisateur
    await sheet.addRow({
      nom,
      prenom,
      societe,
      email,
      motdepasse, // Hash le mot de passe côté front idéalement !
      role,
      date_creation: new Date().toLocaleString("fr-FR"),
    });

    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("Erreur Google Sheets:", err);
    return res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
}
