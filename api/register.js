// ✅ pages/api/register.js (Version corrigée qui évite les erreurs 'replace')

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { societe, nom, prenom, email, password } = req.body;

    // Validation des champs obligatoires
    if (!societe || !nom || !prenom || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    // Initialiser Google Sheet
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    const auth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];
    const rows = await sheet.getRows();

    const userExists = rows.some(row => row.Email === email);
    if (userExists) {
      return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sheet.addRow({
      ID_User: rows.length + 1,
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: hashedPassword,
      Role: 'client',
      Actif: 'oui',
      Date_Inscription: new Date().toLocaleString('fr-FR'),
      Derniere_Connexion: '',
    });

    res.status(200).json({ message: 'Inscription réussie !' });
  } catch (error) {
    console.error('Erreur à l’inscription :', error);
    res.status(500).json({ error: error.message });
  }
}
