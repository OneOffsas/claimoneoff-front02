import { useState } from "react";
import { useNotification } from "../components/NotificationProvider";

export default function Login() {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const passwordHash = window.sha256(password); // Utilise js-sha256
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwordHash }),
      });
      const data = await res.json();
      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data));
        showNotification("Connexion réussie !", "success");
        setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
      } else {
        showNotification(data.message || "Erreur de connexion", "error");
      }
    } catch (err) {
      showNotification("Erreur serveur", "error");
    }
    setLoading(false);
  }

  return (
    <div className="container mt-5">
      <h2>Connexion à ClaimOneOff</h2>
      <form className="card p-4 shadow" style={{ maxWidth: 420 }} onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Mot de passe</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="form-control" required />
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
