import { useState, useEffect } from "react";
import TicketDetail from "./TicketDetail";
import { toast } from "react-toastify";

export default function TicketsTable() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/admin/tickets")
      .then(r => r.json())
      .then(data => setTickets(data.tickets || []))
      .catch(() => toast.error("Erreur chargement tickets"));
  }, []);

  if (selected) return <TicketDetail ticket={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-xl">
        <thead>
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Client</th>
            <th className="p-3">Problématique</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, i) => (
            <tr key={t.id_ticket} className="hover:bg-gray-50">
              <td className="p-3">{i+1}</td>
              <td className="p-3">{t.societe}</td>
              <td className="p-3">{t.problematique}</td>
              <td className="p-3">{t.statut}</td>
              <td className="p-3">{t.date_ouverture}</td>
              <td className="p-3">
                <button className="text-blue-600 hover:underline" onClick={() => setSelected(t)}>Voir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
