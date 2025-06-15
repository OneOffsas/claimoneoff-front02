import { useState } from "react";
import { API_URL } from "../utils/api";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        // Redirection intelligente selon le rôle
        if (data.role === "Admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setMsg(data.message || "Erreur de connexion");
      }
    } catch {
      setMsg("Erreur réseau.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-700 to-blue-600">
      <Head><title>Connexion | ClaimOneOff</title></Head>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="ClaimOneOff" className="w-20 h-20" />
        </div>
        <h2 className="text-2xl font-bold text-violet-700 text-center mb-4">Connexion</h2>
        <form onSubmit={handleLogin}>
          <input
            className="border p-2 mb-4 w-full rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="border p-2 mb-4 w-full rounded"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-violet-700 text-white py-2 rounded hover:bg-violet-900 transition font-semibold mb-2"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <div className="text-sm text-center mt-2 text-gray-500">
          <Link href="/register" className="text-violet-700 underline">Créer un compte</Link>
        </div>
        {msg && <div className="mt-3 text-sm text-center text-red-500">{msg}</div>}
      </div>
    </div>
  );
}
