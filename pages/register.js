import { useState } from "react";
import { apiCall } from "../utils/api";
import Link from "next/link";

export default function Register() {
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setMsg("Création du compte...");
    const res = await apiCall("register", { societe, nom, prenom, email, password });
    if (res.status === "success") {
      setMsg("Compte créé ! Vous pouvez vous connecter.");
    } else {
      setMsg("Erreur : " + (res.message || "Impossible de créer le compte."));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-600 to-blue-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="ClaimOneOff" className="w-20 h-20" />
        </div>
        <h2 className="text-2xl font-bold text-center text-violet-800 mb-4">Créer un compte</h2>
        <form onSubmit={handleRegister}>
          <input className="border p-2 mb-4 w-full rounded" placeholder="Société" value={societe} onChange={e => setSociete(e.target.value)} required />
          <input className="border p-2 mb-4 w-full rounded" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
          <input className="border p-2 mb-4 w-full rounded" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
          <input className="border p-2 mb-4 w-full rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border p-2 mb-4 w-full rounded" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-800 transition font-semibold mb-2">Créer mon compte</button>
        </form>
        <div className="mt-3 text-sm text-center text-gray-500">{msg}</div>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-violet-600 hover:underline">Déjà un compte ? Se connecter</Link>
        </div>
      </div>
    </div>
  );
}

