import { GoogleSpreadsheet } from 'google-spreadsheet';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { societe, nom, prenom, email, password } = req.body;

  if (!societe || !nom || !prenom || !email || !password) {
    return res.status(400).json({ error: 'Un ou plusieurs champs obligatoires manquent.' });
  }

  try {
    // Initialiser Google Sheets
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];
    if (!sheet) throw new Error("Feuille Utilisateurs_ClaimOneOff non trouvée");

    // Vérifier l'unicité de l'email
    const rows = await sheet.getRows();
    if (rows.find(r => r.Email && r.Email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: "Un compte existe déjà avec cet email." });
    }

    // Générer un ID unique
    const id = Date.now().toString();

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Ajouter une nouvelle ligne dans la feuille
    await sheet.addRow({
      ID_User: id,
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: passwordHash,
      Role: 'Client',
      Actif: 'Oui',
      Date_Inscription: new Date().toISOString(),
      Derniere_Connexion: ''
    });

    return res.status(200).json({ success: true, message: "Inscription réussie !" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}

