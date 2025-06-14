import { useState } from "react";
import { apiCall } from "../utils/api";

export default function TicketForm({ user, onSuccess }) {
  const [urgence, setUrgence] = useState("Non");
  const [numeroCommande, setNumeroCommande] = useState("");
  const [slaCible, setSlaCible] = useState("48h");
  const [problematique, setProblematique] = useState("");
  const [transporteur, setTransporteur] = useState("");
  const [description, setDescription] = useState("");
  const [priorite, setPriorite] = useState("Moyenne");
  const [typeAction, setTypeAction] = useState("Expédition");
  const [delaiResolution, setDelaiResolution] = useState("48h");
  const [facturation, setFacturation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleUrgenceChange(e) {
    setUrgence(e.target.value);
    if (e.target.value === "Oui") {
      setPriorite("Haute");
      setFacturation("5€ TTC");
      setSlaCible("24h");
      setDelaiResolution("24h");
    } else {
      setPriorite("Moyenne");
      setFacturation("");
      setSlaCible("48h");
      setDelaiResolution("48h");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (urgence === "Oui" && numeroCommande.trim() === "") {
      setError("Le numéro de commande est obligatoire pour une demande urgente !");
      return;
    }
    const data = {
      societe: user.societe,
      utilisateur: user.prenom + " " + user.nom,
      email: user.email,
      role: user.role,
      date_ouverture: new Date().toISOString(),
      urgence,
      numero_commande: numeroCommande,
      sla_cible: slaCible,
      problematique,
      transporteur,
      description,
      fichiers_joints: "",
      priorite,
      type_action: typeAction,
      delai_resolution: delaiResolution,
      facturation
    };
    const res = await apiCall("createTicket", data);
    if (res.status === "success") {
      setSuccess("Ticket créé avec succès !");
      setTimeout(() => {
        setSuccess("");
        onSuccess();
      }, 1000);
    } else {
      setError(res.message || "Erreur à la création du ticket.");
    }
  }

  return (
    <div className="card">
      <h3>Créer un ticket</h3>
      <form onSubmit={handleSubmit}>
        <label>Demande urgente ?
          <select value={urgence} onChange={handleUrgenceChange}>
            <option value="Non">Non</option>
            <option value="Oui">Oui</option>
          </select>
        </label>
        {urgence === "Oui" && (
          <>
            <div className="urgent-message">
              ⚠️ Service urgent facturé 5 € TTC. SLA prioritaire.
            </div>
            <input
              placeholder="Numéro de commande *"
              value={numeroCommande}
              onChange={e => setNumeroCommande(e.target.value)}
              required
            />
            <input
              placeholder="SLA cible (heures/jours)"
              value={slaCible}
              onChange={e => setSlaCible(e.target.value)}
              required
            />
          </>
        )}
        <label>Problématique :
          <select value={problematique} onChange={e => setProblematique(e.target.value)} required>
            <option value="">-- Sélectionner --</option>
            <option value="Perte colis">Perte colis</option>
            <option value="Colis endommagé">Colis endommagé</option>
            <option value="Non reçu">Non reçu</option>
            <option value="Erreur de préparation">Erreur de préparation</option>
            <option value="Erreur de réception">Erreur de réception</option>
            <option value="Produit manquant">Produit manquant</option>
            <option value="Produit endommagé">Produit endommagé</option>
            <option value="Demande d'affrètement">Demande d'affrètement</option>
            <option value="Retour client">Retour client</option>
            <option value="Autre">Autre</option>
          </select>
        </label>
        <label>Transporteur :
          <select value={transporteur} onChange={e => setTransporteur(e.target.value)} required>
            <option value="">-- Sélectionner --</option>
            <option value="Colissimo">Colissimo</option>
            <option value="Mondial Relay">Mondial Relay</option>
            <option value="Chronopost">Chronopost</option>
            <option value="GLS">GLS</option>
            <option value="DPD">DPD</option>
            <option value="Autre">Autre</option>
          </select>
        </label>
        <label>Description détaillée :
          <textarea
            placeholder={urgence === "Oui" ? "Que faut-il faire ?" : "Décris le problème..."}
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </label>
        <label>Priorité :
          <input value={priorite} readOnly />
        </label>
        <label>Type d'action attendue :
          <select value={typeAction} onChange={e => setTypeAction(e.target.value)} required>
            <option value="Expédition">Expédition</option>
            <option value="Retour">Retour</option>
            <option value="Remboursement">Remboursement</option>
            <option value="Autre">Autre</option>
          </select>
        </label>
        <label>Délai de résolution estimé :
          <input value={delaiResolution} readOnly />
        </label>
        {facturation && (
          <label>Facturation :
            <input value={facturation} readOnly />
          </label>
        )}
        <button type="submit">Créer le ticket</button>
      </form>
      {error && <div style={{color: "red"}}>{error}</div>}
      {success && <div style={{color: "green"}}>{success}</div>}
    </div>
  );
}
