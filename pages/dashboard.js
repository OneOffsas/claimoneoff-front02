import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ClientCockpit from "../components/ClientCockpit";
import AdminCockpit from "../components/AdminCockpit";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState("dashboard");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (!u) window.location.href = "/login";
    setUser(u);
  }, []);

  if (!user) return null;

  function handleSelect(key) {
    if (key === "logout") {
      localStorage.clear();
      window.location.href = "/login";
    } else {
      setSelected(key);
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar user={user} onSelect={handleSelect} selected={selected} />
      <div style={{ flex: 1, background: "#f4f5fb" }}>
        <div style={{ padding: 32 }}>
          {user.role === "Admin" ? (
            <AdminCockpit user={user} section={selected} />
          ) : (
            <ClientCockpit user={user} section={selected} />
          )}
        </div>
      </div>
    </div>
  );
}
