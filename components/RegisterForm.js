import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [societe, setSociete] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Enregistrement en cours...");
    // Envoie à l’API Next.js
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nom, prenom, societe }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setMsg("Inscription réussie !");
    } else {
      setMsg("Erreur : " + (data.error || JSON.stringify(data)));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email"    type="email" value={email}    onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input placeholder="Nom"      type="text" value={nom}      onChange={e => setNom(e.target.value)} required />
      <input placeholder="Prénom"   type="text" value={prenom}   onChange={e => setPrenom(e.target.value)} required />
      <input placeholder="Société"  type="text" value={societe}  onChange={e => setSociete(e.target.value)} required />
      <button type="submit">S’inscrire</button>
      <div style={{marginTop: 10, color: "red"}}>{msg}</div>
    </form>
  );
}
