import { useState, useEffect } from "react";
import { apiCall } from "../utils/api";

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Pour la démo, on simule que l'admin s'est bien connecté
    apiCall("getTickets", { email: "", role: "Admin" })
      .then(res => {
        if (res.status === "success") setTickets(res.tickets);
        else setMsg(res.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-700 to-violet-700 p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">Admin — Tous les Tickets</h1>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-100 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold">{tickets.length}</div>
            <div className="text-gray-700">Tickets au total</div>
          </div>
          <div className="bg-violet-100 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold">{tickets.filter(t => t.statut === "En cours").length}</div>
            <div className="text-gray-700">Tickets en cours</div>
          </div>
        </div>
        {msg && <div className="mb-4 text-center text-red-600">{msg}</div>}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-700">
              <th className="p-2">N°</th>
              <th className="p-2">Date</th>
              <th className="p-2">Client</th>
              <th className="p-2">Problème</th>
              <th className="p-2">Transporteur</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Discussion</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={t.id_ticket} className="border-t hover:bg-blue-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{t.date_ouverture}</td>
                <td className="p-2">{t.utilisateur}</td>
                <td className="p-2">{t.problematique}</td>
                <td className="p-2">{t.transporteur}</td>
                <td className="p-2">{t.statut}</td>
                <td className="p-2 whitespace-pre-wrap">{t.discussion?.slice(-50)}</td>
              </tr>
            ))}
            {tickets.length === 0 && <tr><td colSpan={7} className="text-center text-gray-400 py-4">Aucun ticket pour le moment</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

