import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

export default function AdminTickets({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ statut: "", societe: "", problematique: "" });

  const loadTickets = async () => {
    setLoading(true);
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getTickets",
        role: "Admin"
      }),
    });
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
  };

  useEffect(() => { loadTickets(); }, []);

  const filtred = tickets.filter(t =>
    (!filter.statut || t.Statut === filter.statut) &&
    (!filter.societe || t.Societe === filter.societe) &&
    (!filter.problematique || t.Problematique === filter.problematique)
  );

  const allSocietes = [...new Set(tickets.map(t => t.Societe))].filter(Boolean);
  const allProblemes = [...new Set(tickets.map(t => t.Problematique))].filter(Boolean);
  const allStatuts = [...new Set(tickets.map(t => t.Statut))].filter(Boolean);

  return (
    <div>
      <h3>Tickets – Vue Admin</h3>
      <div className="row g-3 mb-3">
        <div className="col">
          <select className="form-select" value={filter.statut} onChange={e => setFilter(f => ({ ...f, statut: e.target.value }))}>
            <option value="">Tous statuts</option>
            {allStatuts.map(st => <option key={st}>{st}</option>)}
          </select>
        </div>
        <div className="col">
          <select className="form-select" value={filter.societe} onChange={e => setFilter(f => ({ ...f, societe: e.target.value }))}>
            <option value="">Toutes sociétés</option>
            {allSocietes.map(soc => <option key={soc}>{soc}</option>)}
          </select>
        </div>
        <div className="col">
          <select className="form-select" value={filter.problematique} onChange={e => setFilter(f => ({ ...f, problematique: e.target.value }))}>
            <option value="">Tous problèmes</option>
            {allProblemes.map(pb => <option key={pb}>{pb}</option>)}
          </select>
        </div>
        <div className="col-auto d-flex align-items-center">
          <CSVLink
            data={filtred}
            filename={"claimoneoff-tickets.csv"}
            className="btn btn-outline-success btn-sm"
          >
            Export CSV
          </CSVLink>
          <button className="btn btn-outline-secondary btn-sm ms-2" onClick={loadTickets}>Rafraîchir</button>
        </div>
      </div>
      <div className="table-responsive">
        {loading ? (
          <div>Chargement…</div>
        ) : (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Société</th>
                <th>Utilisateur</th>
                <th>Date</th>
                <th>Commande</th>
                <th>Problème</th>
                <th>Transporteur</th>
                <th>Urgence</th>
                <th>Statut</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filtred.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-muted">
                    Aucun ticket pour le moment.
                  </td>
                </tr>
              ) : (
                filtred.map((t, i) => (
                  <tr key={t.ID_Ticket || i}>
                    <td>{t.Societe}</td>
                    <td>{t.Utilisateur}</td>
                    <td>{t.Date_Ouverture}</td>
                    <td>{t.Numero_Commande}</td>
                    <td>{t.Problematique}</td>
                    <td>{t.Transporteur}</td>
                    <td>{t.Urgence}</td>
                    <td>{t.Statut}</td>
                    <td style={{ maxWidth: 200 }}>{t.Description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
