import React, { useState } from "react";
import TicketDetail from "./TicketDetail";

export default function AdminTickets({ tickets }) {
  const [selected, setSelected] = useState(null);

  if (!tickets.length) return <div className="alert alert-info">Aucun ticket.</div>;

  return (
    <div>
      <h5>Tickets</h5>
      <table className="table table-hover shadow">
        <thead>
          <tr>
            <th>#</th><th>Société</th><th>Problème</th><th>Statut</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, i) => (
            <tr key={t.ID_Ticket} style={{cursor: "pointer"}} onClick={() => setSelected(t)}>
              <td>{i + 1}</td>
              <td>{t.Societe}</td>
              <td>{t.Problematique}</td>
              <td>
                <span className={"badge " + (t.Statut === "Résolu" ? "bg-success" : "bg-warning text-dark")}>
                  {t.Statut}
                </span>
              </td>
              <td>{t.Date_Ouverture?.slice(0,16)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <TicketDetail ticket={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
