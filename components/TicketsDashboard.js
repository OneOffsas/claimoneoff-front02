import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";

export default function TicketsDashboard({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getTickets",
        role: user.role,
        societe: user.societe,
        email: user.email
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setTickets(data.tickets || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid">
      <h2 className="mb-4" style={{ fontWeight: 800, color: "#2b43c7" }}>
        Mes Tickets
      </h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center">
              <div style={{ fontSize: 42, fontWeight: 700, color: "#6441a5" }}>{tickets.length}</div>
              <div style={{ fontWeight: 600, color: "#888" }}>Tickets créés</div>
            </div>
          </div>
        </div>
        {/* D’autres stats, widgets, couleurs ? */}
      </div>
      <div className="card shadow border-0">
        <div className="card-header bg-white" style={{ fontWeight: 700 }}>Historique des Tickets</div>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Commande</th>
                <th>Problème</th>
                <th>Transporteur</th>
                <th>Statut</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center">Chargement…</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted">Aucun ticket</td></tr>
              ) : (
                tickets.map((t, i) => (
                  <tr key={t.ID_Ticket || i}>
                    <td>{i+1}</td>
                    <td>{t.Date_Ouverture}</td>
                    <td>{t.Numero_Commande}</td>
                    <td>{t.Problematique}</td>
                    <td>{t.Transporteur}</td>
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

