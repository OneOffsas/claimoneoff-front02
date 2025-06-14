import { useState } from "react";
import { apiCall } from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await apiCall("login", { email, password });
    if (res.status === "success") {
      localStorage.setItem("user", JSON.stringify(res));
      window.location.href = "/dashboard";
    } else {
      setError(res.message || "Erreur de connexion.");
    }
  }

  return (
    <div className="card">
      <img src="/logo.png" width={120} height={60} alt="Logo" className="logo" />
      <h2>Connexion à ClaimOneOff</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Se connecter</button>
      </form>
      <p><a href="/register">Créer un compte</a></p>
      {error && <div style={{color: "red"}}>{error}</div>}
    </div>
  );
}
