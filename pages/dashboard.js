import { useState, useEffect } from "react";
import { apiCall } from "../utils/api";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [email, setEmail] = useState(""); // À récupérer depuis le login (stockage localStorage, à améliorer plus tard)
  const [msg, setMsg] = useState("");

  // Simule une authentification (à améliorer avec un vrai système de session)
  useEffect(() => {
    const userEmail = window.localStorage.getItem("userEmail");
    setEmail(userEmail || "");
    if (userEmail) {
      apiCall("getTickets", { email: userEmail, role: "Client" })
        .then(res => {
          if (res.status === "success") setTickets(res.tickets);
          else setMsg(res.message);
        });
    } else {
      setMsg("Veuillez vous connecter.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-violet-600 to-blue-500 p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-violet-800 text-center">Mes Tickets</h1>
        {msg && <div className="mb-4 text-center text-red-600">{msg}</div>}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-violet-100 text-violet-700">
              <th className="p-2">N°</th>
              <th className="p-2">Date</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Problème</th>
              <th className="p-2">Transporteur</th>
              <th className="p-2">Discussion</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={t.id_ticket} className="border-t hover:bg-violet-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{t.date_ouverture}</td>
                <td className="p-2">{t.statut}</td>
                <td className="p-2">{t.problematique}</td>
                <td className="p-2">{t.transporteur}</td>
                <td className="p-2 whitespace-pre-wrap">{t.discussion?.slice(-50)}</td>
              </tr>
            ))}
            {tickets.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400 py-4">Aucun ticket pour le moment</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
