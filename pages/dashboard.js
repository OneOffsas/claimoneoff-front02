// pages/dashboard.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getSession } from 'next-auth/react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from '../styles/Dashboard.module.css';

const SHEET_ID = 'Tickets_ClaimOneOff';
const HEADERS = [
  'ID_Ticket', 'Societe', 'Utilisateur', 'Email', 'Role', 'Date_Ouverture',
  'Urgence', 'Numero_Commande', 'SLA_Cible', 'Problematique', 'Transporteur',
  'Description', 'Fichiers_Joints', 'Discussion', 'Statut', 'Date_MAJ',
  'Priorite', 'Type_Action', 'Delai_Resolution', 'Facturation'
];

export default function Dashboard({ user }) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const doc = new GoogleSpreadsheet(SHEET_ID);
      await doc.useServiceAccountAuth({
        client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
        private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle['Tickets_ClaimOneOff'];
      const rows = await sheet.getRows();

      const data = rows.map(row => {
        const record = {};
        HEADERS.forEach(key => (record[key] = row[key]));
        return record;
      });

      setTickets(data);

      const statMap = {};
      data.forEach(ticket => {
        statMap[ticket.Transporteur] = (statMap[ticket.Transporteur] || 0) + 1;
      });
      const chartData = Object.entries(statMap).map(([key, value]) => ({ name: key, count: value }));
      setStats(chartData);
    }
    fetchData();
  }, []);

  return (
    <Layout user={user}>
      <div className={styles.container}>
        <h1 className="mb-4">Bienvenue sur ClaimOneOff 🎯</h1>
        <div className={styles.chartSection}>
          <h2>📊 Tickets par transporteur</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.tableSection}>
          <h2 className="mt-5">📋 Liste des tickets</h2>
          <table className="table table-striped table-hover mt-3">
            <thead>
              <tr>
                {HEADERS.slice(0, 8).map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.ID_Ticket}>
                  {HEADERS.slice(0, 8).map(key => (
                    <td key={key}>{ticket[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: session.user,
    },
  };
}
