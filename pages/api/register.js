const { google } = require('googleapis');

// Petit générateur d'ID unique simple pour la démo
function makeId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { societe, nom, prenom, email, password } = req.body;

  // Rôle toujours Client, Actif = Oui, etc.
  const role = "Client";
  const actif = "Oui";
  const dateInscription = new Date().toLocaleString('fr-FR');
  const derniereConnexion = "";

  // Optionnel : Ici tu pourrais hasher le mot de passe si tu veux plus de sécurité
  const motDePasseHash = password; // À remplacer par un vrai hash si besoin

  // La clé JSON du service account dans la variable d'env Vercel
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
    // Vérifie si l'email existe déjà dans la colonne E (5ᵉ colonne = index 4)
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!E2:E`,
    });

    const emails = readRes.data.values ? readRes.data.values.flat() : [];
    if (emails.includes(email)) {
      return res.status(400).json({ status: "error", message: "Email déjà utilisé." });
    }

    // Ajoute la ligne complète en respectant l'ordre de tes colonnes
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:K`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          makeId(),           // ID_User
          societe,            // Societe
          nom,                // Nom
          prenom,             // Prenom
          email,              // Email
          motDePasseHash,     // MotDePasse_Hash
          role,               // Role
          actif,              // Actif
          dateInscription,    // Date_Inscription
          derniereConnexion   // Derniere_Connexion
        ]]
      }
    });

    return res.status(200).json({ status: "success", message: "Utilisateur créé !" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}
