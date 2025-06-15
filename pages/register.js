import { useState } from "react";

export default function Register() {
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbzM3_gHbhIQsDvQXRFP8fPGzfeDoEbCCkY8lxSpWxaXSopU0u1X6jP2LPTjz8XkSShDKg/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          societe,
          nom,
          prenom,
          email,
          motDePasse,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("Inscription réussie ! Connecte-toi.");
        // Optionnel : window.location.href = "/login";
      } else {
        setMessage(data.message || "Erreur lors de l’inscription.");
      }
    } catch (err) {
      setMessage("Erreur serveur ou réseau");
    }
    setLoading(false);
  }

  return (
    <div style={{
      maxWidth: 390,
      margin: "80px auto",
      padding: 34,
      background: "#fff",
      borderRadius: 18,
      boxShadow: "0 2px 18px #e6e6ff88",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <img src="/logo.png" style={{ width: 62, marginBottom: 18 }} alt="logo" />
      <h2 style={{ color: "#6C47FF", marginBottom: 20 }}>Créer un compte</h2>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <input type="text" placeholder="Société" value={societe} required onChange={e => setSociete(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Nom" value={nom} required onChange={e => setNom(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Prénom" value={prenom} required onChange={e => setPrenom(e.target.value)} style={inputStyle} />
        <input type="email" placeholder="Email" value={email} required onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Mot de passe" value={motDePasse} required onChange={e => setMotDePasse(e.target.value)} style={inputStyle} />
        <button type="submit" disabled={loading}
          style={{
            width: "100%", padding: "10px 0", borderRadius: 8,
            background: "#6C47FF", color: "#fff", fontWeight: 700, fontSize: 18,
            border: "none", marginTop: 12, cursor: "pointer"
          }}>
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>
      {message && (
        <div style={{
          marginTop: 14,
          color: message.includes("réussie") ? "#22c55e" : "#ff0040",
          fontWeight: 600,
          fontSize: 15
        }}>{message}</div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: 7,
  border: "1px solid #e6e6f6",
  marginBottom: 14,
  fontSize: 16,
  background: "#f9f9fd"
};
