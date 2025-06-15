import { useState } from "react";
import { apiCall } from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("Connexion en cours…");
    const res = await apiCall("login", { email, password });
    if (res.status === "success") {
      localStorage.setItem("user", JSON.stringify(res));
      window.location = "/dashboard";
    } else {
      setMsg("❌ " + (res.message || "Erreur de connexion"));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-600 to-blue-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="ClaimOneOff" className="w-24 h-24" />
        </div>
        <h2 className="text-2xl font-bold text-center text-violet-800 mb-4">Connexion à ClaimOneOff</h2>
        <form onSubmit={handleLogin}>
          <input className="border p-2 mb-4 w-full rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border p-2 mb-4 w-full rounded" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-800 transition font-semibold mb-2">Se connecter</button>
        </form>
        <div className="mt-3 text-sm text-center text-gray-500">{msg}</div>
        <div className="mt-4 text-center">
          <a href="/register" className="text-violet-700 font-bold underline">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}

