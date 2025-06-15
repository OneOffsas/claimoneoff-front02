import { useEffect, useState } from "react";
const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState("");
  const user = typeof window !== "undefined" && JSON.parse(localStorage.getItem("claimUser"));

  useEffect(() => {
    if (!user) window.location.href = "/login";
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

  return (
    <div className="d-flex" style={{minHeight:"100vh",background:"#f9faff"}}>
      <div className="sidebar-custom p-4 d-none d-md-flex flex-column" style={{width:220}}>
        <div className="brand fs-4 mb-4 text-center">ClaimOneOff</div>
        <div className="mb-2 menu-item-active p-2 fw-bold">Mes tickets</div>
        <a href="/createticket" className="btn btn-outline-primary mb-3 rounded-pill">+ Nouveau ticket</a>
        <div className="mt-auto text-muted small">
          {user && user.prenom} {user && user.nom}<br />
          <span className="text-secondary">{user && user.societe}</span>
        </div>
      </div>
      <div className="flex-grow-1 p-4">
        <div className="d-md-none mb-3">
          <div className="brand fs-5">ClaimOneOff</div>
        </div>
        <h2 className="fw-bold mb-4">Mes tickets</h2>
        <table className="table table-hover table-bordered bg-white shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Problème</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id_ticket}>
                <td>{t.id_ticket}</td>
                <td>{t.date_ouverture}</td>
                <td>{t.problematique}</td>
                <td>
                  <span className={
                    "badge " + 
                    (t.statut === "Clos" ? "bg-success" :
                    t.statut === "En cours" ? "bg-warning text-dark" :
                    "bg-secondary")
                  }>
                    {t.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {msg && <div className="alert alert-danger mt-2">{msg}</div>}
      </div>
    </div>
  );
}
