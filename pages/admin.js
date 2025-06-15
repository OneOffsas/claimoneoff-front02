import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({total: 0, ouverts: 0, urgents: 0});
  const [loading, setLoading] = useState(true);

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
      .then(data => {
        setTickets(data.tickets || []);
        setStats({
          total: (data.tickets||[]).length,
          ouverts: (data.tickets||[]).filter(t => t.statut==="En cours").length,
          urgents: (data.tickets||[]).filter(t => t.urgence==="Oui").length
        });
        setLoading(false);
      });
    }
  }, []);

  if (!user) return <div>Connexion requise.</div>;

  return (
    <div className="d-flex" style={{minHeight:"100vh"}}>
      <Sidebar role={user.role} active="dashboard"/>
      <div className="container-fluid p-5" style={{background:"linear-gradient(120deg,#f4f7ff,#dbeafe 50%,#e6e1ff)"}}>
        <h2 className="fw-bold mb-4">Bienvenue, {user.prenom} 👋</h2>
        <div className="row mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow text-center p-4 mb-3" style={{borderRadius:18}}>
              <div className="fw-bold text-primary" style={{fontSize:22}}>Tickets total</div>
              <div className="display-5">{stats.total}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow text-center p-4 mb-3" style={{borderRadius:18}}>
              <div className="fw-bold text-success" style={{fontSize:22}}>Ouverts</div>
              <div className="display-5">{stats.ouverts}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow text-center p-4 mb-3" style={{borderRadius:18}}>
              <div className="fw-bold text-danger" style={{fontSize:22}}>Urgences</div>
              <div className="display-5">{stats.urgents}</div>
            </div>
          </div>
        </div>
        <h4 className="mb-3">Derniers tickets</h4>
        {loading ? <div>Chargement...</div> : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle rounded shadow-sm">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Problématique</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Urgence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.slice(0,5).map(t => (
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
                    <a href={`/tickets/${t.id_ticket}`} className="btn btn-sm btn-outline-primary">Voir</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>)}
        <div className="mt-4">
          <a href="/tickets" className="btn btn-primary rounded-pill">Voir tous mes tickets</a>
          <a href="/createticket" className="btn btn-outline-success ms-3 rounded-pill">Nouveau ticket</a>
        </div>
      </div>
    </div>
  );
}
