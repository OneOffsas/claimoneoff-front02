import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Méthode non autorisée" });

  const { societe, nom, prenom, email, motDePasse, role } = req.body;
  // DEBUG
  console.log("DONNÉES REÇUES : ", req.body);

  if (!societe || !nom || !prenom || !email || !motDePasse) {
    return res.status(400).json({ message: "Champ obligatoire manquant" });
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n')
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Utilisateurs_ClaimOneOff'];
    await sheet.addRow({
      ID_User: Date.now().toString(),
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: motDePasse,
      Role: role || "client",
      Actif: "1",
      Date_Inscription: new Date().toISOString(),
      Derniere_Connexion: ""
    });
    res.status(200).json({ message: "Inscription réussie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur: " + err.message });
  }
}
