import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", societe: "", nom: "", prenom: "" });
  const [loading, setLoading] = useState(false);

  // Gestion du formulaire
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Connexion
  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success("Connexion réussie !");
        // Redirige vers dashboard après 1s
        setTimeout(() => window.location.href = "/dashboard", 1000);
      } else {
        toast.error(data.message || "Erreur de connexion.");
      }
    } catch (err) {
      toast.error("Erreur serveur.");
    }
    setLoading(false);
  };

  // Inscription
  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success("Inscription réussie ! Connecte-toi.");
        setTab("login");
      } else {
        toast.error(data.message || "Erreur à l'inscription.");
      }
    } catch (err) {
      toast.error("Erreur serveur.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#4e54c8] to-[#8f94fb]">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-[#4e54c8] mb-8">ClaimOneOff</h1>
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg font-semibold ${tab === "login" ? "bg-[#4e54c8] text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setTab("login")}
          >Connexion</button>
          <button
            className={`px-4 py-2 rounded-r-lg font-semibold ${tab === "register" ? "bg-[#8f94fb] text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setTab("register")}
          >Inscription</button>
        </div>
        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border rounded p-2" />
            <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required className="w-full border rounded p-2" />
            <button type="submit" disabled={loading} className="w-full bg-[#4e54c8] text-white py-2 rounded hover:bg-[#3b399c] transition">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input name="societe" placeholder="Société" value={form.societe} onChange={handleChange} required className="w-full border rounded p-2" />
            <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required className="w-full border rounded p-2" />
            <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required className="w-full border rounded p-2" />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border rounded p-2" />
            <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required className="w-full border rounded p-2" />
            <button type="submit" disabled={loading} className="w-full bg-[#8f94fb] text-white py-2 rounded hover:bg-[#4e54c8] transition">
              {loading ? "Inscription..." : "Créer mon compte"}
            </button>
          </form>
        )}
      </div>
      <div className="mt-8 text-white text-sm opacity-70">© {new Date().getFullYear()} ClaimOneOff. Solution SaaS e-commerce.</div>
    </div>
  );
}
