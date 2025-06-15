import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function handleForgot(e) {
    e.preventDefault();
    setMsg("Envoi du lien de réinitialisation en cours...");
    // Ici, tu dois coder la logique d’envoi, à intégrer plus tard.
    setTimeout(() => {
      setMsg("Un lien a été envoyé à votre adresse e-mail si elle existe.");
    }, 1000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-700 to-blue-500">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center animate-fade-in">
        <Image src="/logo.png" width={80} height={80} alt="Logo ClaimOneOff" />
        <h2 className="text-2xl font-bold text-violet-800 mb-4 mt-2">Mot de passe oublié</h2>
        <form onSubmit={handleForgot} className="w-full">
          <input className="border p-3 mb-4 w-full rounded" type="email" placeholder="Votre email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button className="w-full bg-violet-700 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition">Envoyer</button>
        </form>
        <div className="mt-3 text-sm text-center text-gray-500">{msg}</div>
        <Link href="/login" className="mt-4 text-blue-600 hover:underline text-xs">Retour à la connexion</Link>
      </div>
    </div>
  );
}
