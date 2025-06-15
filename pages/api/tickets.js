const { google } = require('googleapis');

// Génère un ID simple (AAA12345)
function makeId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

export default async function handler(req, res) {
  const GOOGLE_SERVICE_ACCOUNT = process.env.GOOGLE_SERVICE_ACCOUNT;
  const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1cyelemAe1Pjaj6qlXp8WhFTyOhF6q1LhpqDeQ5V58bM";
  const sheetName = "Tickets_ClaimOneOff";

  if (req.method === "POST") {
    // Création d'un ticket
    let body = req.body;
    if (!body || typeof body !== "object") {
      try { body = JSON.parse(req?.body ?? "{}"); } catch (e) { body = {}; }
    }
    const { sujet, description, email, societe, nom, prenom } = body;
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:F`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            makeId(),      // id ticket
            sujet,         // sujet
            description,   // description
            "Nouveau",     // status
            email,         // créé par
            new Date().toLocaleString('fr-FR')
          ]]
        }
      });
      return res.status(200).json({ status: "success", message: "Ticket créé !" });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  if (req.method === "GET") {
    // Lecture des tickets (filtrés)
    const { role, email } = req.query;
    try {
      const resp = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:F`,
      });
      let tickets = (resp.data.values || []).map(r => ({
        id: r[0],
        sujet: r[1],
        description: r[2],
        status: r[3],
        email: r[4],
        date: r[5]
      }));
      // Si client, filtre ses tickets seulement
      if (role !== "Admin") {
        tickets = tickets.filter(t => t.email === email);
      }
      return res.status(200).json({ status: "success", tickets });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  // Méthode non autorisée
  return res.status(405).json({ error: "Méthode non autorisée" });
}
