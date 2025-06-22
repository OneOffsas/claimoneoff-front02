import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    societe: "",
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "client"
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Inscription en cours...");
    // Affiche les valeurs dans la console pour debug
    console.log("DATA ENVOYÉE AU BACK :", form);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    let data = {};
    try { data = await res.json(); } catch { }
    if (res.ok) setMessage("✅ Inscription réussie !");
    else setMessage(data.message || "❌ Erreur à l'inscription");
  };

  return (
    <div style={{ maxWidth: 350, margin: "auto", marginTop: 60 }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input name="societe" placeholder="Société" value={form.societe} onChange={handleChange} required /><br/>
        <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required /><br/>
        <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required /><br/>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br/>
        <input name="motDePasse" type="password" placeholder="Mot de passe" value={form.motDePasse} onChange={handleChange} required /><br/>
        <button type="submit" style={{ marginTop: 15 }}>Créer mon compte</button>
      </form>
      <div style={{marginTop: 20, color: "#B00", minHeight: 30}}>{message}</div>
    </div>
  );
}
