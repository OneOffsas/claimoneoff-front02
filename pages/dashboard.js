// pages/dashboard.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Au montage, récupérer user depuis localStorage (ou context/auth)
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
    // Récupérer les tickets pour ce user
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getTickets', email: u.email, role: u.role }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setTickets(data.tickets);
        } else {
          // gérer erreur
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;
  return (
    <Layout user={user}>
      <h1>Mes Tickets</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : tickets.length === 0 ? (
        <p>Aucun ticket trouvé.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Problème</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id_ticket}>
                  <td>{t.id_ticket}</td>
                  <td>{t.date_ouverture}</td>
                  <td>{t.problematique}</td>
                  <td>{t.statut}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        // afficher détails ou rediriger vers page de détail
                        window.location.href = `/tickets/${t.id_ticket}`;
                      }}
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <button
          className="btn btn-primary-custom"
          onClick={() => window.location.href = '/createticket'}
        >
          Créer un nouveau ticket
        </button>
      </div>
    </Layout>
  );
}
