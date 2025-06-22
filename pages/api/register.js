// pages/register.js

import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    societe: "",
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "client",
  });
  const [message, setMessage] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) setMessage("Inscription réussie !");
    else setMessage(data.message || "Erreur à l'inscription");
  };

  return (
    <div style={{maxWidth: 400, margin: "auto", padding: 30}}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input name="societe" placeholder="Société" value={form.societe} onChange={handleChange} required /><br />
        <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required /><br />
        <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required /><br />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required /><br />
        <input name="motDePasse" placeholder="Mot de passe" type="password" value={form.motDePasse} onChange={handleChange} required /><br />
        {/* Role caché */}
        <input type="hidden" name="role" value="client" />
        <button type="submit">S'inscrire</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
