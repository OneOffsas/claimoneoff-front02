// components/Layout.js
import Link from "next/link"
import { useRouter } from "next/router"
import { FaTicketAlt, FaPlus, FaChartBar, FaSignOutAlt } from "react-icons/fa"

export default function Layout({ children, user }) {
  const router = useRouter()
  // si pas connecté, on n’affiche pas la sidebar
  if (!user) return <>{children}</>

  const nav = [
    { href: "/dashboard", icon: <FaTicketAlt />, label: "Mes tickets" },
    { href: "/createticket", icon: <FaPlus />, label: "Nouveau ticket" },
  ]
  if (user.role === "Admin") {
    nav.push({ href: "/admin", icon: <FaChartBar />, label: "Admin Dashboard" })
  }

  return (
    <div className="d-flex">
      <aside className="bg-light vh-100 p-3" style={{width: 240}}>
        <div className="text-center mb-4">
          <img src="/logo.png" alt="Logo" style={{maxWidth:120}}/>
        </div>
        <nav className="nav flex-column">
          {nav.map(item => (
            <Link key={item.href} href={item.href} passHref>
              <a className={`nav-link ${router.pathname === item.href ? "active fw-bold" : ""}`}>
                <span className="me-2">{item.icon}</span>
                {item.label}
              </a>
            </Link>
          ))}
          <Link href="/logout" passHref>
            <a className="nav-link text-danger mt-4">
              <FaSignOutAlt className="me-2"/> Se déconnecter
            </a>
          </Link>
        </nav>
      </aside>
      <main className="flex-grow-1 p-4">
        {children}
      </main>
    </div>
  )
}

