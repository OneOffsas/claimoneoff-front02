import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  // Simule quelques tickets pour exemple
  const [tickets, setTickets] = useState([
    { id: 1, sujet: "Problème livraison", statut: "Ouvert", date: "2025-06-15" },
    { id: 2, sujet: "Erreur de préparation", statut: "En cours", date: "2025-06-14" },
  ]);

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-violet-600 to-blue-500">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-xl flex flex-col p-6">
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Logo ClaimOneOff" className="w-16 h-16" />
        </div>
        <nav className="flex flex-col gap-4 text-lg">
          <Link href="/dashboard" className="font-semibold text-violet-700 hover:underline">Dashboard</Link>
          <Link href="/tickets" className="hover:text-violet-700">Tous les tickets</Link>
          <Link href="/createticket" className="hover:text-violet-700">Créer un ticket</Link>
        </nav>
        <div className="flex-1" />
        <div className="text-gray-400 text-xs mt-6">© 2025 ClaimOneOff</div>
      </aside>
      {/* Main */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-white mb-6">Vue d&apos;ensemble des tickets</h1>
        <div className="bg-white rounded-xl shadow-xl p-6">
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
          <div className="mt-6 flex gap-4">
            <Link href="/tickets" className="bg-violet-600 text-white px-4 py-2 rounded shadow hover:bg-violet-800">Voir tous les tickets</Link>
            <Link href="/createticket" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-800">Créer un ticket</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

