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
          societe,
          nom,
          prenom,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg("Compte créé ! Vous pouvez vous connecter.");
      } else {
        setMsg("Erreur : " + data.message);
      }
    } catch (e) {
      setMsg("Erreur réseau, merci de réessayer.");
    }
  }

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: 400 }}>
        <div className="text-center mb-3">
          <img src="/logo.png" alt="ClaimOneOff" className="mb-2" width="72" />
          <h2 className="fw-bold">Créer un compte</h2>
        </div>
        <form onSubmit={handleRegister}>
          <input className="form-control mb-3" placeholder="Société" value={societe} onChange={e => setSociete(e.target.value)} required />
          <input className="form-control mb-3" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
          <input className="form-control mb-3" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
          <input className="form-control mb-3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="form-control mb-3" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn btn-success w-100 mb-2">Créer mon compte</button>
        </form>
        <div className="text-danger text-center">{msg}</div>
        <div className="text-center mt-2">
          <a href="/login" className="link-primary">Se connecter</a>
        </div>
      </div>
    </div>
  );
}
