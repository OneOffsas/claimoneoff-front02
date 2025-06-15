import { useState } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzM3_gHbhIQsDvQXRFP8fPGzfeDoEbCCkY8lxSpWxaXSopU0u1X6jP2LPTjz8XkSShDKg/exec";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("Connexion en cours...");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        email,
        password,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setMsg("Connexion réussie !");
      // Enregistre email/role pour usage dans d'autres pages si besoin
      localStorage.setItem("userEmail", data.email || email);
      localStorage.setItem("userRole", data.role || "");
      // Redirige vers tickets ou dashboard ou autre :
      window.location.href = "/tickets";
    } else {
      setMsg("Erreur : " + data.message);
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 p-8 bg-white shadow rounded">
      <h2 className="text-2xl mb-4 font-bold text-center">Connexion</h2>
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="border p-2 mb-4 w-full"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-800 transition">Se connecter</button>
      <div className="mt-3 text-sm text-center text-gray-500">{msg}</div>
    </form>
  );
}


