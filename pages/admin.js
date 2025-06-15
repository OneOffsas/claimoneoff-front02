import { useState, useEffect } from "react";
import { FaChartPie, FaListAlt, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const COLORS = ["#6C47FF", "#FF5A5F", "#1C75BC", "#22c55e"];

const fakeStats = [
  { name: "Nouveaux", value: 8 },
  { name: "Urgents", value: 3 },
  { name: "Ouverts", value: 4 },
  { name: "Résolus", value: 2 },
];

const fakeTickets = [
  {
    id: "TCKT1",
    urgence: "Oui",
    commande: "1201",
    probleme: "RETARD",
    transporteur: "Colissimo",
    description: "Client non livré",
    statut: "Nouveau",
    date: "2025-06-14 09:12",
    societe: "LaBoîteA",
    user: "Alexandre",
  },
  // Ajoute d'autres tickets ici…
];

export default function AdminDashboard() {
  const [menu, setMenu] = useState("dashboard");

  // Ici tu fetches tes vraies stats/tickets via Apps Script !

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-xl flex flex-col justify-between py-8 px-5">
        <div>
          <div className="mb-10 flex items-center">
            <img src="/logo.png" alt="logo" className="w-10 h-10 mr-2" />
            <span className="text-xl font-bold text-violet-700 tracking-tight">ClaimOneOff</span>
          </div>
          <nav className="flex flex-col gap-2">
            <SidebarBtn icon={<FaChartPie />} label="Dashboard" active={menu === "dashboard"} onClick={() => setMenu("dashboard")} />
            <SidebarBtn icon={<FaListAlt />} label="Tickets" active={menu === "tickets"} onClick={() => setMenu("tickets")} />
            <SidebarBtn icon={<FaUsers />} label="Clients" active={menu === "clients"} onClick={() => setMenu("clients")} />
          </nav>
        </div>
        <button className="flex items-center gap-2 text-violet-700 font-semibold px-3 py-2 rounded-md bg-violet-50 hover:bg-violet-100 transition">
          <FaSignOutAlt />
          Déconnexion
        </button>
      </aside>
      {/* Main */}
      <main className="flex-1 p-10">
        {menu === "dashboard" && <DashboardSection />}
        {menu === "tickets" && <TicketsSection />}
        {menu === "clients" && <ClientsSection />}
      </main>
    </div>
  );
}

function SidebarBtn({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition font-medium text-lg ${
        active ? "bg-violet-100 text-violet-700" : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// Dashboard principal avec graphique
function DashboardSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Tableau de bord</h2>
      <div className="flex gap-8 mb-10">
        <ResponsiveContainer width="30%" height={160}>
          <PieChart>
            <Pie data={fakeStats} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60}>
              {fakeStats.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-3 justify-center">
          {fakeStats.map((s, idx) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }}></span>
              <span className="font-semibold text-gray-700">{s.name} :</span>
              <span className="font-bold text-xl">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Ici tu ajoutes d’autres graphiques ou stats ! */}
    </div>
  );
}

// Tickets : tableau dynamique
function TicketsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Tous les tickets</h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2">ID</th>
              <th>Urgence</th>
              <th>Commande</th>
              <th>Problème</th>
              <th>Transporteur</th>
              <th>Description</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Client</th>
              <th>Utilisateur</th>
            </tr>
          </thead>
          <tbody>
            {fakeTickets.map((t, idx) => (
              <tr key={t.id} className={idx % 2 ? "bg-gray-50" : ""}>
                <td className="px-3 py-2">{t.id}</td>
                <td>{t.urgence === "Oui" ? <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-semibold">Urgent</span> : ""}</td>
                <td>{t.commande}</td>
                <td>{t.probleme}</td>
                <td>{t.transporteur}</td>
                <td>{t.description}</td>
                <td>
                  <span className="px-2 py-1 rounded bg-violet-500 text-white font-bold">{t.statut}</span>
                </td>
                <td>{t.date}</td>
                <td>{t.societe}</td>
                <td>{t.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Clients : bientôt
function ClientsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestion des clients</h2>
      <p>À venir : visualisation, gestion utilisateurs/clients, stats par client, etc.</p>
    </div>
  );
}

