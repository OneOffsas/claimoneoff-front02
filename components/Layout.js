// components/Layout.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaTicketAlt,
  FaChartBar,
  FaSignOutAlt,
  FaPlus
} from 'react-icons/fa';

export default function Layout({ children, user }) {
  const router = useRouter();

  // Si pas d'utilisateur, on rend juste les enfants (ex: page login/register)
  if (!user) return <>{children}</>;

  // Définition simple du menu selon le rôle
  const navItems = [
    {
      href: '/dashboard',
      label: 'Mes tickets',
      Icon: FaTicketAlt
    },
    {
      href: '/createticket',
      label: 'Nouveau ticket',
      Icon: FaPlus
    },
    // si c'est un admin, on ajoute le dashboard admin
    ...(user.role === 'Admin'
      ? [
          {
            href: '/admin',
            label: 'Dashboard Admin',
            Icon: FaChartBar
          }
        ]
      : []),
    {
      href: '/logout',
      label: 'Se déconnecter',
      Icon: FaSignOutAlt
    }
  ];

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <aside
        className="bg-light border-end"
        style={{ width: 250, minHeight: '100vh' }}
      >
        <div className="text-center py-4">
          <Link href="/" passHref>
            <a>
              <img
                src="/logo.png"
                alt="Logo"
                className="img-fluid"
                style={{ maxWidth: '120px' }}
              />
            </a>
          </Link>
        </div>
        <nav className="nav flex-column px-2">
          {navItems.map(({ href, label, Icon }) => (
            <Link href={href} key={href} passHref>
              <a
                className={`nav-link d-flex align-items-center ${
                  router.pathname === href ? 'active fw-bold' : ''
                }`}
              >
                <Icon className="me-2" />
                {label}
              </a>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-grow-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
}

