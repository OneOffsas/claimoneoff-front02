const { google } = require('googleapis');

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  let body = req.body;
  if (!body || typeof body !== "object") {
    try { body = JSON.parse(req?.body ?? "{}"); } catch (e) { body = {}; }
  }
  const { email, password } = body;

  const GOOGLE_SERVICE_ACCOUNT = process.env.GOOGLE_SERVICE_ACCOUNT;
  const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = "1cyelemAe1Pjaj6qlXp8WhFTyOhF6q1LhpqDeQ5V58bM";
  const sheetName = "Utilisateurs_ClaimOneOff";

  try {
    // Récupère toutes les lignes utilisateur
    const resUsers = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:G`, // ID_User | Societe | Nom | Prénom | Email | MotDePasse_Hash | Role ...
    });

    const rows = resUsers.data.values || [];
    // Cherche l'utilisateur
    const user = rows.find(
      (row) =>
        row[4] === email && // colonne E = Email
        row[5] === password // colonne F = MotDePasse_Hash
    );

    if (!user) {
      return res.status(401).json({ status: "error", message: "Email ou mot de passe invalide" });
    }

    // On retourne le nom, le rôle, etc si besoin
    return res.status(200).json({
      status: "success",
      message: "Connexion réussie",
      user: {
        id: user[0],
        societe: user[1],
        nom: user[2],
        prenom: user[3],
        email: user[4],
        role: user[6]
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}

