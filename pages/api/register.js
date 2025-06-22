import { GoogleSpreadsheet } from 'google-spreadsheet';
import { v4 as uuidv4 } from 'uuid';

// Clé de service Google (variables d'environnement à définir sur Netlify)
const SHEET_ID = process.env.GOOGLE_SHEET_ID; // ID du Google Sheet
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL; // Email du compte de service
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'); // Clé privée, attention aux \n

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { societe, nom, prenom, email, motDePasseHash } = req.body;

  // Vérification des champs requis
  if (!societe || !nom || !prenom || !email || !motDePasseHash) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    // Connexion à la feuille Google Sheet
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: SERVICE_ACCOUNT_EMAIL,
      private_key: SERVICE_ACCOUNT_PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];

    // Vérifier que l'email n'existe pas déjà
    const rows = await sheet.getRows();
    if (rows.some(row => row.Email === email)) {
      return res.status(400).json({ message: 'Cet email est déjà inscrit' });
    }

    // Ajouter une nouvelle ligne avec les bons intitulés de colonnes
    await sheet.addRow({
      ID_User: uuidv4(),
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: motDePasseHash,
      Role: "client",
      Actif: "oui",
      Date_Inscription: new Date().toISOString(),
      Derniere_Connexion: "",
    });

    return res.status(200).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error("Erreur inscription :", error);
    return res.status(500).json({ message: "Erreur serveur", details: error.message });
  }
}

