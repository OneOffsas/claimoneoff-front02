import { useState } from "react";
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
    <div className="centered">
      <div className="card">
        <img src="/logo.png" alt="Logo" style={{ width: 80, margin: "0 auto 16px", display: "block" }} />
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Société" value={societe} onChange={e => setSociete(e.target.value)} required />
          <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
          <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>
            {loading ? "Création en cours..." : "Créer mon compte"}
          </button>
        </form>
        {message && (
          <div style={{ marginTop: 16, color: message.startsWith("Compte") ? "green" : "red" }}>{message}</div>
        )}
      </div>
    </div>
  );
}
