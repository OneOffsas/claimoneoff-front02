import Link from "next/link";
import { useState } from "react";

export default function Tickets() {
  const [tickets, setTickets] = useState([
    { id: 1, sujet: "Problème livraison", statut: "Ouvert", date: "2025-06-15" },
    { id: 2, sujet: "Erreur de préparation", statut: "En cours", date: "2025-06-14" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-500 to-violet-600 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-violet-700">Mes tickets</h1>
          <Link href="/createticket" className="bg-violet-600 text-white px-4 py-2 rounded shadow hover:bg-violet-800">Créer un ticket</Link>
        </div>
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-violet-700">
              <th>ID</th>
              <th>Sujet</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Détail</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-violet-50 transition rounded-lg">
                <td>{t.id}</td>
                <td>{t.sujet}</td>
                <td>
                  <span className={
                    t.statut === "Ouvert"
                      ? "bg-green-100 text-green-700 px-2 py-1 rounded"
                      : "bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                  }>{t.statut}</span>
                </td>
                <td>{t.date}</td>
                <td>
                  <Link href={`/tickets/${t.id}`} className="text-violet-700 underline hover:text-violet-900">Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

