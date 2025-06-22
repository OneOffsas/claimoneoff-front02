import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();
        setTickets(Array.isArray(data.tickets) ? data.tickets : []);
      } catch (e) {
        setTickets([]);  // Même en cas d’erreur, jamais undefined
      }
      setLoading(false);
    }
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <main className="flex-1 pl-72 pr-10 py-8">
        <h1 className="text-3xl font-bold mb-6">Tous les tickets</h1>
        {loading ? (
          <div>Chargement…</div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            {(tickets.length === 0) ? (
              <div>Aucun ticket trouvé.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sujet</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.ID_Ticket}>
                      <td>{ticket.ID_Ticket}</td>
                      <td>{ticket.Description}</td>
                      <td>{ticket.Statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
