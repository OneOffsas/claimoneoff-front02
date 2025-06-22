import React, { useState } from "react";
import { sha256 } from "js-sha256";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    // Hash du mot de passe avant envoi
    const passwordHash = sha256(password);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passwordHash }),
    });

    const data = await res.json();

    if (data.status === "success") {
      toast.success("Connexion réussie !");
      setTimeout(() => {
        // Redirige vers le dashboard après 1s
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      toast.error(data.message || "Erreur de connexion");
    }
    setLoading(false);
  }

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto", marginTop: "100px" }}>
      <ToastContainer position="top-center" />
      <form onSubmit={handleLogin} className="card shadow p-4">
        <h2 className="mb-4 text-center">Connexion</h2>
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="form-control mb-3"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

