import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Tickets() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("claimUser"));
    setUser(userLocal);
    if (userLocal) {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({action: "getTickets", email: userLocal.email, role: userLocal.role})
      })
      .then(r => r.json())
      .then(data => setTickets(data.tickets||[]));
    }
  }, []);

  if (!user) return <div>Connexion requise.</div>;

  return (
    <div className="d-flex" style={{minHeight:"100vh"}}>
      <Sidebar role={user.role} active="tickets"/>
      <div className="container-fluid py-5" style={{background:"#eef3fa"}}>
        <h2 className="fw-bold mb-4">Mes Tickets</h2>
        <div className="mb-3 text-end">
          <a href="/createticket" className="btn btn-primary rounded-pill">Nouveau ticket</a>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered align-middle bg-white rounded shadow-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Problématique</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Urgence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id_ticket}>
                  <td>{t.id_ticket}</td>
                  <td>{t.problematique}</td>
                  <td>{t.date_ouverture}</td>
                  <td>
                    <span className={"badge "+(t.statut==="En cours"?"bg-warning text-dark":(t.statut==="Fermé"?"bg-success":"bg-secondary"))}>{t.statut}</span>
                  </td>
                  <td>
                    {t.urgence === "Oui" && <span className="badge bg-danger">Urgent</span>}
                  </td>
                  <td>
                    <a href={`/tickets/${t.id_ticket}`} className="btn btn-sm btn-outline-info rounded-pill">Voir</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

