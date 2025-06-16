// pages/login.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''; 
// Vous mettez ici l’URL de votre backend (Cloudflare Worker ou App Script) via variable d’environnement NEXT_PUBLIC_API_URL

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setMsg('Connexion en cours...');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        // stockez le user dans localStorage/session, ou Context
        // Exemple simple :
        localStorage.setItem('user', JSON.stringify(data));
        // Redirection selon rôle
        if (data.role === 'Admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setMsg('Erreur : ' + data.message);
      }
    } catch (err) {
      setMsg('Erreur réseau, réessayez');
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="bg-white p-4 shadow card-custom" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Se connecter</h2>
        {msg && <div className="alert alert-warning alert-custom">{msg}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary-custom w-100">Se connecter</button>
        </form>
        <div className="mt-3 text-center">
          <Link href="/forgot" passHref>
            <a>Mot de passe oublié?</a>
          </Link>
        </div>
        <div className="mt-3 text-center">
          Vous n'avez pas de compte?{' '}
          <Link href="/register" passHref>
            <a>Créer un compte</a>
          </Link>
        </div>
      </div>
    </div>
  );
}

