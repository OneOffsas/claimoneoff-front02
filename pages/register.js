import { useState } from "react";
import { useNotification } from "../components/NotificationProvider";

export default function Register() {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    const passwordHash = window.sha256(password);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, passwordHash, societe, nom, prenom
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        showNotification("Inscription réussie !", "success");
        setTimeout(() => { window.location.href = "/login"; }, 1200);
      } else {
        showNotification(data.message || "Erreur d'inscription", "error");
      }
    } catch (err) {
      showNotification("Erreur serveur", "error");
    }
    setLoading(false);
  }

  return (
    <div className="container mt-5">
      <h2>Créer un compte ClaimOneOff</h2>
      <form className="card p-4 shadow" style={{ maxWidth: 460 }} onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Société</label>
          <input value={societe} onChange={e=>setSociete(e.target.value)} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Nom</label>
          <input value={nom} onChange={e=>setNom(e.target.value)} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Prénom</label>
          <input value={prenom} onChange={e=>setPrenom(e.target.value)} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Mot de passe</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="form-control" required />
        </div>
        <button className="btn btn-success w-100" type="submit" disabled={loading}>
          {loading ? "Inscription..." : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}
