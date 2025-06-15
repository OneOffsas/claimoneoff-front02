import { useState } from "react";
const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Register() {
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setMsg("Inscription en cours...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          societe, nom, prenom, email, password,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg("Compte créé ! Vous pouvez vous connecter.");
        setTimeout(()=>window.location.href="/login", 1500);
      } else {
        setMsg("Erreur : " + data.message);
      }
    } catch {
      setMsg("Erreur réseau, merci de réessayer.");
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{background:"linear-gradient(120deg,#7356fa,#0a3d91)"}}>
      <div className="card shadow-lg p-4" style={{minWidth:350, maxWidth:400, borderRadius:20}}>
        <div className="text-center mb-4">
          <img src="/logo.png" alt="ClaimOneOff" width={60} />
          <h2 className="brand mt-2">ClaimOneOff</h2>
          <div className="fw-light fs-6 text-secondary">Créer un compte</div>
        </div>
        <form onSubmit={handleRegister}>
          <input className="form-control mb-3" placeholder="Société" value={societe} onChange={e => setSociete(e.target.value)} required />
          <input className="form-control mb-3" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
          <input className="form-control mb-3" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
          <input className="form-control mb-3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="form-control mb-3" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn btn-success w-100 rounded-pill shadow-sm fw-bold">Créer mon compte</button>
        </form>
        <div className="text-danger text-center small mt-3">{msg}</div>
        <div className="text-center mt-2">
          <a href="/login" className="link-primary small">Déjà un compte ? Se connecter</a>
        </div>
      </div>
    </div>
  );
}

