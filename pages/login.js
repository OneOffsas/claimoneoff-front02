import { useState } from "react";

const API_URL = "https://billowing-base-6a8c.oneoffsas.workers.dev/";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [resetMode, setResetMode] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("Connexion en cours...");
    try {
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
        localStorage.setItem("userEmail", data.email || email);
        localStorage.setItem("userRole", data.role || "");
        // Redirige l'utilisateur selon le rôle
        if (data.role === "Admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/tickets";
        }
      } else {
        setMsg("Erreur : " + data.message);
      }
    } catch (e) {
      setMsg("Erreur réseau, merci de réessayer.");
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setMsg("Envoi du mail de réinitialisation...");
    // Ici tu dois gérer l'action côté Apps Script pour envoyer le reset.
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "resetPassword",
        email,
      }),
    });
    const data = await res.json();
    setMsg(data.status === "success"
      ? "Un email a été envoyé si l'adresse existe."
      : "Erreur : " + data.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-600 to-blue-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="ClaimOneOff" className="w-24 h-24" />
        </div>
        <h2 className="text-2xl font-bold text-center text-violet-800 mb-4">Connexion à ClaimOneOff</h2>
        <form onSubmit={resetMode ? handleReset : handleLogin}>
          <input
            className="border p-2 mb-4 w-full rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {!resetMode && (
            <input
              className="border p-2 mb-4 w-full rounded"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          )}
          <button className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-800 transition font-semibold mb-2">
            {resetMode ? "Réinitialiser mon mot de passe" : "Se connecter"}
          </button>
        </form>
        <button
          className="text-xs text-blue-500 underline mt-2 w-full"
          onClick={() => setResetMode(!resetMode)}
        >
          {resetMode ? "← Retour à la connexion" : "Mot de passe oublié ?"}
        </button>
        <div className="mt-3 text-sm text-center text-gray-500">{msg}</div>
      </div>
    </div>
  );
}

