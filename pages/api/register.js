import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const { Societe, Nom, Prenom, Email, MotDePasse_Hash, Role } = req.body;
  if (!Societe || !Nom || !Prenom || !Email || !MotDePasse_Hash || !Role) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];
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
}
