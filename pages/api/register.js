import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // On récupère les infos du body
  const { Societe, Nom, Prenom, Email, MotDePasse_Hash, Role } = req.body;

  if (!Societe || !Nom || !Prenom || !Email || !MotDePasse_Hash || !Role) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  try {
    // Authentification avec les variables d'environnement
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];

    // Génère un nouvel ID (option simplifiée)
    const rows = await sheet.getRows();
    const lastID = rows.length > 0 ? parseInt(rows[rows.length - 1].ID_User, 10) : 0;
    const newID = (lastID + 1).toString();

    const dateNow = new Date().toISOString();

    // Ajoute la ligne
    await sheet.addRow({
      ID_User: newID,
      Societe,
      Nom,
      Prenom,
      Email,
      MotDePasse_Hash,
      Role,
      Actif: "1",
      Date_Inscription: dateNow,
      Derniere_Connexion: "",
    });

    return res.status(200).json({ message: 'Inscription réussie' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}
