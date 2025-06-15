import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ societe, nom, prenom, email, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("🎉 Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setSociete(""); setNom(""); setPrenom(""); setEmail(""); setPassword("");
      } else {
        setMessage(data.message || "Erreur lors de la création du compte");
      }
    } catch (err) {
      setMessage("Erreur réseau ou serveur");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #6C47FF 0%, #212155 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff", borderRadius: 14, boxShadow: "0 2px 24px #4439", padding: 36, width: 400, maxWidth: "92vw"
      }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src="/logo.png" alt="Logo" style={{ width: 70, marginBottom: 22, borderRadius: 16 }} />
        </div>
        <h2 style={{ textAlign: "center", color: "#6C47FF", fontWeight: 700 }}>Créer un compte</h2>
        <input
          placeholder="Société"
          value={societe}
          onChange={e => setSociete(e.target.value)}
          required
          style={{ width: "100%", margin: "12px 0" }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="Nom"
            value={nom}
            onChange={e => setNom(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <input
            placeholder="Prénom"
            value={prenom}
            onChange={e => setPrenom(e.target.value)}
            required
            style={{ flex: 1 }}
          />
        </div>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", margin: "12px 0" }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", margin: "12px 0" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", marginTop: 8,
            background: "linear-gradient(120deg, #6C47FF 0%, #212155 100%)",
            color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 18
          }}>
          {loading ? "Création en cours..." : "Créer mon compte"}
        </button>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/login" style={{ color: "#6C47FF" }}>Retour à la connexion</Link>
        </div>
        {message && <div style={{
          marginTop: 18, color: message.startsWith("🎉") ? "green" : "red", textAlign: "center"
        }}>{message}</div>}
      </form>
    </div>
  );
}
