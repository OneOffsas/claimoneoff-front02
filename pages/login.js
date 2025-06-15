import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

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
        // TODO : redirige selon rôle
        if (data.role === "Admin") window.location.href = "/admin";
        else window.location.href = "/tickets";
      } else {
        setMsg("Erreur : " + data.message);
      }
    } catch (e) {
      setMsg("Erreur réseau, merci de réessayer.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-700 to-blue-500">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center animate-fade-in">
        <Image src="/logo.png" width={90} height={90} alt="Logo ClaimOneOff" />
        <h2 className="text-2xl font-bold text-violet-800 mb-4 mt-2">Connexion</h2>
        <form onSubmit={handleLogin} className="w-full">
          <input className="border p-3 mb-4 w-full rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-violet-700 text-white py-2 rounded-xl font-semibold hover:bg-violet-800 transition mb-2">Se connecter</button>
        </form>
        <div className="mt-3 text-sm text-center text-gray-500">{msg}</div>
        <div className="mt-4 flex flex-col items-center w-full">
          <Link href="/forgot" className="text-blue-600 hover:underline text-xs mb-2">Mot de passe oublié ?</Link>
          <Link href="/register" className="text-violet-700 font-semibold hover:underline text-xs">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}

