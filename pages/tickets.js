import { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzM3_gHbhIQsDvQXRFP8fPGzfeDoEbCCkY8lxSpWxaXSopU0u1X6jP2LPTjz8XkSShDKg/exec";

export default function TicketsClient() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  // Si tu as une gestion d'utilisateur connecté
  const [email, setEmail] = useState(""); // À améliorer selon ton login
  const [role, setRole] = useState("Client");

  // Formulaire de création de ticket
  const [form, setForm] = useState({
    urgence: "Non",
    numero_commande: "",
    problematique: "",
    transporteur: "",
    description: "",
  });

  // Au montage, va chercher les tickets de cet utilisateur
  useEffect(() => {
    // Récupérer le mail stocké au login par exemple (ici on simule)
    const storedEmail = localStorage.getItem("userEmail") || "";
    setEmail(storedEmail);
    fetchTickets(storedEmail);
  }, []);

  async function fetchTickets(userEmail) {
    setLoading(true);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getTickets",
        email: userEmail,
        role,
      }),
    });
    const data = await res.json();
    if (data.status === "success") setTickets(data.tickets || []);
    else setMsg(data.message || "Erreur de chargement tickets");
    setLoading(false);
  }

  // Création de ticket
  async function handleCreateTicket(e) {
    e.preventDefault();
    setMsg("Création du ticket en cours...");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createTicket",
        email,
        role,
        ...form,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setMsg("Ticket créé !");
      fetchTickets(email);
      setForm({
        urgence: "Non",
        numero_commande: "",
        problematique: "",
        transporteur: "",
        description: "",
      });
    } else {
      setMsg(data.message || "Erreur lors de la création");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📄 Mes tickets</h2>

      {/* Création de ticket */}
      <form className="bg-white rounded shadow p-4 mb-8" onSubmit={handleCreateTicket}>
        <h3 className="font-semibold text-lg mb-2">Créer un ticket</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label>
            Urgent ?
            <select
              value={form.urgence}
              className="ml-2 border rounded p-1"
              onChange={e => setForm({ ...form, urgence: e.target.value })}
            >
              <option>Non</option>
              <option>Oui</option>
            </select>
            {form.urgence === "Oui" && (
              <span className="text-red-600 ml-2 font-bold">
                Attention, la demande sera traitée en priorité (facturé 5 €)
              </span>
            )}
          </label>
          <label>
            N° Commande
            <input
              type="text"
              className="border rounded w-full p-1"
              value={form.numero_commande}
              onChange={e => setForm({ ...form, numero_commande: e.target.value })}
              required={form.urgence === "Oui"}
            />
          </label>
          <label>
            Problématique
            <select
              className="border rounded w-full p-1"
              value={form.problematique}
              onChange={e => setForm({ ...form, problematique: e.target.value })}
            >
              <option value="">-- Sélectionner --</option>
              <option>Perte colis</option>
              <option>Colis endommagé</option>
              <option>Non reçu</option>
              <option>Erreur préparation</option>
              <option>Erreur réception</option>
              <option>Produit endommagé</option>
              <option>Demande d'affrètement</option>
              <option>Autre</option>
            </select>
          </label>
          <label>
            Transporteur
            <select
              className="border rounded w-full p-1"
              value={form.transporteur}
              onChange={e => setForm({ ...form, transporteur: e.target.value })}
            >
              <option value="">-- Sélectionner --</option>
              <option>Colissimo</option>
              <option>Chronopost</option>
              <option>GLS</option>
              <option>Mondial Relay</option>
              <option>DPD</option>
              <option>Autre</option>
            </select>
          </label>
        </div>
        <label className="block mt-3">
          Description
          <textarea
            className="border rounded w-full p-1 mt-1"
            rows={2}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>
        <button className="mt-4 px-5 py-2 bg-violet-600 text-white rounded hover:bg-violet-800 transition" type="submit">
          Créer le ticket
        </button>
        <span className="ml-4 text-sm text-gray-600">{msg}</span>
      </form>

      {/* Tableau des tickets */}
      <div className="bg-white rounded shadow p-4">
        <h4 className="font-semibold mb-2">Historique de mes tickets</h4>
        {loading ? (
          <div>Chargement…</div>
        ) : tickets.length === 0 ? (
          <div>Aucun ticket trouvé.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-1">ID</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Problème</th>
                <th>Urgence</th>
                <th>N° Cmd</th>
                <th>Transporteur</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id_ticket}>
                  <td className="p-1">{t.id_ticket}</td>
                  <td>
                    <span className={
                      t.statut === "Résolu" ? "text-green-700 font-bold" :
                      t.statut === "En cours" ? "text-orange-700 font-bold" :
                      "text-gray-700 font-bold"
                    }>
                      {t.statut}
                    </span>
                  </td>
                  <td>{t.date_ouverture}</td>
                  <td>{t.problematique}</td>
                  <td>{t.urgence}</td>
                  <td>{t.numero_commande}</td>
                  <td>{t.transporteur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

