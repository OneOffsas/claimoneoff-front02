import { useEffect, useState } from "react";

const statusLabels = {
  Nouveau: "badge nouveau",
  "En cours": "badge encours",
  "Traité": "badge traite",
  "Remboursé": "badge rembourse",
  "En attente": "badge attente",
  "Réclamation transporteur": "badge attente",
};

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState({ societe: "", statut: "", urgence: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) window.location.href = "/login";
    else {
      const userObj = JSON.parse(u);
      if (userObj.role !== "Admin") {
        window.location.href = "/dashboard";
        return;
      }
      setUser(userObj);
      fetchTickets();
    }
    // eslint-disable-next-line
  }, []);

  async function fetchTickets() {
    try {
      const res = await fetch("/api/tickets?role=Admin");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {
      setMessage("Erreur lors du chargement des tickets");
    }
  }

  // Statistiques simples
  const nbTotal = tickets.length;
  const nbUrgents = tickets.filter(t => t.urgence === "Oui").length;
  const nbOuverts = tickets.filter(t => t.statut === "Nouveau" || t.statut === "En cours" || t.statut === "En attente").length;
  const nbResolus = tickets.filter(t => t.statut === "Traité" || t.statut === "Remboursé").length;

  // Filtres
  const uniqueSocietes = Array.from(new Set(tickets.map(t => t.societe || ""))).filter(Boolean);
  const filtered = tickets.filter(t =>
    (!filter.societe || t.societe === filter.societe) &&
    (!filter.statut || t.statut === filter.statut) &&
    (!filter.urgence || t.urgence === filter.urgence)
  );

  if (!user) return <div>Chargement...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <h2 style={{ color: "#6C47FF", fontWeight: 800 }}>🎛️ Admin – Gestion des tickets</h2>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{
          background: "#fff", color: "#6C47FF", border: "1px solid #eee", padding: "8px 20px", borderRadius: 8,
          fontWeight: 600, cursor: "pointer"
        }}>Déconnexion</button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 24, marginBottom: 40, flexWrap: "wrap" }}>
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

      {/* Filtres */}
      <div className="card" style={{ marginBottom: 32, display: "flex", gap: 24, alignItems: "center" }}>
        <div>
          <label>Société :{" "}
            <select value={filter.societe} onChange={e => setFilter({ ...filter, societe: e.target.value })}>
              <option value="">Toutes</option>
              {uniqueSocietes.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <div>
          <label>Statut :{" "}
            <select value={filter.statut} onChange={e => setFilter({ ...filter, statut: e.target.value })}>
              <option value="">Tous</option>
              <option>Nouveau</option>
              <option>En cours</option>
              <option>Traité</option>
              <option>Remboursé</option>
              <option>En attente</option>
              <option>Réclamation transporteur</option>
            </select>
          </label>
        </div>
        <div>
          <label>Urgence :{" "}
            <select value={filter.urgence} onChange={e => setFilter({ ...filter, urgence: e.target.value })}>
              <option value="">Tous</option>
              <option>Oui</option>
              <option>Non</option>
            </select>
          </label>
        </div>
        <button onClick={() => setFilter({ societe: "", statut: "", urgence: "" })} style={{
          background: "#eee", color: "#212155", border: "none", padding: "8px 14px", borderRadius: 8,
          fontWeight: 600, cursor: "pointer"
        }}>Effacer les filtres</button>
      </div>

      {/* Tableau */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", marginTop: 18, borderCollapse: "collapse", background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px #eee" }}>
          <thead>
            <tr style={{ background: "#f2f3f9" }}>
              <th>Société</th>
              <th>Utilisateur</th>
              <th>Email</th>
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
            {filtered.map((t, i) => (
              <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #eee" }}>
                <td>{t.societe}</td>
                <td>{t.utilisateur}</td>
                <td>{t.email}</td>
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center" }}>Aucun ticket.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
