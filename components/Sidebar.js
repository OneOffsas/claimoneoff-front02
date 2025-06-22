// /components/Sidebar.js
import { FiHome, FiFileText, FiUser, FiBarChart2, FiUsers, FiLogOut } from "react-icons/fi";

export default function Sidebar({ user, onSelect, selected }) {
  // Définition des entrées de menu selon le rôle
  const menu = user?.role === "Admin"
    ? [
        { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
        { key: "tickets", label: "Tickets", icon: <FiFileText /> },
        { key: "users", label: "Utilisateurs", icon: <FiUsers /> },
        { key: "stats", label: "Statistiques", icon: <FiBarChart2 /> },
        { key: "profile", label: "Mon profil", icon: <FiUser /> },
        { key: "logout", label: "Déconnexion", icon: <FiLogOut /> }
      ]
    : [
        { key: "dashboard", label: "Mon cockpit", icon: <FiHome /> },
        { key: "tickets", label: "Mes tickets", icon: <FiFileText /> },
        { key: "stats", label: "Statistiques", icon: <FiBarChart2 /> },
        { key: "profile", label: "Mon profil", icon: <FiUser /> },
        { key: "logout", label: "Déconnexion", icon: <FiLogOut /> }
      ];

  return (
    <aside className="sidebar">
      <div className="sidebar-title">ClaimOneOff</div>
      {menu.map(item => (
        <div
          key={item.key}
          className={`sidebar-item${selected === item.key ? " active" : ""}`}
          onClick={() => onSelect(item.key)}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
      <style jsx>{`
        .sidebar {
          width: 220px; background: linear-gradient(180deg, #6842d9 40%, #3b328a 100%);
          min-height: 100vh; color: #fff; display: flex; flex-direction: column;
          position: sticky; top: 0; box-shadow: 3px 0 12px #0001;
        }
        .sidebar-title {
          font-weight: bold; font-size: 1.7rem; padding: 32px 0 24px 32px;
          letter-spacing: 1px;
        }
        .sidebar-item {
          display: flex; align-items: center; padding: 18px 32px;
          font-size: 1.15rem; cursor: pointer; gap: 18px;
          transition: background .18s;
        }
        .sidebar-item:hover, .sidebar-item.active {
          background: #39286c;
        }
        .sidebar-item span { flex: 1 }
      `}</style>
    </aside>
  );
}

