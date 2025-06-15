import { useEffect, useState } from "react";
const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("claimUser"));
    if (!user) window.location.href = "/login";
    else fetchTickets(user);
  }, []);

  async function fetchTickets(user) {
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
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Mes tickets</h2>
      <table className="table table-hover table-bordered bg-white shadow">
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
              <td>{t.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-danger">{msg}</div>
    </div>
  );
}
