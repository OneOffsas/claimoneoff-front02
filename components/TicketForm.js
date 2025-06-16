// components/TicketForm.js
import { useState } from "react";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function TicketForm({ onSuccess }) {
  // État du formulaire avec tous les champs nécessaires
  const [form, setForm] = useState({
    societe: "",
    utilisateur: "",
    email: "",
    role: "Client",            // toujours "Client" pour l’utilisateur
    urgence: "",               // Faible, Normale, Haute
    numero_commande: "",
    sla_cible: "",
    problematique: "",
    transporteur: "",
    description: "",
    fichiers_joints: "",
    priorite: "",
    type_action: "",
    delai_resolution: "",
    facturation: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Gère la modification de n’importe quel champ
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Soumission du formulaire
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createTicket", ...form }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg("✅ Ticket créé avec succès !");
        // Réinitialise le formulaire
        setForm({
          societe: "",
          utilisateur: "",
          email: "",
          role: "Client",
          urgence: "",
          numero_commande: "",
          sla_cible: "",
          problematique: "",
          transporteur: "",
          description: "",
          fichiers_joints: "",
          priorite: "",
          type_action: "",
          delai_resolution: "",
          facturation: ""
        });
        // Callback si nécessaire
        if (onSuccess) onSuccess();
      } else {
        setMsg("❌ Erreur : " + (data.message || "Message inconnu"));
      }
    } catch (err) {
      console.error("TicketForm error:", err);
      setMsg("❌ Erreur réseau, merci de réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-6">
      <h2 className="text-2xl font-bold text-violet-800 mb-6 text-center">
        Créer un ticket de réclamation
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Société et Utilisateur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Société"
            name="societe"
            value={form.societe}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            placeholder="Nom utilisateur"
            name="utilisateur"
            value={form.utilisateur}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email et Numéro de commande */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            placeholder="N° de commande"
            name="numero_commande"
            value={form.numero_commande}
            onChange={handleChange}
            required
          />
        </div>

        {/* Transporteur, SLA, Urgence, Priorité */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="input"
            placeholder="Transporteur"
            name="transporteur"
            value={form.transporteur}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="SLA cible"
            name="sla_cible"
            value={form.sla_cible}
            onChange={handleChange}
          />
          <select
            className="input"
            name="urgence"
            value={form.urgence}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner l&apos;urgence</option>
            <option value="Faible">Faible</option>
            <option value="Normale">Normale</option>
            <option value="Haute">Haute</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Priorité"
            name="priorite"
            value={form.priorite}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Type d&apos;action"
            name="type_action"
            value={form.type_action}
            onChange={handleChange}
          />
        </div>

        {/* Problématique et Description */}
        <textarea
          className="input"
          placeholder="Problématique (résumé)"
          name="problematique"
          value={form.problematique}
          onChange={handleChange}
          required
        />
        <textarea
          className="input"
          placeholder="Description détaillée"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        {/* Fichiers joints */}
        <input
          className="input"
          placeholder="Lien fichier joint (Drive, Dropbox, etc.)"
          name="fichiers_joints"
          value={form.fichiers_joints}
          onChange={handleChange}
        />

        {/* Délai résolution et Facturation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Délai de résolution"
            name="delai_resolution"
            value={form.delai_resolution}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Facturation (coût indicatif)"
            name="facturation"
            value={form.facturation}
            onChange={handleChange}
          />
        </div>

        {/* Bouton d’envoi */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-violet-700 hover:to-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Créer le ticket"}
        </button>

        {/* Message de retour */}
        {msg && (
          <div
            className={`mt-3 text-center font-semibold ${
              msg.startsWith("❌") || msg.startsWith("Erreur")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {msg}
          </div>
        )}
      </form>

      {/* Styles locaux pour les inputs */}
      <style jsx>{`
        .input {
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          width: 100%;
          background: #f9f9fb;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s, background 0.2s;
        }
        .input:focus {
          border-color: #7c3aed;
          background: #fff;
        }
      `}</style>
    </div>
  );
}
