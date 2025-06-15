import { useEffect, useState } from "react";
import Link from "next/link";

const statusLabels = {
  Nouveau: "badge nouveau",
  "En cours": "badge encours",
  "Traité": "badge traite",
  "Remboursé": "badge rembourse",
  "En attente": "badge attente",
  "Réclamation transporteur": "badge attente",
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

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
          description,
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

  // Statistiques simples
  const nbTotal = tickets.length;
  const nbUrgents = tickets.filter(t => t.urgence === "Oui").length;
  const nbOuverts = tickets.filter(t => t.statut === "Nouveau" || t.statut === "En cours" || t.statut === "En attente").length;
  const nbResolus = tickets.filter(t => t.statut === "Traité" || t.statut === "Remboursé").length;

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "30px 0" }}>
      {/* Header utilisateur */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32,
      }}>
        <h2 style={{ color: "#212155" }}>
          👋 Bonjour <span style={{ color: "#6C47FF" }}>{user.prenom}</span>
        </h2>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{
          background: "#fff", color: "#6C47FF", border: "1px solid #eee", padding: "8px 20px", borderRadius: 8,
          fontWeight: 600, cursor: "pointer"
        }}>Déconnexion</button>
      </div>

      {/* Statistiques */}
      <div style={{
        display: "flex", gap: 24, marginBottom: 40, flexWrap: "wrap"
      }}>
        <div className="card" style={{ minWidth: 160, textAlign: "center", borderBottom: "4px solid #6C47FF" }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{nbTotal}</div>
          <div style={{ color: "#6C47FF", fontWeight: 600 }}>Tickets</div>
        </div>
        <div className="card" style={{ minWidth: 160, textAlign: "center", borderBottom: "4px solid #ff0040" }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{nbUrgents}</div>
          <div style={{ color: "#ff0040", fontWeight: 600 }}>Urgents</div>
        </div>
        <div className="card" style={{ minWidth: 160, textAlign: "center", borderBottom: "4px solid #3b82f6" }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{nbOuverts}</div>
          <div style={{ color: "#3b82f6", fontWeight: 600 }}>Ouverts</div>
        </div>
        <div className="card" style={{ minWidth: 160, textAlign: "center", borderBottom: "4px solid #22c55e" }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{nbResolus}</div>
          <div style={{ color: "#22c55e", fontWeight: 600 }}>Résolus</div>
        </div>
      </div>

      {/* Bouton / formulaire ticket */}
      <div>
        <button style={{
          background: "#6C47FF", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px",
          fontWeight: 600, fontSize: 16, marginBottom: 22, cursor: "pointer"
        }} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fermer le formulaire" : "Créer un nouveau ticket"}
        </button>

        {showForm && (
          <form onSubmit={handleCreateTicket} className="card" style={{ margin: "18px 0" }}>
            <div style={{ marginBottom: 14 }}>
              <label>Urgence&nbsp;
                <select value={urgence} onChange={e => setUrgence(e.target.value)}>
                  <option value="Non">Non</option>
                  <option value="Oui">Oui</option>
                </select>
              </label>
              {urgence === "Oui" && (
                <div className="stat-badge" style={{
                  background: "#ff0040", margin: "8px 0", fontWeight: 700, fontSize: 15
                }}>
                  ⚡ Demande urgente : traitement prioritaire (+5 €)
                </div>
              )}
            </div>
            <input placeholder="Numéro de commande" value={numeroCommande} onChange={e => setNumeroCommande(e.target.value)} required={urgence === "Oui"} style={{ width: 200, margin: 6 }} />
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
            <button type="submit" style={{
              marginTop: 8, background: "#212155", color: "#fff", border: "none", borderRadius: 8, padding: "12px 30px", fontWeight: 600
            }}>Envoyer le ticket</button>
          </form>
        )}
      </div>

      {/* Tableau tickets */}
      <h3 style={{ marginTop: 38 }}>Mes tickets</h3>
      {message && <div style={{ margin: 8, color: message.startsWith("Ticket") ? "green" : "red" }}>{message}</div>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", marginTop: 18, borderCollapse: "collapse", background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px #eee" }}>
          <thead>
            <tr style={{ background: "#f2f3f9" }}>
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
              <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #eee" }}>
                <td>{t.id}</td>
                <td>{t.urgence}</td>
                <td>{t.numero_commande}</td>
                <td>{t.problematique}</td>
                <td>{t.transporteur}</td>
                <td>{t.description}</td>
                <td>
                  <span className={statusLabels[t.statut] || "badge"}>{t.statut}</span>
                </td>
                <td>{t.date_ouverture}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>Aucun ticket pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
