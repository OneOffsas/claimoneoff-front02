import { useState } from "react";

export default function Register() {
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Client");
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
        body: JSON.stringify({ societe, nom, prenom, email, password, role }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("Compte créé avec succès !");
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
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Société"
          value={societe}
          onChange={(e) => setSociete(e.target.value)}
          required
          style={{ width: "100%", margin: "8px 0", padding: 8 }}
        />
        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          style={{ width: "100%", margin: "8px 0", padding: 8 }}
        />
        <input
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          style={{ width: "100%", margin: "8px 0", padding: 8 }}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", margin: "8px 0", padding: 8 }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", margin: "8px 0", padding: 8 }}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", margin: "8px 0", padding: 8 }}>
          <option value="Client">Client</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#3b82f6", color: "white", border: "none", borderRadius: 4 }}>
          {loading ? "Création en cours..." : "Créer mon compte"}
        </button>
      </form>
      {message && <div style={{ marginTop: 16, color: message.startsWith("Compte") ? "green" : "red" }}>{message}</div>}
    </div>
  );
}
