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
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await apiCall("register", { societe, nom, prenom, email, password });
      if (res.status === "success") {
        setMsg("🎉 Compte créé ! Vous pouvez vous connecter.");
      } else {
        setMsg("❌ " + res.message);
      }
    } catch {
      setMsg("❌ Erreur réseau, merci de réessayer.");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-violet-700 to-blue-600">
      <div className="bg-white shadow-2xl rounded-3xl px-10 py-8 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="ClaimOneOff" className="w-20 h-20 drop-shadow" />
        </div>
        <h2 className="text-2xl font-bold text-center text-violet-800 mb-3">Créer un compte</h2>
        <form onSubmit={handleRegister}>
          <input className="border p-3 mb-4 w-full rounded-lg" placeholder="Société" value={societe} onChange={e => setSociete(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded-lg" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded-lg" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded-lg" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded-lg" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-800 transition font-bold mb-2" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>
        <div className="text-sm text-center mt-2">
          <Link href="/login" className="text-violet-700 hover:underline">Se connecter</Link>
        </div>
        <div className="mt-3 text-center text-gray-500 min-h-[20px]">{msg}</div>
      </div>
    </div>
  );
}
