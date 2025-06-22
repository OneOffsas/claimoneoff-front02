// pages/api/register.js
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  // Récupérer les infos du formulaire
  const { nom, prenom, societe, email, motdepasse, role } = req.body;

  if (!nom || !prenom || !societe || !email || !motdepasse || !role) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    // Variables d'environnement Netlify
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

    // Sécurité : Vérifier que toutes les variables sont bien là
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SPREADSHEET_ID) {
      return res.status(500).json({ error: 'Variables d’environnement manquantes.' });
    }

    // Connexion à Google Sheets
    const doc = new GoogleSpreadsheet(GOOGLE_SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();

    // On cible la feuille Utilisateurs_ClaimOneOff
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];
    if (!sheet) {
      return res.status(500).json({ error: "Feuille 'Utilisateurs_ClaimOneOff' introuvable" });
    }

    // Ajout d'une nouvelle ligne
    await sheet.addRow({
      Nom: nom,
      Prénom: prenom,
      Société: societe,
      Email: email,
      MotDePasse: motdepasse, // ⚠️ Le mot de passe doit être hashé en prod !
      Rôle: role,
      DateInscription: new Date().toLocaleString('fr-FR'),
    });

    return res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
}
