import { useState } from "react";
import { useRouter } from "next/router";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("Connexion en cours...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg("Connexion réussie !");
        if (data.role === "Admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setMsg("Erreur : " + data.message);
      }
    } catch {
      setMsg("Erreur réseau, réessayez.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-700 via-indigo-600 to-blue-400">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-6 w-20 h-20" />
        <h2 className="text-2xl font-extrabold text-violet-800 mb-6 text-center font-logo">Connexion à ClaimOneOff</h2>
        <form onSubmit={handleLogin}>
          <input type="email" className="border p-3 mb-4 w-full rounded-xl text-lg" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" className="border p-3 mb-4 w-full rounded-xl text-lg" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-violet-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-violet-900 transition-all mb-2">Se connecter</button>
        </form>
        <div className="text-center text-gray-500 mt-4">{msg}</div>
        <div className="text-center mt-6">
          <a href="/forgot" className="text-sm text-blue-700 hover:underline">Mot de passe oublié ?</a>
        </div>
        <div className="text-center mt-2">
          <a href="/register" className="text-sm text-violet-700 hover:underline">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}
