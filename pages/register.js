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

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    console.log(form); // Vérifie la data
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
    <form onSubmit={handleSubmit}>
      <input name="societe" placeholder="Société" onChange={handleChange} required />
      <input name="nom" placeholder="Nom" onChange={handleChange} required />
      <input name="prenom" placeholder="Prénom" onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="motDePasse" placeholder="Mot de passe" type="password" onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
      {message && <p>{message}</p>}
    </form>
  );
}
