import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Récupère les variables d'environnement
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    // Initialise Google Spreadsheet
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth(serviceAccount);
    await doc.loadInfo();

    // Charge la bonne feuille
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];

    // Récupère les infos du body
    const { societe, nom, prenom, email, motDePasse, role } = req.body;

    // Création du hash
    // (Idéalement, fais-le côté client AVANT d'envoyer au serveur, sinon on peut le faire ici avec crypto)

    // Insère dans la feuille
    await sheet.addRow({
      ID_User: '', // On laisse vide, Google Sheets gère l'auto-numérotation
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: motDePasse, // Passe ici le hash !
      Role: role,
      Actif: 1,
      Date_Inscription: new Date().toISOString(),
      Derniere_Connexion: ''
    });

    res.status(200).json({ message: "Inscription réussie" });
  } catch (err) {
    console.error('Erreur Google Sheets:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
}
