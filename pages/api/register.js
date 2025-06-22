import { GoogleSpreadsheet } from "google-spreadsheet";
import crypto from "crypto";

// Variables d'environnement
const SHEET_ID = process.env.SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { societe, nom, prenom, email, motdepasse, role } = req.body;

  if (!societe || !nom || !prenom || !email || !motdepasse || !role) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  try {
    // Connexion à Google Sheets
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["Utilisateurs_ClaimOneOff"];

    // Vérifier si l'email existe déjà
    const rows = await sheet.getRows();
    if (rows.some(r => (r.Email || "").toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: "Cet email existe déjà." });
    }

    // Générer un ID unique (timestamp + 3 chiffres aléatoires)
    const ID_User = Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, "0");

    // Hash du mot de passe (SHA256)
    const MotDePasse_Hash = crypto.createHash("sha256").update(motdepasse).digest("hex");

    // Date inscription (format FR)
    const Date_Inscription = new Date().toLocaleString("fr-FR");

    await sheet.addRow({
      ID_User,
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash,
      Role: role,
      Actif: "Oui",
      Date_Inscription,
      Derniere_Connexion: "", // sera rempli lors de la connexion
    });

    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("Erreur Google Sheets:", err);
    return res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
}

