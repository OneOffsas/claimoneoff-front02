import React, { useState } from "react";
import { toast } from "react-toastify";

export default function TicketDetail({ ticket, onClose }) {
  const [statut, setStatut] = useState(ticket.Statut);
  const [comment, setComment] = useState("");

  function handleUpdateStatut(e) {
    e.preventDefault();
    fetch("/api/updateTicket", {
      method: "POST",
      body: JSON.stringify({
        action: "updateTicket",
        id_ticket: ticket.ID_Ticket,
        fields: { Statut: statut }
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then(r => r.json())
      .then(data => {
        if (data.status === "success") toast.success("Statut mis à jour !");
        else toast.error(data.message);
      });
  }

  function handleAddComment(e) {
    e.preventDefault();
    fetch("/api/addComment", {
      method: "POST",
      body: JSON.stringify({
        action: "addComment",
        id_ticket: ticket.ID_Ticket,
        utilisateur: "Admin",
        commentaire: comment
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then(r => r.json())
      .then(data => {
        if (data.status === "success") {
          toast.success("Commentaire ajouté !");
          setComment("");
        } else toast.error(data.message);
      });
  }

  return (
    <div className="modal-backdrop show" style={{zIndex: 9999}}>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">Ticket {ticket.ID_Ticket}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p><b>Statut :</b> {statut}</p>
              <form onSubmit={handleUpdateStatut} className="mb-3">
                <select className="form-select" value={statut} onChange={e => setStatut(e.target.value)}>
                  <option>Ouvert</option>
                  <option>En cours</option>
                  <option>Résolu</option>
                  <option>Fermé</option>
                </select>
                <button className="btn btn-primary mt-2" type="submit">Changer le statut</button>
              </form>
              <h6>Fil de discussion :</h6>
              <pre className="bg-light p-2" style={{minHeight:80}}>
                {ticket.Discussion || "Aucun commentaire."}
              </pre>
              <form onSubmit={handleAddComment}>
                <textarea className="form-control mb-2" value={comment} onChange={e => setComment(e.target.value)} placeholder="Ajouter un commentaire..." />
                <button className="btn btn-success" type="submit">Envoyer</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
