import { useState } from "react";
const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function CreateTicket() {
  const user = typeof window !== "undefined" && JSON.parse(localStorage.getItem("claimUser"));
  const [problematique, setProblematique] = useState("");
  const [description, setDescription] = useState("");
  const [urgence, setUrgence] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Envoi en cours...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createTicket",
          societe: user.societe,
          utilisateur: user.nom + " " + user.prenom,
          email: user.email,
          role: user.role,
          problematique,
          description,
          urgence: urgence ? "Oui" : "Non"
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg("Ticket créé avec succès !");
        setTimeout(() => window.location.href = "/dashboard", 1200);
      } else {
        setMsg("Erreur : " + data.message);
      }
    } catch {
      setMsg("Erreur réseau.");
    }
  }

  if (!user) return <div className="vh-100 d-flex align-items-center justify-content-center"><div>Connexion requise.</div></div>;

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{background:"linear-gradient(120deg,#7356fa,#0a3d91)"}}>
      <div className="card shadow-lg p-4" style={{minWidth:350, maxWidth:400, borderRadius:20}}>
        <div className="text-center mb-3">
          <h2 className="brand mb-0 fw-bold" style={{color:'#322d53'}}>Nouveau ticket</h2>
          <div className="text-muted small">Décrivez votre problème en détail</div>
        </div>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3" placeholder="Problématique (ex : colis perdu)" value={problematique} onChange={e => setProblematique(e.target.value)} required />
          <textarea className="form-control mb-3" rows={4} placeholder="Description détaillée" value={description} onChange={e => setDescription(e.target.value)} required />
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="urgence" checked={urgence} onChange={e => setUrgence(e.target.checked)} />
            <label className="form-check-label fw-bold" htmlFor="urgence">
              Urgence <span className="text-danger">(Traitement prioritaire, +5 €)</span>
            </label>
          </div>
          {urgence && (
            <div className="alert alert-warning p-2 py-1 mb-3 text-center" style={{fontSize:15, borderRadius:9}}>
              <b>Attention :</b> Un traitement prioritaire ajoute 5 € de frais supplémentaires.
            </div>
          )}
          <button className="btn btn-primary w-100 rounded-pill shadow-sm">Envoyer le ticket</button>
        </form>
        <div className="text-danger text-center small mt-3">{msg}</div>
      </div>
    </div>
  );
}
