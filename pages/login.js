import { useState } from "react";

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
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", margin: "8px 0", padding: 8 }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", margin: "8px 0", padding: 8 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 4,
            marginTop: 12
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      {message && (
        <div style={{ marginTop: 16, color: message.startsWith("Connexion") ? "green" : "red" }}>
          {message}
        </div>
      )}
    </div>
  );
}
