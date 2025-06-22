import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = '1cyelemAe1Pjaj6qlXp8WhFTyOhF6q1LhpqDeQ5V58bM'; // <-- TON ID
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { email, password, nom, prenom, societe } = req.body;

  if (!email || !password || !nom || !prenom || !societe) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const serviceAccountAuth = new JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];

    // Vérifie l'unicité de l'email
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    const existingUser = rows.find(row => row.Email === email);
    if (existingUser) {
      return res.status(409).json({ error: "L'utilisateur existe déjà" });
    }

    // Ajoute l'utilisateur
    await sheet.addRow({
      ID_User: "USER_" + Date.now(),
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: password, // tu peux hasher côté front avant d'envoyer
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
