import { useState } from "react";
const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("Connexion en cours...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg("Connexion réussie !");
        if (data.role === "Admin") window.location.href = "/admin";
        else window.location.href = "/dashboard";
      } else {
        setMsg("Erreur : " + data.message);
      }
    } catch {
      setMsg("Erreur réseau.");
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: 400 }}>
        <div className="text-center mb-3">
          <img src="/logo.png" alt="Logo" className="mb-2" width="72" />
          <h2 className="fw-bold">Connexion à ClaimOneOff</h2>
        </div>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="form-control mb-3" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn btn-primary w-100 mb-2">Se connecter</button>
        </form>
        <div className="text-danger text-center">{msg}</div>
        <div className="text-center mt-2">
          <a href="/register" className="link-primary">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}

