// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { register } from '../services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email:'', password:'', nom:'', prenom:'', societe:'' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async e => {
    e.preventDefault();
    const res = await register(form);
    if (res.status === 'error' || res.error) {
      setError(res.message || res.error || 'Erreur inscription');
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex justify-content-center">
        <div className="card w-50">
          <div className="card-body">
            <h3 className="card-title mb-4 text-center">Inscription</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              {['nom','prenom','societe','email','password'].map(field => (
                <div className="mb-3" key={field}>
                  <label className="form-label">
                    {field.charAt(0).toUpperCase()+field.slice(1)}
                  </label>
                  <input
                    type={field==='password'?'password':'text'}
                    name={field}
                    className="form-control"
                    value={form[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <button className="btn btn-success w-100" type="submit">
                S’inscrire
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

