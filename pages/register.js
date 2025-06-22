import React, { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [societe, setSociete] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    // Ne jamais hasher ici avec window.sha256, utilise la lib js-sha256
    const sha256 = (await import("js-sha256")).sha256;
    const passwordHash = sha256(password);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email, passwordHash, nom, prenom, societe
      })
    });

    const data = await res.json();
    if (data.status === "success") {
      setMessage("Inscription réussie !");
    } else {
      setMessage(data.message || "Erreur lors de l'inscription");
    }
  }

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Inscription</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="form-control mb-2" />
      <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required className="form-control mb-2" />
      <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required className="form-control mb-2" />
      <input placeholder="Société" value={societe} onChange={e => setSociete(e.target.value)} required className="form-control mb-2" />
      <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="form-control mb-2" />
      <button type="submit" className="btn btn-primary w-100">S'inscrire</button>
      {message && <div className="alert alert-info mt-2">{message}</div>}
    </form>
  );
}
