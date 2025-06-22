// pages/api/register.js

import { GoogleSpreadsheet } from "google-spreadsheet";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }
  const { societe, nom, prenom, email, motDePasse, role } = req.body;

  // Vérifie les champs obligatoires
  if (!societe || !nom || !prenom || !email || !motDePasse) {
    return res.status(400).json({ message: "Champ obligatoire manquant" });
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle["Utilisateurs_ClaimOneOff"];
    await sheet.loadHeaderRow();

    // Vérifie si l'utilisateur existe déjà (par email)
    const rows = await sheet.getRows();
    if (rows.some(r => (r.Email || r.email) === email)) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    // Hash du mot de passe simplifié pour la démo (à remplacer par bcrypt réel !)
    const hash = Buffer.from(motDePasse).toString("base64");

    // Génère un ID unique
    const ID_User = uuidv4();
    const now = new Date().toISOString().split("T")[0];

    await sheet.addRow({
      ID_User,
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: hash,
      Role: role || "client",
      Actif: "1",
      Date_Inscription: now,
      Derniere_Connexion: "",
    });

    return res.status(200).json({ message: "Inscription réussie !" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur : " + err.message });
  }
}
