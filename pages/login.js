import { useState } from "react";
import { toast } from "react-toastify";
import sha256 from "js-sha256";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email et mot de passe requis !");
      return;
    }
    setLoading(true);
    const passwordHash = sha256(password);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        passwordHash,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.status === "success") {
      toast.success("Connexion réussie !");
      // Stocke l'utilisateur en session/localStorage si besoin
      // Redirige vers le dashboard
      router.push("/dashboard");
    } else {
      toast.error(data.message || "Erreur de connexion");
    }
  }

  return (
    <div className="container p-4 mt-5" style={{maxWidth: 420}}>
      <h2 className="mb-4">Connexion</h2>
      <form onSubmit={handleLogin} className="card shadow p-4">
        <input className="form-control mb-3" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <input className="form-control mb-4" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} type="password" />
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
