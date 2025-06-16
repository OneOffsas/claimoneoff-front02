// components/Layout.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaTicketAlt,
  FaChartBar,
  FaSignOutAlt,
  FaPlus,
  FaUserShield
} from 'react-icons/fa';

export default function Layout({ children, user }) {
  const router = useRouter();

  if (!user) return <>{children}</>;

  const isActive = (path) => router.pathname === path;

  const menuItemsClient = [
    {
      label: 'Mes tickets',
      href: '/dashboard',
      icon: <FaTicketAlt />,
    },
    {
      label: 'Nouveau ticket',
      href: '/createticket',
      icon: <FaPlus />,
    },
    {
      label: 'Se déconnecter',
      href: '/logout',
      icon: <FaSignOutAlt />,
    },
  ];

  const menuItemsAdmin = [
    {
      label: 'Dashboard Admin',
      href: '/admin',
      icon: <FaChartBar />,
    },
    {
      label: 'Mes tickets',
      href: '/dashboard',
      icon: <FaTicketAlt />,
    },
    {
      label: 'Nouveau ticket',
      href: '/createticket',
      icon: <FaPlus />,
    },
    {
      label: 'Se déconnecter',
      href: '/logout',
      icon: <FaSignOutAlt />,
    },
  ];

  const menu = user.role === 'Admin' ? menuItemsAdmin : menuItemsClient;

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <aside className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <div className="text-center mb-4">
          <img src="/logo.png" alt="Logo" style={{ maxWidth: '100px' }} />
        </div>
        <nav>
          {menu.map((item, idx) => (
            <Link key={idx} href={item.href} passHref legacyBehavior>
              <a
                className={`d-flex align-items-center mb-3 text-white text-decoration-none p-2 rounded ${
                  isActive(item.href) ? 'bg-primary' : 'bg-dark'
                }`}
                style={{ transition: '0.3s' }}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 bg-light p-4">{children}</main>
    </div>
  );
}

