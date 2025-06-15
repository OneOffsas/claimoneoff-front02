import { useState } from "react";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function handleForgot(e) {
    e.preventDefault();
    setMsg("Envoi du mail...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgotPassword", email }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg("Lien de réinitialisation envoyé si l’email existe.");
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
        <h2 className="text-2xl font-extrabold text-violet-800 mb-6 text-center font-logo">Mot de passe oublié</h2>
        <form onSubmit={handleForgot}>
          <input className="border p-3 mb-4 w-full rounded-xl text-lg" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button className="w-full bg-violet-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-violet-900 transition-all mb-2">Envoyer</button>
        </form>
        <div className="text-center text-gray-500 mt-4">{msg}</div>
      </div>
    </div>
  );
}
