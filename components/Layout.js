// components/Layout.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaTicketAlt, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

export default function Layout({ children, user }) {
  const router = useRouter();
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="mb-4 text-center">
          {/* Logo : placez votre logo dans public/logo.png */}
          <img src="/logo.png" alt="Logo" className="img-fluid" style={{ maxWidth: '100px' }} />
        </div>
        <nav>
          <Link href="/" passHref>
            <a className={`nav-link-custom ${router.pathname === '/' ? 'active' : ''}`}>
              <FaHome style={{ marginRight: '8px' }} /> Accueil
            </a>
          </Link>
          <Link href="/dashboard" passHref>
            <a className={`nav-link-custom ${router.pathname === '/dashboard' ? 'active' : ''}`}>
              <FaTicketAlt style={{ marginRight: '8px' }} /> Mes tickets
            </a>
          </Link>
          {user && user.role === 'Admin' && (
            <Link href="/admin" passHref>
              <a className={`nav-link-custom ${router.pathname === '/admin' ? 'active' : ''}`}>
                <FaChartBar style={{ marginRight: '8px' }} /> Admin Dashboard
              </a>
            </Link>
          )}
          <Link href="/logout" passHref>
            <a className="nav-link-custom">
              <FaSignOutAlt style={{ marginRight: '8px' }} /> Se déconnecter
            </a>
          </Link>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-grow-1 main-container">
        {children}
      </main>
    </div>
  );
}
