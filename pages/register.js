import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Register() {
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setMsg("Inscription en cours...");
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
        setMsg("Compte créé ! Vous pouvez vous connecter.");
      } else {
        setMsg("Erreur : " + data.message);
      }
    } catch (e) {
      setMsg("Erreur réseau, merci de réessayer.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-700 to-blue-500">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center animate-fade-in">
        <Image src="/logo.png" width={80} height={80} alt="Logo ClaimOneOff" />
        <h2 className="text-2xl font-bold text-violet-800 mb-4 mt-2">Créer un compte</h2>
        <form onSubmit={handleRegister} className="w-full">
          <input className="border p-3 mb-4 w-full rounded" placeholder="Société" value={societe} onChange={e => setSociete(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border p-3 mb-4 w-full rounded" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-blue-700 text-white py-2 rounded-xl font-semibold hover:bg-violet-700 transition mb-2">Créer mon compte</button>
        </form>
        <div className="mt-3 text-sm text-center text-gray-500">{msg}</div>
        <div className="mt-4 w-full flex flex-col items-center">
          <Link href="/login" className="text-violet-700 font-semibold hover:underline text-xs">J'ai déjà un compte</Link>
        </div>
      </div>
    </div>
  );
}

