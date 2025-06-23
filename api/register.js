import { GoogleSpreadsheet } from 'google-spreadsheet';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { societe, nom, prenom, email, password } = req.body;

  if (!societe || !nom || !prenom || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT).client_email,
      private_key: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT).private_key.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();
    const userExists = rows.some(row => row.Email === email);
    if (userExists) {
      return res.status(409).json({ error: 'Utilisateur déjà inscrit' });
    }

    const hash = await bcrypt.hash(password, 10);
    const now = new Date().toLocaleString('fr-FR');

    await sheet.addRow({
      ID_User: rows.length + 1,
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: hash,
      Role: 'Client',
      Actif: 'Oui',
      Date_Inscription: now,
      Derniere_Connexion: '',
    });

    res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
  } catch (error) {
    console.error('Erreur inscription :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
