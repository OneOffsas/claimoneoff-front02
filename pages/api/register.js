export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" }); // 405 = Méthode non autorisée
  }

  // -------------- ICI LE VRAI TRAITEMENT --------------

  // Par exemple, juste pour tester :
  // return res.status(200).json({ message: "Inscription bien reçue !" });

  // -------------- CODE À COMPLÉTER APRÈS --------------
}
