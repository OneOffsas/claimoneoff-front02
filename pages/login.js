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
        localStorage.setItem("claimUser", JSON.stringify(data));
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
    <div className="d-flex align-items-center justify-content-center vh-100" style={{background:"linear-gradient(120deg,#7356fa,#0a3d91)"}}>
      <div className="card shadow-lg p-4" style={{minWidth:350, maxWidth:380, borderRadius:20}}>
        <div className="text-center mb-4">
          <img src="/logo.png" alt="ClaimOneOff" width={60} />
          <h2 className="brand mt-2">ClaimOneOff</h2>
          <div className="fw-light fs-6 text-secondary">Connexion</div>
        </div>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="form-control mb-3" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn btn-primary w-100 rounded-pill shadow-sm fw-bold">Se connecter</button>
        </form>
        <div className="text-danger text-center small mt-3">{msg}</div>
        <div className="text-center mt-2">
          <a href="/register" className="link-primary small">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}

