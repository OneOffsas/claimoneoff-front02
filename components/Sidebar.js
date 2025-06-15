import Link from "next/link";
import { useRouter } from "next/router";

const menus = [
  { icon: "📊", label: "Dashboard", href: "/admin" },
  { icon: "🗂️", label: "Tickets", href: "/admin/tickets" },
  { icon: "👥", label: "Clients", href: "/admin/clients" },
  { icon: "📈", label: "Statistiques", href: "/admin/stats" },
  { icon: "⬇️", label: "Export", href: "/admin/export" },
];
export default function Sidebar() {
  const { pathname } = useRouter();
  return (
    <aside
      style={{
        minWidth: 220,
        background: "linear-gradient(160deg,#6C47FF 0%,#212155 100%)",
        minHeight: "100vh",
        boxShadow: "2px 0 14px #dedcff33",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 0",
        transition: "width 0.2s",
        position: "sticky",
        top: 0,
      }}
    >
      <img
        src="/logo.png"
        alt="Logo"
        style={{
          width: 56,
          marginBottom: 32,
          borderRadius: 14,
          boxShadow: "0 2px 14px #4443",
          animation: "pulseLogo 2s infinite alternate",
        }}
      />
      <nav style={{ width: "100%" }}>
        {menus.map((m, i) => (
          <Link href={m.href} key={i} legacyBehavior>
            <a
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "15px 36px",
                color: "#fff",
                fontWeight: 600,
                fontSize: 17,
                textDecoration: "none",
                background: pathname === m.href ? "rgba(255,255,255,0.15)" : "none",
                borderRadius: "12px",
                margin: "8px 0",
                boxShadow: pathname === m.href ? "0 2px 10px #d9d7fd44" : "none",
                transition: "all 0.18s",
                cursor: "pointer",
                letterSpacing: ".02em",
              }}
            >
              <span style={{ fontSize: 23 }}>{m.icon}</span>
              {m.label}
            </a>
          </Link>
        ))}
      </nav>
      <style>{`
        @keyframes pulseLogo {
          from { transform: scale(1);}
          to { transform: scale(1.09) rotate(-3deg);}
        }
      `}</style>
    </aside>
  );
}
