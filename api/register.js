import { GoogleSpreadsheet } from 'google-spreadsheet';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { societe, nom, prenom, email, password } = req.body;

  if (!societe || !nom || !prenom || !email || !password) {
    return res.status(400).json({ error: 'Champ obligatoire manquant' });
  }

  try {
    // Charger le fichier credentials.json
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    const creds = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    // Initialiser Google Sheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];
    await sheet.addRow({
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: password, // tu peux le hasher ensuite
      Role: 'client',
      Actif: 'Oui',
      Date_Inscription: new Date().toISOString(),
      Derniere_Connexion: '',
    });

    return res.status(200).json({ message: 'Utilisateur enregistré avec succès' });

  } catch (err) {
    console.error('Erreur:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
}



