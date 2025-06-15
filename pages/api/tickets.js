const { google } = require('googleapis');

// Générateur d'ID unique simple
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
    let body = req.body;
    if (!body || typeof body !== "object") {
      try { body = JSON.parse(req?.body ?? "{}"); } catch (e) { body = {}; }
    }

    // Récupération des données envoyées
    const {
      societe,
      utilisateur,
      email,
      role,
      urgence,
      numero_commande,
      sla_cible,
      problematique,
      transporteur,
      description,
      fichiers_joints,
      discussion,
      priorite,
      type_action,
      delai_resolution,
      facturation
    } = body;

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:T`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            makeId(),                  // ID_Ticket (A)
            societe || "",             // Societe (B)
            utilisateur || "",         // Utilisateur (C)
            email || "",               // Email (D)
            role || "Client",          // Role (E)
            new Date().toLocaleString('fr-FR'), // Date_Ouverture (F)
            urgence || "Non",          // Urgence (G)
            numero_commande || "",     // Numero_Commande (H)
            sla_cible || "",           // SLA_Cible (I)
            problematique || "",       // Problematique (J)
            transporteur || "",        // Transporteur (K)
            description || "",         // Description (L)
            fichiers_joints || "",     // Fichiers_Joints (M)
            discussion || "",          // Discussion (N)
            "Nouveau",                 // Statut (O)
            new Date().toLocaleString('fr-FR'), // Date_MAJ (P)
            priorite || "",            // Priorite (Q)
            type_action || "",         // Type_Action (R)
            delai_resolution || "",    // Delai_Resolution (S)
            facturation || ""          // Facturation (T)
            // ...ajoute ici des champs si tu ajoutes d'autres colonnes ensuite
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
        range: `${sheetName}!A2:T`, // A2:T pour couvrir toutes tes colonnes
      });
      let tickets = (resp.data.values || []).map(r => ({
        id: r[0],                // ID_Ticket
        societe: r[1],
        utilisateur: r[2],
        email: r[3],
        role: r[4],
        date_ouverture: r[5],
        urgence: r[6],
        numero_commande: r[7],
        sla_cible: r[8],
        problematique: r[9],
        transporteur: r[10],
        description: r[11],
        fichiers_joints: r[12],
        discussion: r[13],
        statut: r[14],
        date_maj: r[15],
        priorite: r[16],
        type_action: r[17],
        delai_resolution: r[18],
        facturation: r[19],
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

  return res.status(405).json({ error: "Méthode non autorisée" });
}
