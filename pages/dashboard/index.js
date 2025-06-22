import AdminLayout from "../../components/AdminLayout";
import StatsCards from "../../components/StatsCards";
import TicketsChart from "../../components/TicketsChart";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => toast.error("Erreur de chargement des statistiques"));
  }, []);
  return (
    <AdminLayout current="dashboard">
      <h1 className="text-3xl font-bold mb-8">Dashboard global</h1>
      <StatsCards stats={stats} />
      <TicketsChart stats={stats} />
    </AdminLayout>
  );
}
