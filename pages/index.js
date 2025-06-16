// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="text-center p-4 bg-white shadow card-custom">
        <h1 className="mb-4">Bienvenue sur ClaimOneOff</h1>
        <p className="mb-4">Connectez-vous ou créez un compte pour accéder au système de ticketing.</p>
        <Link href="/login" passHref>
          <a className="btn btn-primary-custom btn-lg mb-2 w-100">Se connecter</a>
        </Link>
        <Link href="/register" passHref>
          <a className="btn btn-outline-primary w-100">Créer un compte</a>
        </Link>
      </div>
    </div>
  );
}
