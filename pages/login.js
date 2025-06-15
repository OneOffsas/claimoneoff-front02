import { useState } from "react";
import { useRouter } from "next/router";
import { apiCall } from "../utils/api";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("Connexion en cours...");
    const res = await apiCall("login", { email, password });
    if (res.status === "success") {
      setMsg("Connexion réussie !");
      if (res.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      setMsg("Erreur : " + (res.message || "Email ou mot de passe incorrect"));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-600 to-blue-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="ClaimOneOff" className="w-20 h-20" />
        </div>
        <h2 className="text-2xl font-bold text-center text-violet-800 mb-4">Connexion</h2>
        <form onSubmit={handleLogin}>
          <input className="border p-2 mb-4 w-full rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border p-2 mb-4 w-full rounded" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-800 transition font-semibold mb-2">Se connecter</button>
        </form>
        <div className="mt-3 text-sm text-center text-gray-500">{msg}</div>
        <div className="mt-4 text-center">
          <Link href="/register" className="text-violet-600 hover:underline">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
