import { useState } from "react";
import { apiCall } from "../utils/api";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await apiCall("login", { email, password });
      if (res.status === "success") {
        setMsg("Connexion réussie !");
        // Stocker les infos dans le localStorage (ou state management)
        localStorage.setItem("user", JSON.stringify(res));
        if (res.role === "Admin") router.push("/admin");
        else router.push("/dashboard");
      } else {
        setMsg("❌ " + res.message);
      }
    } catch {
      setMsg("❌ Erreur réseau, réessayez.");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-violet-700 to-blue-600">
      <div className="bg-white shadow-xl rounded-3xl px-10 py-8 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="ClaimOneOff" className="w-20 h-20 drop-shadow" />
        </div>
        <h2 className="text-2xl font-bold text-center text-violet-800 mb-3">Connexion</h2>
        <form onSubmit={handleLogin}>
          <input className="border p-3 mb-4 w-full rounded-lg" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded-lg" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-violet-700 text-white py-3 rounded-xl hover:bg-violet-900 transition font-bold mb-2" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
        <div className="text-sm text-center mt-2">
          <Link href="/register" className="text-blue-700 hover:underline">Créer un compte</Link>
        </div>
        <div className="mt-3 text-center text-gray-500 min-h-[20px]">{msg}</div>
      </div>
    </div>
  );
}
