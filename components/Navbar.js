// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const isConnected = typeof window !== "undefined" && localStorage.getItem('claimoneoff_user');

  const handleLogout = () => {
    localStorage.removeItem('claimoneoff_user');
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link href="/" className="navbar-brand">ClaimOneOff</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"/>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto">
            {router.pathname !== '/login' && (
              <li className="nav-item">
                <Link href="/login" className="nav-link">Se connecter</Link>
              </li>
            )}
            {router.pathname !== '/register' && (
              <li className="nav-item">
                <Link href="/register" className="nav-link">S’inscrire</Link>
              </li>
            )}
            {isConnected && (
              <li className="nav-item">
                <button className="btn btn-danger ms-3" onClick={handleLogout}>Déconnexion</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
