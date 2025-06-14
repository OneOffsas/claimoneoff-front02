import { useState } from "react";
import Discussion from "./Discussion";
import { apiCall } from "../utils/api";

export default function TicketList({ tickets, user, refresh }) {
  const [selected, setSelected] = useState(null);

  async function updateStatus(id_ticket, newStatut) {
    await apiCall("updateStatus", { id_ticket, statut: newStatut });
    refresh();
  }

  return (
    <div style={{marginTop: 40}}>
      <h3>Mes tickets</h3>
      {tickets.length === 0 && <p>Aucun ticket pour le moment.</p>}
      <table style={{width: "100%", borderCollapse: "collapse", fontSize: "1rem"}}>
        <thead>
          <tr style={{background: "#eee"}}>
            <th>ID</th>
            <th>Ouvert le</th>
            <th>Problème</th>
            <th>Statut</th>
            <th>Urgent</th>
            <th>Priorité</th>
            <th>Transporteur</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {tickets.map(ticket =>
          <tr key={ticket.id_ticket} style={{borderBottom:"1px solid #ccc", background: selected === ticket.id_ticket ? "#faf6ff" : "#fff"}}>
            <td>{ticket.id_ticket}</td>
            <td>{ticket.date_ouverture}</td>
            <td>{ticket.problematique}</td>
            <td>
              <span className={`status status-${ticket.statut.replaceAll(" ", "_")}`}>
                {ticket.statut}
              </span>
              {user.role === "Admin" &&
                <select
                  value={ticket.statut}
                  onChange={e => updateStatus(ticket.id_ticket, e.target.value)}
                  style={{marginLeft: 10}}>
                  <option>En cours</option>
                  <option>Traité</option>
                  <option>Remboursé</option>
                  <option>En attente</option>
                  <option>Réclamation réalisée par le transporteur</option>
                  <option>Clos</option>
                  <option>Refusé</option>
                </select>
              }
            </td>
            <td style={{color: ticket.urgence === "Oui" ? "red" : "#232046", fontWeight: "bold"}}>
              {ticket.urgence}
            </td>
            <td>{ticket.priorite}</td>
            <td>{ticket.transporteur}</td>
            <td>
              <button onClick={()=>setSelected(selected === ticket.id_ticket ? null : ticket.id_ticket)}>
                {selected === ticket.id_ticket ? "Fermer" : "Voir"}
              </button>
            </td>
          </tr>
        )}
        </tbody>
      </table>
      {selected && <Discussion ticket={tickets.find(t=>t.id_ticket === selected)} user={user} refresh={refresh} onClose={()=>setSelected(null)} />}
    </div>
  );
}
