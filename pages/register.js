import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    societe: '',
    nom: '',
    prenom: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    // Vérifie tous les champs
    if (!form.societe || !form.nom || !form.prenom || !form.email || !form.password) {
      setMessage('Merci de remplir tous les champs obligatoires.');
      return;
    }
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('✅ Inscription réussie ! Vous pouvez vous connecter.');
      setForm({ societe: '', nom: '', prenom: '', email: '', password: '' });
    } else {
      setMessage(`❌ ${data.error || 'Une erreur est survenue.'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-violet-800 to-purple-900">
      <form className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-2">Créer un compte</h2>
        <input name="societe" placeholder="Société" className="input" value={form.societe} onChange={handleChange} />
        <input name="nom" placeholder="Nom" className="input" value={form.nom} onChange={handleChange} />
        <input name="prenom" placeholder="Prénom" className="input" value={form.prenom} onChange={handleChange} />
        <input name="email" placeholder="E-mail" type="email" className="input" value={form.email} onChange={handleChange} />
        <input name="password" placeholder="Mot de passe" type="password" className="input" value={form.password} onChange={handleChange} />
        <button className="w-full bg-violet-700 hover:bg-violet-800 text-white rounded-xl py-3 mt-2 font-semibold transition">S'inscrire</button>
        {message && <div className="text-center mt-2">{message}</div>}
      </form>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          margin-top: 8px;
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 1rem;
        }
        .input:focus {
          border-color: #7c3aed;
        }
      `}</style>
    </div>
  );
}

