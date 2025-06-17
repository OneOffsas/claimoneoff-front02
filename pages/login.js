// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { login } from '../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.status === 'error' || res.error) {
      setError(res.message || res.error || 'Erreur de connexion');
    } else {
      // On stocke l'utilisateur dans localStorage
      localStorage.setItem('claimoneoff_user', JSON.stringify(res));
      router.push('/tickets');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex justify-content-center">
        <div className="card w-50">
          <div className="card-body">
            <h3 className="card-title mb-4 text-center">Connexion</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
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
              <button className="btn btn-primary w-100" type="submit">
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


