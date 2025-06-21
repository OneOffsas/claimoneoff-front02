import { useState } from "react";
import { useNotification } from "../components/NotificationProvider";
import Head from "next/head";

export default function Login() {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    // SHA256 doit être dispo via le <Script> dans _app.js
    const passwordHash = window.sha256(password);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwordHash }),
      });
      const data = await res.json();
      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data));
        showNotification("🚀 Connexion réussie ! Bienvenue.", "success");
        setTimeout(() => { window.location.href = "/dashboard"; }, 900);
      } else {
        showNotification(data.message || "Erreur de connexion", "error");
      }
    } catch (err) {
      showNotification("Erreur serveur", "error");
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Connexion | ClaimOneOff</title>
      </Head>
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <form
          className="bg-white rounded-4 shadow-lg p-5"
          style={{ minWidth: 380, maxWidth: 420, width: "100%" }}
          onSubmit={handleLogin}
        >
          <h2 className="text-center mb-4">Connexion à <b>ClaimOneOff</b></h2>
          <div className="mb-3">
            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="form-control" required autoFocus />
          </div>
          <div className="mb-3">
            <label>Mot de passe</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="form-control" required />
          </div>
          <button className="btn btn-primary w-100 rounded-3 py-2 fw-bold" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <div className="text-center mt-3">
            <a href="/register" className="text-secondary">Créer un compte</a>
          </div>
        </form>
      </div>
    </>
  );
}

