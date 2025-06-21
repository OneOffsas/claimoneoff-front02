import { FaTachometerAlt, FaTicketAlt, FaChartBar, FaSignOutAlt, FaUser } from "react-icons/fa";

export default function Layout({ user, page, setPage, children }) {
  // user.role = "Admin" ou "Client"
  const menu = [
    { key: "dashboard", label: "Cockpit", icon: <FaTachometerAlt /> },
    { key: "tickets", label: "Mes Tickets", icon: <FaTicketAlt /> },
    { key: "stats", label: "Statistiques", icon: <FaChartBar /> },
    { key: "profile", label: "Mon Profil", icon: <FaUser /> },
    { key: "logout", label: "Déconnexion", icon: <FaSignOutAlt /> }
  ];
  if (user.role === "Admin") menu.splice(2, 0, { key: "admin", label: "Vue Admin", icon: <FaUser /> });

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f7fb" }}>
      <aside className="bg-white shadow-sm px-0" style={{ width: 220, minHeight: "100vh" }}>
        <div className="text-center py-4 border-bottom" style={{ fontWeight: 900, fontSize: 28, color: "#6441a5", letterSpacing: 1 }}>
          <span style={{ color: "#2b43c7" }}>Claim</span>OneOff
        </div>
        <nav className="nav flex-column mt-4">
          {menu.map(m => (
            <button
              key={m.key}
              className={`nav-link text-start py-3 px-4 ${page === m.key ? "active" : ""}`}
              style={{ fontWeight: 600, fontSize: 18, color: "#444", background: "none", border: "none", outline: "none" }}
              onClick={() => m.key === "logout" ? window.location.href="/login" : setPage(m.key)}
            >
              <span className="me-2">{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-grow-1 px-4 py-3">
        {children}
      </main>
    </div>
  );
}

