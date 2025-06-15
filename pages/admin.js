import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

// 🔗 URL de ton Apps Script (modifie ici si besoin)
const API_URL = "https://script.google.com/macros/s/AKfycbz4oaV2F4-DeHC4-oYaR8wiTgha1ROTXN1WAMQT9H72SPI6b1NCtlClxZ8WwR0f6rZ9lg/exec";

// Couleurs pour les stats
const COLORS = ["#6366F1", "#0EA5E9", "#A21CAF", "#FBBF24", "#16A34A", "#EF4444"];

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [menuOpen, setMenuOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    enCours: 0,
    cloture: 0,
    urgent: 0,
    parTransporteur: {},
    parProblematique: {},
  });

  // 🟢 Fetch tickets au load
  useEffect(() => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getTickets", email: "", role: "Admin" }),
    })
      .then((r) => r.json())
      .then((data) => {
        setTickets(data.tickets || []);
        setLoading(false);
        // Statistiques
        const statsTmp = {
          total: 0, enCours: 0, cloture: 0, urgent: 0, parTransporteur: {}, parProblematique: {},
        };
        data.tickets.forEach((t) => {
          statsTmp.total++;
          if ((t.statut || "").toLowerCase().includes("clos")) statsTmp.cloture++;
          else statsTmp.enCours++;
          if ((t.urgence || "").toLowerCase() === "oui") statsTmp.urgent++;
          statsTmp.parTransporteur[t.transporteur] = (statsTmp.parTransporteur[t.transporteur] || 0) + 1;
          statsTmp.parProblematique[t.problematique] = (statsTmp.parProblematique[t.problematique] || 0) + 1;
        });
        setStats(statsTmp);
      });
  }, []);

  // Side menu animation
  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  // Filtres avancés
  const ticketsFiltres = tickets.filter(
    t => statutFilter === "Tous" || (t.statut || "").toLowerCase().includes(statutFilter.toLowerCase())
  );

  // Liste des statuts distincts
  const allStatuts = [...new Set(tickets.map(t => t.statut || "En cours"))];

  // Graphes
  const pieData = [
    { name: "En cours", value: stats.enCours },
    { name: "Clôturés", value: stats.cloture },
    { name: "Urgents", value: stats.urgent }
  ];

  const barDataTransporteur = Object.keys(stats.parTransporteur).map(tr => ({
    name: tr,
    Tickets: stats.parTransporteur[tr],
  }));

  const barDataProblematique = Object.keys(stats.parProblematique).map(pb => ({
    name: pb,
    Tickets: stats.parProblematique[pb],
  }));

  // Formatage date
  function formatDate(dateStr) {
    if (!dateStr) return "-";
    if (dateStr.includes("-")) return dateStr.replace("T", " ").split(".")[0];
    return dateStr;
  }

  return (
    <div className="flex h-screen bg-gradient-to-tr from-violet-700 to-blue-500 font-sans">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-20 transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex flex-col items-center py-10">
          <img src="/logo.png" alt="ClaimOneOff" className="w-24 mb-3" />
          <h2 className="text-xl font-bold text-violet-700 mb-6 tracking-tight">Admin ClaimOneOff</h2>
          <button onClick={toggleMenu} className="md:hidden text-violet-700 mb-6">Fermer</button>
          <nav className="flex flex-col gap-4 w-full px-4">
            <button className="text-left py-2 px-4 rounded hover:bg-violet-100 text-violet-700 font-semibold">Tickets</button>
            <button className="text-left py-2 px-4 rounded hover:bg-violet-100 text-violet-700 font-semibold">Statistiques</button>
            <button className="text-left py-2 px-4 rounded hover:bg-violet-100 text-violet-700 font-semibold">Exports</button>
          </nav>
        </div>
      </div>
      {/* Overlay mobile */}
      {menuOpen && <div className="fixed inset-0 bg-black opacity-30 z-10 md:hidden" onClick={toggleMenu} />}
      {/* Main */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        {/* Topbar */}
        <div className="flex items-center justify-between bg-white py-4 px-8 shadow-md">
          <button className="md:hidden text-violet-700" onClick={toggleMenu}>☰ Menu</button>
          <div className="font-bold text-violet-700 text-lg">Gestion des tickets - Admin</div>
          <div className="text-gray-400 text-sm">Bienvenue 👋</div>
        </div>
        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
          {/* Stats Graphiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center">
              <h3 className="font-semibold text-violet-700 mb-2">Répartition Tickets</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                    {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="font-semibold text-violet-700 mb-2">Par Transporteur</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={barDataTransporteur}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Tickets" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="font-semibold text-violet-700 mb-2">Par Problématique</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={barDataProblematique}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Tickets" fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <label className="font-semibold">Filtrer par statut:</label>
            <select className="border rounded p-2" value={statutFilter} onChange={e => setStatutFilter(e.target.value)}>
              <option value="Tous">Tous</option>
              {allStatuts.map(st => <option key={st}>{st}</option>)}
            </select>
            <span className="ml-6 text-gray-500">Total : <b>{tickets.length}</b></span>
            <span className="ml-2 text-violet-700 font-semibold">Urgents : {stats.urgent}</span>
          </div>
          {/* Tableau */}
          <div className="overflow-x-auto shadow rounded-2xl">
            <table className="min-w-full bg-white rounded-2xl">
              <thead>
                <tr className="bg-violet-700 text-white">
                  <th className="p-2">ID</th>
                  <th className="p-2">Société</th>
                  <th className="p-2">Utilisateur</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Statut</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Urgence</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center p-8">Chargement…</td></tr>
                ) : ticketsFiltres.length === 0 ? (
                  <tr><td colSpan={8} className="text-center p-8 text-gray-500">Aucun ticket</td></tr>
                ) : (
                  ticketsFiltres.map(t => (
                    <tr key={t.id_ticket} className="hover:bg-violet-50 transition cursor-pointer" onClick={() => setSelectedTicket(t)}>
                      <td className="p-2">{t.id_ticket}</td>
                      <td className="p-2">{t.societe}</td>
                      <td className="p-2">{t.utilisateur}</td>
                      <td className="p-2">{t.email}</td>
                      <td className="p-2">{t.statut}</td>
                      <td className="p-2">{formatDate(t.date_ouverture)}</td>
                      <td className="p-2">{t.urgence === "Oui" ? <span className="text-red-500 font-bold">Oui</span> : "Non"}</td>
                      <td className="p-2"><button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Voir</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Affichage détail ticket */}
          {selectedTicket && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative animate-fade-in">
                <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-violet-600" onClick={() => setSelectedTicket(null)}>×</button>
                <h3 className="text-2xl font-bold mb-4 text-violet-700">Détail du ticket</h3>
                <div className="mb-2"><b>ID :</b> {selectedTicket.id_ticket}</div>
                <div className="mb-2"><b>Statut :</b> {selectedTicket.statut}</div>
                <div className="mb-2"><b>Société :</b> {selectedTicket.societe}</div>
                <div className="mb-2"><b>Utilisateur :</b> {selectedTicket.utilisateur}</div>
                <div className="mb-2"><b>Email :</b> {selectedTicket.email}</div>
                <div className="mb-2"><b>Problématique :</b> {selectedTicket.problematique}</div>
                <div className="mb-2"><b>Transporteur :</b> {selectedTicket.transporteur}</div>
                <div className="mb-2"><b>Date :</b> {formatDate(selectedTicket.date_ouverture)}</div>
                <div className="mb-2"><b>Description :</b> {selectedTicket.description}</div>
                {selectedTicket.fichiers_joints && (
                  <div className="mb-2"><b>Fichier :</b> <a href={selectedTicket.fichiers_joints} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">Voir</a></div>
                )}
                {/* Discussion */}
                <div className="mb-2"><b>Discussion :</b>
                  <pre className="bg-gray-100 rounded p-2 mt-2 max-h-40 overflow-y-auto text-xs">{selectedTicket.discussion || "Aucune discussion"}</pre>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setSelectedTicket(null)}>Fermer</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


