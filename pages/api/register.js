import { GoogleSpreadsheet } from 'google-spreadsheet';

const GOOGLE_SERVICE_ACCOUNT_EMAIL = "oneoffsas@oneoff.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;
const GOOGLE_SHEET_ID = "1cyelemAe1Pjaj6qlXp8WhFTyOhF6q1LhpqDeQ5V58bM/edit?gid=545143843#gid=545143843"; // Mets ici l’ID de ton Google Sheet
const USERS_SHEET_TITLE = "Utilisateurs_ClaimOneOff";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  const { societe, nom, prenom, email, motDePasseHash, role = "client" } = req.body;

  if (!societe || !nom || !prenom || !email || !motDePasseHash) {
    res.status(400).json({ error: "Champs obligatoires manquants." });
    return;
  }

  try {
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[USERS_SHEET_TITLE];
    if (!sheet) {
      res.status(500).json({ error: "Feuille utilisateurs introuvable." });
      return;
    }

    // Vérifie si l'email existe déjà
    const rows = await sheet.getRows();
    const exists = rows.some(r => (r.Email || r.email) === email);

    if (exists) {
      res.status(400).json({ error: "Cet email existe déjà." });
      return;
    }

    // Génère un nouvel ID auto-incrémenté
    const lastId = rows.length > 0 ? Math.max(...rows.map(r => parseInt(r.ID_User, 10) || 0)) : 0;
    const newId = lastId + 1;

    // Ajoute la ligne utilisateur (tous les en-têtes sont présents ici)
    await sheet.addRow({
      ID_User: newId,
      Societe: societe,
      Nom: nom,
      Prenom: prenom,
      Email: email,
      MotDePasse_Hash: motDePasseHash,
      Role: role,
      Actif: 1,
      Date_Inscription: new Date().toISOString().slice(0, 10),
      Derniere_Connexion: "",
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Erreur inscription:", error);
    res.status(500).json({ error: "Erreur serveur. " + error.message });
  }
}
