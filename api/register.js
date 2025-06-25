import { GoogleSpreadsheet } from 'google-spreadsheet';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { email, password, societe, nom, prenom } = req.body;

  if (!email || !password || !societe || !nom || !prenom) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  try {
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    const credentialsContent = await fs.readFile(credentialsPath, 'utf-8');
    const credentials = JSON.parse(credentialsContent);

    const doc = new GoogleSpreadsheet('1cyelemAe1Pjaj6qlXp8WhFTyOhF6q1LhpqDeQ5V58bM');
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];
    const rows = await sheet.getRows();

    const userExists = rows.some(row => row.Email === email);
    if (userExists) {
      return res.status(400).json({ error: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sheet.addRow({
      ID_User: Date.now().toString(),
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: hashedPassword,
      Role: 'client',
      Actif: 'oui',
      Date_Inscription: new Date().toISOString(),
      Derniere_Connexion: '',
    });

    res.status(200).json({ message: 'Utilisateur enregistré avec succès' });

  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
}


