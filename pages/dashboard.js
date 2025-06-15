import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Champs du ticket
  const [urgence, setUrgence] = useState("Non");
  const [numeroCommande, setNumeroCommande] = useState("");
  const [problematique, setProblematique] = useState("");
  const [transporteur, setTransporteur] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) window.location.href = "/login";
    else {
      setUser(JSON.parse(u));
      fetchTickets(JSON.parse(u));
    }
    // eslint-disable-next-line
  }, []);

  async function fetchTickets(u) {
    try {
      const res = await fetch("/api/tickets?role=" + u.role + "&email=" + u.email);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch { setMessage("Erreur lors du chargement des tickets"); }
  }

  async function handleCreateTicket(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          societe: user.societe,
          utilisateur: `${user.prenom} ${user.nom}`,
          email: user.email,
          role: user.role,
          urgence,
          numero_commande: numeroCommande,
          problematique,
          transporteur,
          description
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("Ticket créé !");
        setUrgence("Non"); setNumeroCommande(""); setProblematique(""); setTransporteur(""); setDescription("");
        setShowForm(false); fetchTickets(user);
      } else setMessage(data.message || "Erreur lors de la création");
    } catch { setMessage("Erreur réseau ou serveur"); }
  }

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="main-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Bienvenue {user.prenom} !</h2>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Déconnexion</button>
      </div>
      <div>
        <button style={{ margin: "24px 0" }} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fermer le formulaire" : "Créer un ticket"}
        </button>
        {showForm && (
          <form onSubmit={handleCreateTicket} className="card" style={{ marginTop: 8 }}>
            <label>
              Urgence&nbsp;
              <select value={urgence} onChange={e => setUrgence(e.target.value)}>
                <option value="Non">Non</option>
                <option value="Oui">Oui</option>
              </select>
            </label>
            {urgence === "Oui" && (
              <div className="stat-badge" style={{ background: "#ff0040", margin: "8px 0" }}>
                ⚡ Demande urgente (traitement prioritaire, +5 €)
              </div>
            )}
            <input placeholder="Numéro de commande" value={numeroCommande} onChange={e => setNumeroCommande(e.target.value)} style={{ width: 200, margin: 6 }} required={urgence === "Oui"} />
            <input placeholder="Problématique (ex: retard livraison…)" value={problematique} onChange={e => setProblematique(e.target.value)} style={{ width: 320, margin: 6 }} />
            <select value={transporteur} onChange={e => setTransporteur(e.target.value)} style={{ width: 180, margin: 6 }}>
              <option value="">Transporteur</option>
              <option>Colissimo</option>
              <option>Mondial Relay</option>
              <option>Chronopost</option>
              <option>GLS</option>
              <option>DPD</option>
              <option>Autre</option>
            </select>
            <textarea placeholder="Décris ton problème" value={description} onChange={e => setDescription(e.target.value)} required style={{ width: "98%", margin: "8px 0", padding: 8 }} />
            <button type="submit">Envoyer le ticket</button>
          </form>
        )}
        <h3 style={{ marginTop: 32 }}>Mes tickets</h3>
        {message && <div style={{ margin: 8, color: message.startsWith("Ticket") ? "green" : "red" }}>{message}</div>}
        <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>ID</th>
              <th>Urgence</th>
              <th>Commande</th>
              <th>Problème</th>
              <th>Transporteur</th>
              <th>Description</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={i}>
                <td>{t.id}</td>
                <td>{t.urgence}</td>
                <td>{t.numero_commande}</td>
                <td>{t.problematique}</td>
                <td>{t.transporteur}</td>
                <td>{t.description}</td>
                <td><span className={`badge ${t.statut?.toLowerCase()}`}>{t.statut}</span></td>
                <td>{t.date_ouverture}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center" }}>Aucun ticket pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
