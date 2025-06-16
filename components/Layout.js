// components/Layout.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaTicketAlt, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

export default function Layout({ children, user }) {
  const router = useRouter();

  // Si pas d'utilisateur (non connecté), on ne montre pas la sidebar
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="mb-4 text-center">
          <Link href="/" passHref>
            <a>
              <img src="/logo.png" alt="Logo" className="img-fluid" style={{ maxWidth: '100px' }} />
            </a>
          </Link>
        </div>
        <nav>
          <Link href="/dashboard" passHref>
            <a className={`nav-link-custom ${router.pathname === '/dashboard' ? 'active' : ''}`}>
              <FaTicketAlt style={{ marginRight: '8px' }} /> Mes tickets
            </a>
          </Link>
          <Link href="/createticket" passHref>
            <a className={`nav-link-custom ${router.pathname === '/createticket' ? 'active' : ''}`}>
              <FaPlusIcon style={{ marginRight: '8px' }} /> Nouveau ticket
            </a>
          </Link>
          {user.role === 'Admin' && (
            <Link href="/admin" passHref>
              <a className={`nav-link-custom ${router.pathname === '/admin' ? 'active' : ''}`}>
                <FaChartBar style={{ marginRight: '8px' }} /> Dashboard Admin
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

// Note : FaPlusIcon n'existe pas, remplacez par un icône de react-icons, par ex:
import { FaPlus } from 'react-icons/fa';
// et utilisez <FaPlus /> au lieu de <FaPlusIcon />.
