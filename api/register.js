import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { societe, nom, prenom, email, password, role } = req.body;

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
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!E2:E`,
    });

    const emails = readRes.data.values ? readRes.data.values.flat() : [];
    if (emails.includes(email)) {
      return res.status(400).json({ status: "error", message: "Email déjà utilisé." });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:G`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [new Date().toLocaleString(), societe, nom, prenom, email, password, role],
        ],
      },
    });

    return res.status(200).json({ status: "success", message: "Utilisateur créé !" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}
