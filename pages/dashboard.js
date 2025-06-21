import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AdminCockpit from "../components/AdminCockpit";
import ClientCockpit from "../components/ClientCockpit";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.email) setUser(u);
      else window.location.href = "/login";
    }
  }, []);

  if (!user) return <div>Chargement…</div>;

  return (
    <Layout user={user}>
      {(page) => user.role === "Admin"
        ? <AdminCockpit user={user} page={page} />
        : <ClientCockpit user={user} page={page} />}
    </Layout>
  );
}
