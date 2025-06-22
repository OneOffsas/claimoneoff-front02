import { useEffect, useState } from "react";
import TicketsTable from "./TicketsTable";
import StatsCards from "./StatsCards";
import { CSVLink } from "react-csv";

export default function AdminCockpit({ user, section }) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => { fetchTickets(); }, []);

  function fetchTickets() {
    fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, role: user.role, societe: user.societe })
    })
      .then(r => r.json())
      .then(res => {
        setTickets(res.tickets || []);
        // Idem stats à calculer côté admin
        setStats({
          total: (res.tickets || []).length,
          ouverts: (res.tickets || []).filter(t => (t.Statut || t.statut) === "Ouvert").length,
          resolus: (res.tickets || []).filter(t => (t.Statut || t.statut) === "Résolu").length,
          enCours: (res.tickets || []).filter(t => (t.Statut || t.statut) === "En cours").length,
          parTransporteur: [
            ...(res.tickets || []).reduce((acc, t) => {
              const key = t.Transporteur || t.transporteur || "Autre";
              acc[key] = (acc[key] || 0) + 1;
              return acc;
            }, {})
          ].map(([name, value]) => ({ name, value }))
        });
      });
  }

  // Export CSV handler
  function handleExport() {
    // handled by react-csv's CSVLink below
  }

  if (section === "dashboard" || section === "stats") {
    return <StatsCards stats={stats} />;
  }
  if (section === "tickets") {
    return (
      <>
        <CSVLink data={tickets} filename="tickets.csv" className="btn btn-success mb-2">Exporter CSV</CSVLink>
        <TicketsTable tickets={tickets} isAdmin={true} />
      </>
    );
  }
  if (section === "users") {
    return (
      <div className="card p-4">
        <h4>Gestion des utilisateurs</h4>
        <p>Module à venir...</p>
      </div>
    );
  }
  if (section === "profile") {
    return (
      <div className="card p-4" style={{maxWidth:500}}>
        <h4>Mon profil (admin)</h4>
        <div><b>Nom :</b> {user.nom}</div>
        <div><b>Prénom :</b> {user.prenom}</div>
        <div><b>Email :</b> {user.email}</div>
        <div><b>Société :</b> {user.societe}</div>
        <div><b>Rôle :</b> {user.role}</div>
      </div>
    );
  }
  return null;
}
