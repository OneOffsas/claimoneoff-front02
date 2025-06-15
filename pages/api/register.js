const { google } = require('googleapis');

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Body parser Next.js : fonctionne partout
  let body = req.body;
  if (!body || typeof body !== "object") {
    try {
      body = JSON.parse(req?.body ?? "{}");
    } catch (e) {
      body = {};
    }
  }

  const { societe, nom, prenom, email, password } = body;

  // ---- AJUSTE ICI POUR TA FEUILLE ----
  const role = "Client";
  const actif = "Oui";
  const dateInscription = new Date().toLocaleString('fr-FR');
  const derniereConnexion = "";
  const makeId = (length = 8) => Array.from({length}, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random()*62)]).join('');
  const motDePasseHash = password;

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
    // Vérifie si l'email existe déjà
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!E2:E`,
    });

    const emails = readRes.data.values ? readRes.data.values.flat() : [];
    if (emails.includes(email)) {
      return res.status(400).json({ status: "error", message: "Email déjà utilisé." });
    }

    // Ajoute la ligne
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:K`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          makeId(),
          societe,
          nom,
          prenom,
          email,
          motDePasseHash,
          role,
          actif,
          dateInscription,
          derniereConnexion
        ]]
      }
    });

    return res.status(200).json({ status: "success", message: "Utilisateur créé !" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}

