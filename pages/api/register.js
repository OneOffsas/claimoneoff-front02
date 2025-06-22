import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end('Method not allowed');

    // DEBUG 1 : Vérification des variables d'environnement
    if (!process.env.GOOGLE_SERVICE_ACCOUNT) throw new Error('Variable GOOGLE_SERVICE_ACCOUNT manquante');
    if (!process.env.GOOGLE_SHEET_ID) throw new Error('Variable GOOGLE_SHEET_ID manquante');

    const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    // DEBUG 2 : Vérification du nom de la feuille
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];
    if (!sheet) throw new Error("Feuille 'Utilisateurs_ClaimOneOff' introuvable");

    // DEBUG 3 : Vérification des champs reçus
    const { Societe, Nom, Prenom, Email, MotDePasse_Hash, Role } = req.body;
    if (!Societe || !Nom || !Prenom || !Email || !MotDePasse_Hash || !Role) {
      return res.status(400).json({ message: 'Champs manquants', body: req.body });
    }

    // Ajoute la ligne
    await sheet.addRow({
      Societe,
      Nom,
      Prenom,
      Email,
      MotDePasse_Hash,
      Role,
      Actif: 1,
      Date_Inscription: new Date().toISOString(),
      Derniere_Connexion: ''
    });

    return res.status(200).json({ message: 'Utilisateur ajouté avec succès' });
  } catch (err) {
    // Envoie l'erreur complète côté front pour la voir dans la console réseau
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
