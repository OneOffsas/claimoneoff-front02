import { useState } from "react";
import { useNotification } from "../components/NotificationProvider";
import Head from "next/head";

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
        showNotification("🎉 Inscription réussie ! Connecte-toi.", "success");
        setTimeout(() => { window.location.href = "/login"; }, 1100);
      } else {
        showNotification(data.message || "Erreur d'inscription", "error");
      }
    } catch (err) {
      showNotification("Erreur serveur", "error");
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Inscription | ClaimOneOff</title>
      </Head>
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <form
          className="bg-white rounded-4 shadow-lg p-5"
          style={{ minWidth: 420, maxWidth: 480, width: "100%" }}
          onSubmit={handleRegister}
        >
          <h2 className="text-center mb-4">Créer un compte <b>ClaimOneOff</b></h2>
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
          <button className="btn btn-success w-100 rounded-3 py-2 fw-bold" type="submit" disabled={loading}>
            {loading ? "Inscription..." : "Créer mon compte"}
          </button>
          <div className="text-center mt-3">
            <a href="/login" className="text-secondary">Déjà un compte ? Connexion</a>
          </div>
        </form>
      </div>
    </>
  );
}
