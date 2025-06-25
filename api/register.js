import { GoogleSpreadsheet } from 'google-spreadsheet';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { societe, nom, prenom, email, password } = req.body;

  // Vérification des champs obligatoires
  if (!societe || !nom || !prenom || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();

    // Vérifie si l'email existe déjà
    const emailExiste = rows.some(row => row.Email === email);
    if (emailExiste) {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d’un nouvel ID
    const newId = rows.length > 0
      ? Math.max(...rows.map(r => parseInt(r.ID_User || '0'))) + 1
      : 1;

    // Ajout dans la feuille
    await sheet.addRow({
      ID_User: newId,
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

    return res.status(200).json({ message: 'Inscription réussie.' });
  } catch (error) {
    console.error('Erreur serveur :', error);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
}

