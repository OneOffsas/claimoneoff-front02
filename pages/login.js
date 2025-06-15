import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } else {
        setMessage(data.message || "Email ou mot de passe incorrect.");
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
        background: "#fff", borderRadius: 14, boxShadow: "0 2px 24px #4439", padding: 40, width: 360, maxWidth: "92vw"
      }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src="/logo.png" alt="Logo" style={{ width: 72, marginBottom: 22, borderRadius: 16 }} />
        </div>
        <h2 style={{ textAlign: "center", color: "#6C47FF", fontWeight: 700 }}>Connexion</h2>
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
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link href="/register" style={{ color: "#6C47FF" }}>Créer un compte</Link>
        </div>
        {message && <div style={{
          marginTop: 18, color: message.startsWith("Connexion") ? "green" : "red", textAlign: "center"
        }}>{message}</div>}
      </form>
    </div>
  );
}

