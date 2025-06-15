import { useEffect, useState } from "react";
const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState("");
  const user = typeof window !== "undefined" && JSON.parse(localStorage.getItem("claimUser"));

  useEffect(() => {
    if (!user || user.role !== "Admin") window.location.href = "/login";
    else fetchTickets();
    // eslint-disable-next-line
  }, []);

  async function fetchTickets() {
    setMsg("Chargement...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getTickets", email: user.email, role: user.role }),
      });
      const data = await res.json();
      setTickets(data.tickets || []);
      setMsg("");
    } catch {
      setMsg("Erreur de chargement.");
    }
  }

  // Statistiques
  const totalTickets = tickets.length;
  const ticketsOuverts = tickets.filter(t => t.statut !== "Clos").length;
  const ticketsUrgents = tickets.filter(t => t.urgence && t.urgence.toLowerCase() === "oui").length;

  return (
    <div className="d-flex" style={{minHeight:"100vh",background:"#f4f8fd"}}>
      {/* Sidebar */}
      <div className="sidebar-custom p-4 d-none d-md-flex flex-column" style={{width:240, background:"#322d53", color:"#fff", borderRadius:"0 24px 24px 0"}}>
        <div className="fs-4 mb-5 text-center fw-bold">ClaimOneOff</div>
        <div className="mb-2 menu-item-active p-2 rounded" style={{background:"#6959c7",fontWeight:"bold"}}>Tickets</div>
        <a href="/" className="text-light mt-3 text-decoration-none small">Accueil</a>
        <div className="mt-auto pt-5 text-secondary small">
          {user && user.prenom} {user && user.nom}<br />
          <span className="text-light">{user && user.societe}</span>
        </div>
      </div>
      {/* Main */}
      <div className="flex-grow-1 p-4">
        <div className="d-md-none mb-3">
          <div className="brand fs-5 text-primary">ClaimOneOff</div>
        </div>
        <h2 className="fw-bold mb-2" style={{color:"#322d53"}}>Dashboard admin</h2>
        <div className="row mb-4 g-3">
          <div className="col-12 col-md-4">
            <div className="card text-center shadow border-0" style={{borderRadius:18}}>
              <div className="card-body">
                <div className="fw-bold fs-2 text-primary">{totalTickets}</div>
                <div className="text-muted">Tickets créés</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card text-center shadow border-0" style={{borderRadius:18}}>
              <div className="card-body">
                <div className="fw-bold fs-2 text-warning">{ticketsOuverts}</div>
                <div className="text-muted">Tickets ouverts</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card text-center shadow border-0" style={{borderRadius:18}}>
              <div className="card-body">
                <div className="fw-bold fs-2 text-danger">{ticketsUrgents}</div>
                <div className="text-muted">Tickets urgents</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 rounded-4 shadow-sm mb-2">
          <h4 className="mb-3" style={{color:"#322d53"}}>Tous les tickets</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Société</th>
                  <th>Problème</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Urgence</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id_ticket}>
                    <td className="fw-bold">{t.id_ticket}</td>
                    <td>{t.societe}</td>
                    <td>{t.problematique}</td>
                    <td>{t.date_ouverture}</td>
                    <td>
                      <span className={
                        "badge rounded-pill px-3 py-2 " +
                        (t.statut === "Clos" ? "bg-success" :
                        t.statut === "En cours" ? "bg-warning text-dark" :
                        "bg-secondary")
                      }>
                        {t.statut}
                      </span>
                    </td>
                    <td>
                      {t.urgence && t.urgence.toLowerCase() === "oui" ? (
                        <span className="badge bg-danger rounded-pill px-3 py-2">Urgent</span>
                      ) : <span className="badge bg-light text-dark rounded-pill px-3 py-2">Non</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {msg && <div className="alert alert-danger mt-2">{msg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
