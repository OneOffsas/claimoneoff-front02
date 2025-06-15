import { useState } from "react";
import { useRouter } from "next/router";

const API_URL = "https://script.google.com/macros/s/AKfycbz4oaV2F4-DeHC4-oYaR8wiTgha1ROTXN1WAMQT9H72SPI6b1NCtlClxZ8WwR0f6rZ9lg/exec";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("Connexion en cours...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        localStorage.setItem("user_claimoneoff", JSON.stringify(data));
        setMsg("Connexion réussie !");
        setTimeout(() => {
          if (data.role === "Admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }, 800);
      } else {
        setMsg(data.message || "Email ou mot de passe incorrect");
      }
    } catch {
      setMsg("Erreur réseau ou serveur. Veuillez réessayer.");
    }
    setLoading(false);
  }

  function goRegister() {
    router.push("/register");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-700 to-blue-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="ClaimOneOff" className="w-20 h-20" />
        </div>
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-6">Connexion</h2>
        <form onSubmit={handleLogin}>
          <input
            className="border p-2 mb-4 w-full rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            className="border p-2 mb-4 w-full rounded"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full bg-violet-700 text-white py-2 rounded hover:bg-blue-700 transition font-semibold mb-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <div className="mt-3 text-center text-sm text-gray-500">
          <button
            className="underline text-violet-700 hover:text-blue-800"
            onClick={goRegister}
          >
            Pas encore de compte ? Créer un compte
          </button>
        </div>
        <div className="mt-3 text-center text-red-600 font-bold">{msg}</div>
      </div>
    </div>
  );
}

