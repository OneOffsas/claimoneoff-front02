// pages/register.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Register() {
  const router = useRouter();
  const [societe, setSociete] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    setMsg('Inscription en cours...');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          societe,
          nom,
          prenom,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMsg('Compte créé! Vous pouvez vous connecter.');
        // après un court délai, rediriger vers login
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setMsg('Erreur : ' + data.message);
      }
    } catch (err) {
      setMsg('Erreur réseau, réessayez.');
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="bg-white p-4 shadow card-custom" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Créer un compte</h2>
        {msg && <div className="alert alert-info alert-custom">{msg}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Société</label>
            <input
              type="text"
              className="form-control"
              value={societe}
              onChange={e => setSociete(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input
              type="text"
              className="form-control"
              value={nom}
              onChange={e => setNom(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Prénom</label>
            <input
              type="text"
              className="form-control"
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="btn btn-primary-custom w-100">Créer mon compte</button>
        </form>
        <div className="mt-3 text-center">
          Vous avez déjà un compte?{' '}
          <Link href="/login" passHref>
            <a>Se connecter</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
