import React, { useEffect, useState } from "react";
import StatsCards from "../components/StatsCards";
import AdminCharts from "../components/AdminCharts";
import TicketsTable from "../components/AdminTickets";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, ouvert: 0, resolu: 0 });
  const [byStatut, setByStatut] = useState([]);
  const [byDay, setByDay] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch tickets ici, et calcule les stats
    fetch("/api/getTickets", { method: "POST", body: JSON.stringify({ action: "getTickets", role: "Admin" }) })
      .then(r => r.json())
      .then(data => {
        if (data.tickets) {
          setTickets(data.tickets);
          // Calcul des stats
          setStats({
            total: data.tickets.length,
            ouvert: data.tickets.filter(t => t.Statut === "Ouvert").length,
            resolu: data.tickets.filter(t => t.Statut === "Résolu").length,
          });
          // Pie chart par statut
          const statusMap = {};
          data.tickets.forEach(t => {
            statusMap[t.Statut] = (statusMap[t.Statut] || 0) + 1;
          });
          setByStatut(Object.entries(statusMap).map(([name, value]) => ({ name, value })));
          // Bar chart par jour
          const daysMap = {};
          data.tickets.forEach(t => {
            const d = (t.Date_Ouverture || "").substring(0, 10);
            daysMap[d] = (daysMap[d] || 0) + 1;
          });
          setByDay(Object.entries(daysMap).map(([date, Tickets]) => ({ date, Tickets })));
        }
      });
  }, []);

  return (
    <div className="container">
      <h2 className="mt-5 mb-4 text-center">Tableau de bord Admin</h2>
      <StatsCards stats={stats} />
      <AdminCharts byStatut={byStatut} byDay={byDay} />
      <TicketsTable tickets={tickets} />
    </div>
  );
}

