import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Badge } from "react-bootstrap";

export default function AdminTickets({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getTickets",
        role: "Admin"
      }),
    });
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
  };

  useEffect(() => { loadTickets(); }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0" style={{ fontWeight: 800, color: "#2b43c7" }}>Vue Globale des Tickets</h2>
        <CSVLink
          data={tickets}
          filename={"claimoneoff-tickets.csv"}
          className="btn btn-outline-success btn-sm"
        >
          Export CSV
        </CSVLink>
        <button className="btn btn-outline-secondary btn-sm ms-2" onClick={loadTickets}>Rafraîchir</button>
      </div>
      <div className="card shadow border-0">
        <div className="card-header bg-white" style={{ fontWeight: 700 }}>Tous les Tickets</div>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Société</th>
                <th>Utilisateur</th>
                <th>Date</th>
                <th>Commande</th>
                <th>Problème</th>
                <th>Transporteur</th>
                <th>Urgence</th>
                <th>Statut</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center">Chargement…</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-muted">Aucun ticket pour le moment.</td></tr>
              ) : (
                tickets.map((t, i) => (
                  <tr key={t.ID_Ticket || i}>
                    <td>{t.Societe}</td>
                    <td>{t.Utilisateur}</td>
                    <td>{t.Date_Ouverture}</td>
                    <td>{t.Numero_Commande}</td>
                    <td>{t.Problematique}</td>
                    <td>{t.Transporteur}</td>
                    <td>{t.Urgence}</td>
                    <td>
                      <Badge bg={t.Statut === "Ouvert" ? "primary" : t.Statut === "Résolu" ? "success" : "warning"}>
                        {t.Statut}
                      </Badge>
                    </td>
                    <td style={{ maxWidth: 220 }}>{t.Description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
