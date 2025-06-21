import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TicketsDashboard from "../components/TicketsDashboard";
import StatsDashboard from "../components/StatsDashboard";
import AdminTickets from "../components/AdminTickets";
import Profile from "../components/Profile";

export default function DashboardPage() {
  // Suppose qu’après login, tu as sauvegardé user dans localStorage
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const u = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
    if (u.email) setUser(u);
    else window.location.href = "/login";
  }, []);

  if (!user) return <div>Chargement…</div>;

  return (
    <Layout user={user} page={page} setPage={setPage}>
      {page === "dashboard" && <StatsDashboard user={user} />}
      {page === "tickets" && <TicketsDashboard user={user} />}
      {page === "admin" && user.role === "Admin" && <AdminTickets user={user} />}
      {page === "stats" && <StatsDashboard user={user} />}
      {page === "profile" && <Profile user={user} />}
    </Layout>
  );
}
