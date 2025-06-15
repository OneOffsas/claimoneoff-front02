import { useEffect, useState } from "react";
import { apiCall } from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const menuItems = [
  { label: "Tickets", icon: "📋", key: "tickets" },
  { label: "Statistiques", icon: "📊", key: "stats" },
  { label: "Export CSV", icon: "⬇️", key: "export" }
];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("tickets");
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Récupérer l'utilisateur depuis le localStorage
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u || u.role !== "Admin") window.location = "/login";
    setUser(u);

    // Charger tous les tickets
    apiCall("getTickets", { email: u.email, role: u.role }).then((res) => {
      if (res.status === "success") {
        setTickets(res.tickets);
        setStats({
          total: res.tickets.length,
          enCours: res.tickets.filter(t => t.statut === "En cours").length,
          traite: res.tickets.filter(t => t.statut === "Traité").length,
          rembourse: res.tickets.filter(t => t.statut === "Remboursé").length,
          attente: res.tickets.filter(t => t.statut === "En attente").length,
        });
      } else {
        setMsg("Erreur lors du chargement des tickets.");
      }
    });
  }, []);

  function exportCSV() {
    if (!tickets.length) return;
    const rows = [
      Object.keys(tickets[0] || {}),
      ...tickets.map(t => Object.values(t))
    ];
    const csv = rows.map(row => row.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tickets.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-violet-700 to-blue-600">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-2xl rounded-tr-3xl rounded-br-3xl flex flex-col p-6 justify-between min-h-full animate-fade-in">
        <div>
          <div className="flex flex-col items-center mb-10">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-2" />
            <div className="font-extrabold text-xl text-violet-800 mb-2">ClaimOneOff</div>
            <div className="text-gray-500">Admin</div>
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition ${view === item.key ? "bg-gradient-to-r from-violet-700 to-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}
                  onClick={() => setView(item.key)}
                >
                  <span className="text-2xl">{item.icon}</span> {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-gray-400 mt-12">v1.0 – {user && user.nom}</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Tickets */}
        {view === "tickets" && (
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-8">📋 Tous les tickets</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-xl">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-3">ID</th>
                    <th>Société</th>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Statut</th>
                    <th>Problème</th>
                    <th>Urgence</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, idx) => (
                    <tr key={t.id_ticket} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2">{t.id_ticket}</td>
                      <td>{t.societe}</td>
                      <td>{t.utilisateur}</td>
                      <td>{t.email}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          t.statut === "En cours" ? "bg-yellow-100 text-yellow-800" :
                          t.statut === "Traité" ? "bg-green-100 text-green-800" :
                          t.statut === "Remboursé" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-200 text-gray-600"
                        }`}>{t.statut}</span>
                      </td>
                      <td>{t.problematique}</td>
                      <td>{t.urgence}</td>
                      <td>{t.date_ouverture}</td>
                      <td>
                        {/* Tu peux ajouter un bouton ici pour afficher le détail ou gérer le statut */}
                        <button className="text-blue-600 font-bold hover:underline">Détail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tickets.length === 0 && (
                <div className="text-center text-gray-500 p-8">Aucun ticket pour le moment.</div>
              )}
            </div>
          </div>
        )}

        {/* Statistiques */}
        {view === "stats" && (
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-8">📊 Statistiques & KPIs</h1>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
                <span className="text-xl font-bold text-violet-700">{stats.total}</span>
                <span className="text-gray-600">Total tickets</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
                <span className="text-xl font-bold text-yellow-700">{stats.enCours}</span>
                <span className="text-gray-600">En cours</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
                <span className="text-xl font-bold text-green-700">{stats.traite}</span>
                <span className="text-gray-600">Traités</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
                <span className="text-xl font-bold text-blue-700">{stats.rembourse}</span>
                <span className="text-gray-600">Remboursés</span>
              </div>
            </div>
            {/* Graphique animé */}
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={[
                  { name: "En cours", value: stats.enCours || 0 },
                  { name: "Traités", value: stats.traite || 0 },
                  { name: "Remboursés", value: stats.rembourse || 0 },
                  { name: "En attente", value: stats.attente || 0 },
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Export */}
        {view === "export" && (
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-8">⬇️ Export Tickets</h1>
            <button
              onClick={exportCSV}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-700 text-white rounded-xl font-bold shadow-lg hover:scale-105 hover:bg-violet-800 transition"
            >
              Télécharger tous les tickets au format CSV
            </button>
            <div className="text-gray-400 mt-8">Cliquez pour exporter tous les tickets.</div>
          </div>
        )}
        <div className="mt-10 text-center text-red-600">{msg}</div>
      </div>
    </div>
  );
}

