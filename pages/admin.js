import { useState, useEffect } from "react";

// Si tu utilises Bootstrap, pense à l'import dans _app.js : import 'bootstrap/dist/css/bootstrap.min.css';
// Si tu veux le menu latéral, tu peux créer un composant Sidebar ou le faire plus tard.

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, urgents: 0, ouverts: 0, fermes: 0 });
  const [loading, setLoading] = useState(true);

  // Sécurité : redirige si pas admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("claimUser"));
    if (!user || user.role !== "Admin") {
      window.location.href = "/login";
      return;
    }
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getTickets", email: "", role: "Admin" })
    })
      .then((r) => r.json())
      .then((data) => {
        const tickets = data.tickets || [];
        setTickets(tickets);
        setStats({
          total: tickets.length,
          urgents: tickets.filter(t => t.urgence === "Oui").length,
          ouverts: tickets.filter(t => t.statut === "En cours").length,
          fermes: tickets.filter(t => t.statut === "Fermé").length,
        });
        setLoading(false);
      });
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Menu latéral (à customiser si besoin) */}
      <div className="bg-dark text-white d-flex flex-column p-4" style={{ width: 220, minHeight: "100vh" }}>
        <div className="mb-5 text-center">
          <img src="/logo.png" style={{ width: 60, borderRadius: 12 }} alt="Logo" />
          <h3 className="mt-3 mb-0">ClaimOneOff</h3>
        </div>
        <ul className="nav nav-pills flex-column gap-2">
          <li><a className="nav-link active" href="/admin">Dashboard</a></li>
          <li><a className="nav-link text-white" href="/admin-tickets">Tickets</a></li>
          <li><a className="nav-link text-white" href="/admin-users">Utilisateurs</a></li>
          <li><a className="nav-link text-white" href="#" onClick={() => {localStorage.removeItem("claimUser"); window.location.href = "/login"}}>Déconnexion</a></li>
        </ul>
      </div>
      {/* Contenu principal */}
      <div className="container-fluid p-5" style={{ background: "linear-gradient(120deg,#f8fafc,#f1f5ff 50%,#e6e1ff)" }}>
        <h1 className="fw-bold mb-4 text-primary">Admin Dashboard</h1>
        <div className="row mb-5">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow text-center p-4" style={{ borderRadius: 18 }}>
              <div className="fw-bold text-primary" style={{ fontSize: 20 }}>Tickets Total</div>
              <div className="display-5">{stats.total}</div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow text-center p-4" style={{ borderRadius: 18 }}>
              <div className="fw-bold text-danger" style={{ fontSize: 20 }}>Urgents</div>
              <div className="display-5">{stats.urgents}</div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow text-center p-4" style={{ borderRadius: 18 }}>
              <div className="fw-bold text-warning" style={{ fontSize: 20 }}>En cours</div>
              <div className="display-5">{stats.ouverts}</div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow text-center p-4" style={{ borderRadius: 18 }}>
              <div className="fw-bold text-success" style={{ fontSize: 20 }}>Fermés</div>
              <div className="display-5">{stats.fermes}</div>
            </div>
          </div>
        </div>
        <h4 className="mb-4">Tous les tickets</h4>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle rounded shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Société</th>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Problème</th>
                  <th>Date</th>
                  <th>Urgence</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id_ticket}>
                    <td>{t.id_ticket}</td>
                    <td>{t.societe}</td>
                    <td>{t.utilisateur}</td>
                    <td>{t.email}</td>
                    <td>{t.problematique}</td>
                    <td>{t.date_ouverture}</td>
                    <td>
                      {t.urgence === "Oui" && (
                        <span className="badge bg-danger">Urgent</span>
                      )}
                    </td>
                    <td>
                      <span className={
                        "badge " +
                        (t.statut === "En cours"
                          ? "bg-warning text-dark"
                          : t.statut === "Fermé"
                          ? "bg-success"
                          : "bg-secondary")
                      }>
                        {t.statut}
                      </span>
                    </td>
                    <td>
                      <a href={`/tickets/${t.id_ticket}`} className="btn btn-outline-primary btn-sm rounded-pill">Voir</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
