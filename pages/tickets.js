import { useEffect, useState } from "react";

// URL de ton worker Cloudflare
const API_URL = "https://billowing-base-6a8c.oneoffsas.workers.dev/";

const TRANSPORTEURS = [
  "", "Colissimo", "Chronopost", "Mondial Relay", "GLS", "DPD", "Autre"
];
const PROBLEMES = [
  "", "Colis perdu", "Colis endommagé", "Non reçu", "Erreur de préparation", "Erreur réception", "Produit endommagé", "Affrètement", "Autre"
];
const STATUTS = [
  "En cours", "Traitée", "Remboursé", "En attente", "Réclamation transporteur"
];

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    urgence: false,
    numero_commande: "",
    problematique: "",
    transporteur: "",
    description: "",
  });
  const [msg, setMsg] = useState("");
  const [chargement, setChargement] = useState(false);

  // Données utilisateur depuis le localStorage
  const email = (typeof window !== "undefined") ? localStorage.getItem("userEmail") : "";
  const role = (typeof window !== "undefined") ? localStorage.getItem("userRole") : "";
  const societe = (typeof window !== "undefined") ? localStorage.getItem("userSociete") : "";

  // Chargement des tickets à l'ouverture
  useEffect(() => {
    if (email) {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getTickets", email, role }),
      })
        .then(r => r.json())
        .then(data => setTickets(data.tickets || []))
        .catch(() => setMsg("Erreur de chargement des tickets"));
    }
  }, [showForm]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setChargement(true);
    setMsg("Création du ticket...");
    // Données pour le ticket
    const data = {
      action: "createTicket",
      societe,
      utilisateur: email,
      email,
      role,
      urgence: form.urgence ? "Oui" : "Non",
      numero_commande: form.numero_commande,
      problematique: form.problematique,
      transporteur: form.transporteur,
      description: form.description,
      // Ajoute ici d'autres champs si tu en as besoin !
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.status === "success") {
        setMsg("Ticket créé avec succès !");
        setForm({ urgence: false, numero_commande: "", problematique: "", transporteur: "", description: "" });
        setShowForm(false);
      } else {
        setMsg("Erreur : " + resData.message);
      }
    } catch (e) {
      setMsg("Erreur réseau, merci de réessayer.");
    }
    setChargement(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-violet-600 to-blue-500 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-violet-800">Mes tickets</h2>
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 shadow hover:bg-blue-700 font-semibold"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Fermer le formulaire" : "Nouveau ticket"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-violet-50 p-6 rounded-xl mb-6 shadow animate-fade-in">
            <div className="flex gap-4 flex-wrap mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="urgence"
                  checked={form.urgence}
                  onChange={handleChange}
                />
                <span>Urgent</span>
              </label>
              {form.urgence && (
                <span className="text-red-600 font-semibold bg-yellow-100 rounded px-2 py-1">
                  ⚠ Service prioritaire facturé 5 € – traitement express
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mb-2">
              <input className="border p-2 rounded w-full sm:w-1/2" placeholder="N° de commande" name="numero_commande" value={form.numero_commande} onChange={handleChange} required={form.urgence} />
              <select className="border p-2 rounded w-full sm:w-1/2" name="problematique" value={form.problematique} onChange={handleChange} required>
                {PROBLEMES.map(opt => <option key={opt} value={opt}>{opt ? opt : "Problématique*"}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-4 mb-2">
              <select className="border p-2 rounded w-full sm:w-1/2" name="transporteur" value={form.transporteur} onChange={handleChange} required>
                {TRANSPORTEURS.map(opt => <option key={opt} value={opt}>{opt ? opt : "Transporteur*"}</option>)}
              </select>
              <textarea className="border p-2 rounded w-full sm:w-1/2" name="description" value={form.description} onChange={handleChange} placeholder="Description du problème*" required />
            </div>
            <button
              className="bg-violet-700 hover:bg-violet-900 text-white px-5 py-2 rounded-lg font-bold shadow mt-2"
              type="submit"
              disabled={chargement}
            >
              {chargement ? "Envoi en cours..." : "Créer le ticket"}
            </button>
            {msg && <div className="mt-2 text-center text-red-600">{msg}</div>}
          </form>
        )}

        {/* Liste des tickets */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto text-sm border">
            <thead>
              <tr className="bg-violet-100 text-violet-800">
                <th className="p-2">N° Ticket</th>
                <th className="p-2">Date</th>
                <th className="p-2">Problème</th>
                <th className="p-2">Transporteur</th>
                <th className="p-2">Statut</th>
                <th className="p-2">Urgence</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 && (
                <tr><td colSpan={6} className="text-center p-4 text-gray-400">Aucun ticket pour le moment.</td></tr>
              )}
              {tickets.map((t) => (
                <tr key={t.id_ticket} className="hover:bg-violet-50">
                  <td className="p-2">{t.id_ticket}</td>
                  <td className="p-2">{t.date_ouverture}</td>
                  <td className="p-2">{t.problematique}</td>
                  <td className="p-2">{t.transporteur}</td>
                  <td className={`p-2 font-semibold ${t.statut === "En cours" ? "text-orange-500" : t.statut === "Traitée" ? "text-green-600" : "text-gray-700"}`}>{t.statut}</td>
                  <td className={`p-2 ${t.urgence === "Oui" ? "text-red-700 font-bold" : ""}`}>{t.urgence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

