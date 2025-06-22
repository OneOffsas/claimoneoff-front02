import React, { useState } from "react";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const societe = e.target.societe.value;
    const nom = e.target.nom.value;
    const prenom = e.target.prenom.value;
    const email = e.target.email.value;
    const motdepasse = e.target.motdepasse.value;
    const role = e.target.role.value;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ societe, nom, prenom, email, motdepasse, role }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Inscription réussie ! Vous pouvez maintenant vous connecter.");
    } else {
      setMessage("❌ Erreur : " + (data.error || "Impossible de s'inscrire."));
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Créer un compte</h2>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input name="societe" placeholder="Société" required />
        <input name="nom" placeholder="Nom" required />
        <input name="prenom" placeholder="Prénom" required />
        <input name="email" placeholder="Email" type="email" required />
        <input name="motdepasse" placeholder="Mot de passe" type="password" required />
        <select name="role" required>
          <option value="Client">Client</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" disabled={loading}>{loading ? "Création..." : "S'inscrire"}</button>
      </form>
      {message && <div style={{ marginTop: 16 }}>{message}</div>}
    </div>
  );
}

