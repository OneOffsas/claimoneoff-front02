// pages/createticket.js
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function CreateTicket() {
  const [user, setUser] = useState(null);
  const [urgence, setUrgence] = useState('');
  const [numeroCommande, setNumeroCommande] = useState('');
  const [slaCible, setSlaCible] = useState('');
  const [problematique, setProblematique] = useState('');
  const [transporteur, setTransporteur] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setMsg('Création en cours...');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createTicket',
          societe: user.societe || '',
          utilisateur: user.nom + ' ' + user.prenom,
          email: user.email,
          role: user.role,
          urgence,
          numero_commande: numeroCommande,
          sla_cible: slaCible,
          problematique,
          transporteur,
          description,
          fichiers_joints: '' // à compléter si nécessaire
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMsg('Ticket créé ! ID: ' + data.id_ticket);
        // Après un délai, rediriger vers dashboard
        setTimeout(() => window.location.href = '/dashboard', 1500);
      } else {
        setMsg('Erreur : ' + data.message);
      }
    } catch (err) {
      setMsg('Erreur réseau, réessayez.');
    }
  };

  if (!user) return null;
  return (
    <Layout user={user}>
      <h1>Créer un ticket</h1>
      {msg && <div className="alert alert-info alert-custom">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Urgence</label>
          <select className="form-select" value={urgence} onChange={e => setUrgence(e.target.value)} required>
            <option value="">Choisir...</option>
            <option value="Basse">Basse</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Haute">Haute (+5€ de surcoût indicatif)</option>
          </select>
          {urgence === 'Haute' && (
            <small className="text-danger">Attention : priorité haute, surcoût possible de 5€ (indicatif).</small>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Numéro de commande</label>
          <input
            type="text"
            className="form-control"
            value={numeroCommande}
            onChange={e => setNumeroCommande(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">SLA cible</label>
          <input
            type="text"
            className="form-control"
            value={slaCible}
            onChange={e => setSlaCible(e.target.value)}
            placeholder="ex: 48h"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Problématique</label>
          <input
            type="text"
            className="form-control"
            value={problematique}
            onChange={e => setProblematique(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Transporteur</label>
          <select className="form-select" value={transporteur} onChange={e => setTransporteur(e.target.value)}>
            <option value="">Choisir...</option>
            <option value="DHL">DHL</option>
            <option value="Colissimo">Colissimo</option>
            <option value="UPS">UPS</option>
            {/* Ajoutez selon votre liste */}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary-custom">Créer</button>
      </form>
    </Layout>
  );
}

