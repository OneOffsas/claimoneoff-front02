import React, { useState } from "react";
import { sha256 } from "js-sha256";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [societe, setSociete] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !nom || !prenom || !societe) {
      toast.error("Merci de remplir tous les champs !");
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          email,
          passwordHash: sha256(password),
          nom,
          prenom,
          societe
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Inscription réussie !");
        window.location.href = "/login";
      } else {
        toast.error(data.message || "Erreur d'inscription !");
      }
    } catch (err) {
      toast.error("Erreur réseau lors de l'inscription !");
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-4 card shadow mt-5" style={{maxWidth:480, margin:"auto"}}>
      <h2 className="mb-4">Créer un compte</h2>
      <div className="mb-3">
        <label className="form-label">Nom</label>
        <input type="text" className="form-control" value={nom}
          onChange={e => setNom(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Prénom</label>
        <input type="text" className="form-control" value={prenom}
          onChange={e => setPrenom(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Société</label>
        <input type="text" className="form-control" value={societe}
          onChange={e => setSociete(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" value={email}
          onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Mot de passe</label>
        <input type="password" className="form-control" value={password}
          onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary w-100">Créer le compte</button>
    </form>
  );
}
