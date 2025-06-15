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
          <input className="form-control mb-3" placeholder="
