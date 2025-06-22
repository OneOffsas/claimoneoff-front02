import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// === PARAMÈTRES À CONFIGURER ===
const SPREADSHEET_ID = '1cyelemAe1Pjaj6qlXp8WhFTyOhF6q1LhpqDeQ5V58bM';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'oneoffsas@gmail.com';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// === HANDLER INSCRIPTION ===
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { email, password, nom, prenom, societe } = req.body;

  // Vérif des champs obligatoires
  if (!email || !password || !nom || !prenom || !societe) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    // Auth Google Service Account
    const serviceAccountAuth = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Connexion Google Sheets
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];

    // Chargement des utilisateurs existants
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    const exist = rows.find(row => row.Email && row.Email.toLowerCase() === email.toLowerCase());

    if (exist) {
      return res.status(409).json({ error: "L'utilisateur existe déjà" });
    }

    // Génère un ID unique
    const userId = "USER_" + Date.now() + "_" + Math.floor(Math.random()*10000);

    // Ajoute l'utilisateur (les noms de colonnes doivent exister dans ta sheet !)
    await sheet.addRow({
      ID_User: userId,
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: password, // Hash côté front obligatoire !
      Role: "Client",
      Actif: "Oui",
      Date_Inscription: new Date().toLocaleString('fr-FR'),
      Derniere_Connexion: "",
    });

    return res.status(200).json({ success: true, message: 'Inscription réussie' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}

