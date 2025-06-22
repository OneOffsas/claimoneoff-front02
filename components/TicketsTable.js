import { useMemo } from "react";

export default function TicketsTable({ tickets, isAdmin, onExport }) {
  // Option export CSV
  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">{isAdmin ? "Tous les tickets" : "Mes tickets"}</h5>
        {onExport && <button className="btn btn-outline-primary" onClick={onExport}>Exporter CSV</button>}
      </div>
      <div style={{overflowX:'auto'}}>
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Société</th>
              <th>Commande</th>
              <th>Problème</th>
              <th>Transporteur</th>
              <th>Statut</th>
              <th>Urgence</th>
              <th>Date ouverture</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.ID_Ticket || t.id_ticket}>
                <td>{t.ID_Ticket || t.id_ticket}</td>
                <td>{t.Societe || t.societe}</td>
                <td>{t.Numero_Commande || t.numero_commande}</td>
                <td>{t.Problematique || t.problematique}</td>
                <td>{t.Transporteur || t.transporteur}</td>
                <td>
                  <span className={`badge rounded-pill bg-${t.Statut === "Ouvert" ? "warning" : t.Statut === "Résolu" ? "success" : "secondary"}`}>
                    {t.Statut || t.statut}
                  </span>
                </td>
                <td>{t.Urgence || t.urgence}</td>
                <td>{(t.Date_Ouverture || t.date_ouverture || "").slice(0,16)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
