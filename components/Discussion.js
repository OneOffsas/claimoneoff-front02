import { useState } from "react";
import { apiCall } from "../utils/api";

export default function Discussion({ ticket, user, refresh, onClose }) {
  const [commentaire, setCommentaire] = useState("");
  const [msg, setMsg] = useState("");

  async function handleAddComment(e) {
    e.preventDefault();
    setMsg("");
    if (!commentaire.trim()) return;
    await apiCall("addDiscussion", {
      id_ticket: ticket.id_ticket,
      utilisateur: user.prenom + " " + user.nom,
      commentaire,
    });
    setCommentaire("");
    setMsg("Commentaire ajouté !");
    refresh();
    setTimeout(() => setMsg(""), 1200);
  }

  const commentaires = (ticket.discussion || "")
    .split("\n")
    .filter(Boolean)
    .map((line, idx) => <div key={idx} style={{padding:"6px 0",borderBottom:"1px solid #eee"}}>{line}</div>);

  return (
    <div className="card" style={{marginTop:20}}>
      <button onClick={onClose} style={{float:"right", background:"#eee", color:"#232046"}}>Fermer</button>
      <h4>Fil de discussion du ticket</h4>
      <div style={{marginBottom:18, background:"#f7f6fd", padding:12, borderRadius:8}}>
        <b>Problématique :</b> {ticket.problematique}<br/>
        <b>Description :</b> {ticket.description}<br/>
        <b>Ouvert le :</b> {ticket.date_ouverture}<br/>
        <b>Numéro de commande :</b> {ticket.numero_commande || "—"}
      </div>
      <div style={{marginBottom:10, maxHeight:180, overflowY:"auto", background:"#fff", padding:8, border:"1px solid #eee", borderRadius:8}}>
        {commentaires.length === 0 && <div>Aucun commentaire pour l’instant.</div>}
        {commentaires}
      </div>
      <form onSubmit={handleAddComment}>
        <input
          placeholder="Ajouter un commentaire…"
          value={commentaire}
          onChange={e=>setCommentaire(e.target.value)}
          style={{marginTop:12}}
        />
        <button type="submit" style={{marginLeft:10}}>Envoyer</button>
      </form>
      {msg && <div style={{color:"green"}}>{msg}</div>}
    </div>
  );
}
