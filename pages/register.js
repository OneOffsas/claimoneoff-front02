import { useState } from "react";
import { useRouter } from "next/router";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Register() {
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    setMsg("Création du compte...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          societe,
          nom,
          prenom,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg("Compte créé ! Connectez-vous.");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        setMsg("Erreur : " + data.message);
      }
    } catch (e) {
      setMsg("Erreur réseau, merci de réessayer.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-700 via-indigo-600 to-blue-400">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-6 w-20 h-20" />
        <h2 className="text-2xl font-extrabold text-violet-800 mb-6 text-center font-logo">Créer votre compte</h2>
        <form onSubmit={handleRegister}>
          <input className="border p-3 mb-4 w-full rounded-xl text-lg" placeholder="Société" value={societe} onChange={e => setSociete(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded-xl text-lg" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded-xl text-lg" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded-xl text-lg" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded-xl text-lg" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-violet-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-violet-900 transition-all mb-2">Créer mon compte</button>
        </form>
        <div className="mt-4 text-sm text-center text-gray-500">{msg}</div>
        <div className="text-center mt-4">
          <a href="/login" className="text-violet-700 hover:underline">Déjà inscrit ? Se connecter</a>
        </div>
      </div>
    </div>
  );
}
