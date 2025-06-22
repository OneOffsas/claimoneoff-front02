import { useState } from "react";
import { toast } from "react-toastify";

export default function TicketDetail({ ticket, onBack }) {
  const [status, setStatus] = useState(ticket.statut);
  const [comment, setComment] = useState("");

  function updateStatus() {
    fetch("/api/admin/update-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ticket.id_ticket, statut: status }),
    }).then(() => toast.success("Statut mis à jour"));
  }
  function addComment() {
    fetch("/api/admin/add-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ticket.id_ticket, commentaire: comment }),
    }).then(() => { toast.success("Commentaire ajouté"); setComment(""); });
  }

  return (
    <div className="bg-white shadow rounded-xl p-6 max-w-xl mx-auto">
      <button onClick={onBack} className="mb-4 text-sm text-blue-600 underline">← Retour</button>
      <h2 className="text-xl font-bold mb-2">Ticket {ticket.id_ticket}</h2>
      <div className="mb-2"><b>Problématique :</b> {ticket.problematique}</div>
      <div className="mb-2"><b>Description :</b> {ticket.description}</div>
      <div className="mb-2"><b>Statut :</b> 
        <select value={status} onChange={e => setStatus(e.target.value)} className="ml-2">
          <option>Ouvert</option>
          <option>En cours</option>
          <option>Résolu</option>
          <option>Fermé</option>
        </select>
        <button onClick={updateStatus} className="ml-3 px-3 py-1 rounded bg-violet-600 text-white">Enregistrer</button>
      </div>
      <div className="mt-6">
        <b>Fil de discussion :</b>
        {/* À adapter selon structure ticket */}
        <div className="bg-gray-50 rounded p-3 mt-2 min-h-[60px]">{ticket.discussion || "Pas encore de message."}</div>
        <textarea className="mt-3 w-full border rounded p-2" value={comment} onChange={e => setComment(e.target.value)} placeholder="Ajouter un commentaire..." />
        <button onClick={addComment} className="mt-2 px-3 py-1 rounded bg-blue-600 text-white">Ajouter</button>
      </div>
    </div>
  );
}

