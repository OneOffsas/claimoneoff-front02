import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        // 🔄 Adapte l’URL à ton API backend/Google Apps Script (Cloudflare Worker ou autre)
        const res = await fetch("/api/tickets");
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (e) {
        toast.error("Erreur de chargement des tickets !");
      }
      setLoading(false);
    }
    fetchTickets();
  }, []);

  // KPIs dynamiques
  const ouverts = tickets.filter(t => t.Statut === "Ouvert").length;
  const resolus = tickets.filter(t => t.Statut === "Résolu").length;
  const moyenneResolution = (function() {
    // 👇 Logique basique, à ajuster avec tes vraies données
    return tickets.length ? "2h42" : "-";
  })();

  // Préparation du dataset pour le graphique
  const statusData = [
    { name: "Ouverts", value: ouverts },
    { name: "Résolus", value: resolus },
    { name: "En cours", value: tickets.filter(t => t.Statut === "En cours").length }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <main className="flex-1 pl-72 pr-10 py-8">
        <h1 className="text-4xl font-extrabold mb-4">Bienvenue, Admin 👋</h1>
        <p className="text-lg text-gray-600 mb-6">Voici un aperçu global de votre activité de support.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <KpiCard label="Tickets ouverts" value={ouverts} color="violet" />
          <KpiCard label="Tickets résolus" value={resolus} color="green" />
          <KpiCard label="Temps moyen résolution" value={moyenneResolution} color="blue" />
        </div>

        <div className="rounded-2xl shadow bg-white p-8">
          <h2 className="text-2xl font-bold mb-4">Répartition des tickets par statut</h2>
          {loading ? (
            <div className="py-10 text-center text-lg">Chargement du graphique…</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </main>
    </div>
  );
}

function KpiCard({ label, value, color }) {
  const colorMap = {
    violet: "text-violet-700",
    green: "text-green-600",
    blue: "text-blue-600"
  };
  return (
    <div className="rounded-2xl shadow p-6 bg-white flex flex-col items-start">
      <span className="text-lg font-medium text-gray-500">{label}</span>
      <span className={`text-3xl font-bold ${colorMap[color]}`}>{value}</span>
    </div>
  );
}
