// /components/Layout.js
import { FaTachometerAlt, FaTicketAlt, FaChartBar, FaUsers, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useState } from "react";

export default function Layout({ user, children }) {
  const [page, setPage] = useState("dashboard");
  const isAdmin = user.role === "Admin";
  const menu = [
    { key: "dashboard", label: "Tableau de bord", icon: <FaTachometerAlt /> },
    { key: "tickets", label: "Tickets", icon: <FaTicketAlt /> },
    { key: "stats", label: "Statistiques", icon: <FaChartBar /> },
    ...(isAdmin ? [{ key: "users", label: "Utilisateurs", icon: <FaUsers /> }] : []),
    { key: "profile", label: "Mon Profil", icon: <FaUser /> },
    { key: "logout", label: "Déconnexion", icon: <FaSignOutAlt /> }
  ];
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f4f7fb,#cfd9ff 80%)" }}>
      <aside className="sidebar shadow" style={{ width: 250, background: "#fff" }}>
        <div className="sidebar-logo py-4 px-3 text-center" style={{ fontWeight: 900, fontSize: 28, color: "#6441a5" }}>
          <span style={{ color: "#2b43c7" }}>Claim</span>OneOff
        </div>
        <nav className="nav flex-column mt-3">
          {menu.map(m => (
            <button
              key={m.key}
              className={`nav-link py-3 px-4 ${page === m.key ? "active" : ""}`}
              style={{ fontWeight: 600, fontSize: 18, color: "#444", background: "none", border: "none" }}
              onClick={() => {
                if (m.key === "logout") {
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                } else {
                  setPage(m.key);
                }
              }}
            >
              <span className="me-2">{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-grow-1 px-4 py-3">
        {children(page)}
      </main>
    </div>
  );
}

