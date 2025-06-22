import React, { useState } from "react";
import { sha256 } from "js-sha256";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Merci de remplir tous les champs !");
      return;
    }
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email,
          passwordHash: sha256(password)
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Connexion réussie !");
        // ici tu peux rediriger, stocker le user, etc.
        window.location.href = "/dashboard";
      } else {
        toast.error(data.message || "Erreur de connexion !");
      }
    } catch (err) {
      toast.error("Erreur de connexion réseau !");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 card shadow mt-5" style={{maxWidth:480, margin:"auto"}}>
      <h2 className="mb-4">Connexion</h2>
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
      <button type="submit" className="btn btn-primary w-100">Se connecter</button>
    </form>
  );
}
