import { useState } from "react";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Register() {
  const [form, setForm] = useState({ societe: "", nom: "", prenom: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setMsg("Inscription en cours...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", ...form }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg("🎉 Compte créé ! Vous pouvez vous connecter.");
      } else {
        setMsg("❌ " + (data.message || "Erreur inconnue."));
      }
    } catch {
      setMsg("❌ Erreur réseau, merci de réessayer.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
      <form className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full animate-fade-in" onSubmit={handleRegister}>
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="ClaimOneOff" className="w-20 h-20" />
        </div>
        <h2 className="text-3xl font-extrabold text-center text-primary mb-5">Créer mon compte</h2>
        <input className="border border-gray-300 p-3 mb-4 w-full rounded-xl focus:ring-2 focus:ring-primary" placeholder="Société" value={form.societe} onChange={e => setForm({ ...form, societe: e.target.value })} required />
        <input className="border border-gray-300 p-3 mb-4 w-full rounded-xl focus:ring-2 focus:ring-primary" placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
        <input className="border border-gray-300 p-3 mb-4 w-full rounded-xl focus:ring-2 focus:ring-primary" placeholder="Prénom" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
        <input className="border border-gray-300 p-3 mb-4 w-full rounded-xl focus:ring-2 focus:ring-primary" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="border border-gray-300 p-3 mb-4 w-full rounded-xl focus:ring-2 focus:ring-primary" type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary font-bold transition">Créer mon compte</button>
        <div className="mt-4 text-center text-gray-600">{msg}</div>
      </form>
    </div>
  );
}
