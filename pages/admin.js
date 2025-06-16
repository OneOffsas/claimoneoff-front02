// pages/admin.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, LineChart, Line } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== 'Admin') {
      window.location.href = '/dashboard';
      return;
    }
    setUser(u);
    // Récupérer tous les tickets
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getTickets', email: u.email, role: u.role }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setTickets(data.tickets);
          // Calcul de stats simples : nombre par statut
          const byStatus = {};
          data.tickets.forEach(t => {
            byStatus[t.statut] = (byStatus[t.statut] || 0) + 1;
          });
          const chartData = Object.entries(byStatus).map(([statut, count]) => ({
            statut,
            count,
          }));
          setStats(chartData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;
  return (
    <Layout user={user}>
      <h1>Tableau de bord Admin</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <h2>Statistiques des tickets</h2>
          {stats && stats.length > 0 ? (
            <BarChart width={500} height={300} data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="statut" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#5b21b6" />
            </BarChart>
          ) : (
            <p>Aucune donnée de ticket.</p>
          )}
          <h2 className="mt-4">Tous les tickets</h2>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Urgence</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id_ticket}>
                    <td>{t.id_ticket}</td>
                    <td>{t.utilisateur}</td>
                    <td>{t.email}</td>
                    <td>{t.date_ouverture}</td>
                    <td>{t.urgence}</td>
                    <td>{t.statut}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => window.location.href = `/tickets/${t.id_ticket}`}
                      >
                        Voir
                      </button>
                      {/* Exemple: bouton pour changer statut */}
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => {
                          const nouveau = prompt('Nouveau statut:', t.statut);
                          if (nouveau) {
                            fetch(API_URL, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'updateStatus', id_ticket: t.id_ticket, statut: nouveau }),
                            }).then(res => res.json()).then(d => {
                              if (d.status === 'success') {
                                // recharger la page ou mettre à jour localement
                                window.location.reload();
                              } else {
                                alert('Erreur: ' + d.message);
                              }
                            });
                          }
                        }}
                      >
                        Changer statut
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
}


