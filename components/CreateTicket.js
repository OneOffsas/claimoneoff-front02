import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateTicket({ user, onTicketCreated }) {
  const [description, setDescription] = useState("");
  const [problematique, setProblematique] = useState("");
  const [numero_commande, setNumeroCommande] = useState("");
  const [transporteur, setTransporteur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description || !problematique || !numero_commande) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createTicket",
        societe: user.societe,
        utilisateur: user.nom + " " + user.prenom,
        email: user.email,
        role: user.role,
        numero_commande,
        problematique,
        transporteur,
        description,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.status === "success") {
      toast.success("Ticket créé !");
      setDescription("");
      setProblematique("");
      setNumeroCommande("");
      setTransporteur("");
      if (onTicketCreated) onTicketCreated();
    } else {
      toast.error(data.message || "Erreur création ticket");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card shadow p-4 mb-4">
      <h3 className="mb-3">Créer un ticket</h3>
      <input className="form-control mb-2" placeholder="Numéro de commande" value={numero_commande} onChange={e => setNumeroCommande(e.target.value)} />
      <input className="form-control mb-2" placeholder="Transporteur" value={transporteur} onChange={e => setTransporteur(e.target.value)} />
      <select className="form-control mb-2" value={problematique} onChange={e => setProblematique(e.target.value)}>
        <option value="">Sélectionnez une problématique</option>
        <option>Perte colis</option>
        <option>Colis endommagé</option>
        <option>Non reçu</option>
        <option>Erreur préparation</option>
        <option>Erreur réception</option>
        <option>Produit endommagé</option>
        <option>Autre</option>
      </select>
      <textarea className="form-control mb-2" placeholder="Description..." value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      <button className="btn btn-success w-100" type="submit" disabled={loading}>
        {loading ? "Création..." : "Créer le ticket"}
      </button>
    </form>
  );
}
