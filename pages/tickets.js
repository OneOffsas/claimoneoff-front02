// pages/tickets.js
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchTickets, createTicket } from '../services/api';
import { useRouter } from 'next/router';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [newT, setNewT] = useState({
    urgence:'Normale', numero_commande:'', sla_cible:'', problematique:'', transporteur:'', description:''
  });
  const router = useRouter();

  // Charger l'utilisateur connecté
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('claimoneoff_user'));
    if (!u) {
      router.push('/login');
      return;
    }
    setUser(u);

    const load = async () => {
      setLoading(true);
      const res = await fetchTickets({ societe: u.societe, role: u.role, email: u.email });
      if (res.status==='success') setTickets(res.tickets);
      setLoading(false);
    };
    load();
  }, []);

  const submit = async e => {
    e.preventDefault();
    if (!user) return;
    await createTicket({ ...user, ...newT });
    setShowForm(false);
    setNewT({ urgence:'Normale', numero_commande:'', sla_cible:'', problematique:'', transporteur:'', description:'' });
    // Recharger les tickets après création
    const res = await fetchTickets({ societe: user.societe, role: user.role, email: user.email });
    if (res.status==='success') setTickets(res.tickets);
  };

  if (!user) return null; // Afficher rien le temps du redirect

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Mes Tickets</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : 'Nouveau Ticket'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Créer un ticket</h5>
              <form onSubmit={submit}>
                {Object.entries(newT).map(([key,val]) => (
                  <div className="mb-3" key={key}>
                    <label className="form-label">
                      {key.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())}
                    </label>
                    {key==='description' 
                      ? <textarea
                          className="form-control"
                          value={val}
                          onChange={e=>setNewT({...newT,[key]:e.target.value})}
                          required
                        />
                      : <input
                          type="text"
                          className="form-control"
                          value={val}
                          onChange={e=>setNewT({...newT,[key]:e.target.value})}
                          required
                        />
                    }
                  </div>
                ))}
                <button className="btn btn-success" type="submit">Envoyer</button>
              </form>
            </div>
          </div>
        )}

        {loading 
          ? <div className="text-center">Chargement…</div>
          : (
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th><th>Problématique</th><th>Statut</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.ID_Ticket}>
                    <td>{t.ID_Ticket}</td>
                    <td>{t.Problematique}</td>
                    <td>{t.Statut}</td>
                    <td>{new Date(t.Date_Ouverture).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>


