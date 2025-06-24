import { GoogleSpreadsheet } from 'google-spreadsheet';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { nom, prenom, societe, email, password } = req.body;

    if (!nom || !prenom || !societe || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT.replace(/\\n/g, '\n'));
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];
    const rows = await sheet.getRows();

    const existingUser = rows.find(row => row.Email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const dateNow = new Date().toISOString();

    await sheet.addRow({
      ID_User: `${Date.now()}`,
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: hashedPassword,
      Role: 'client',
      Actif: 'oui',
      Date_Inscription: dateNow,
      Derniere_Connexion: ''
    });

    return res.status(200).json({ message: 'Inscription réussie' });
  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
}

