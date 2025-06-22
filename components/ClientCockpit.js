import { useEffect, useState } from "react";
import TicketsTable from "./TicketsTable";
import StatsCards from "./StatsCards";

export default function ClientCockpit({ user, section }) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchTickets();
  }, []);

  function fetchTickets() {
    fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, role: user.role, societe: user.societe })
    })
      .then(r => r.json())
      .then(res => {
        setTickets(res.tickets || []);
        // Exemples de stats à calculer :
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

  if (section === "dashboard" || section === "stats") {
    return <StatsCards stats={stats} />;
  }
  if (section === "tickets") {
    return <TicketsTable tickets={tickets} isAdmin={false} />;
  }
  if (section === "profile") {
    return (
      <div className="card p-4" style={{maxWidth:500}}>
        <h4>Mon profil</h4>
        <div><b>Nom :</b> {user.nom}</div>
        <div><b>Prénom :</b> {user.prenom}</div>
        <div><b>Email :</b> {user.email}</div>
        <div><b>Société :</b> {user.societe}</div>
      </div>
    );
  }
  return null;
}
