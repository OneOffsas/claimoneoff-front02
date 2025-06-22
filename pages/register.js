import { useState } from "react";
import { toast } from "react-toastify";
import sha256 from "js-sha256";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    if (!email || !password || !societe || !nom || !prenom) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }
    setLoading(true);
    const passwordHash = sha256(password);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        passwordHash,
        societe,
        nom,
        prenom,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.status === "success") {
      toast.success("Inscription réussie !");
      // Redirection ou reset form
    } else {
      toast.error(data.message || "Erreur à l'inscription");
    }
  }

  return (
    <div className="container p-4 mt-5" style={{maxWidth: 420}}>
      <h2 className="mb-4">Inscription</h2>
      <form onSubmit={handleRegister} className="card shadow p-4">
        <input className="form-control mb-2" placeholder="Société" value={societe} onChange={e => setSociete(e.target.value)} />
        <input className="form-control mb-2" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
        <input className="form-control mb-2" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} />
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <input className="form-control mb-3" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} type="password" />
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Création..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}

