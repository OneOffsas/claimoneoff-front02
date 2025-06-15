import { useEffect, useState, useRef } from "react";
import { apiCall } from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const menuItems = [
  { label: "Mes tickets", icon: "📋", key: "tickets" },
  { label: "Statistiques", icon: "📊", key: "stats" },
  { label: "Créer un ticket", icon: "➕", key: "create" }
];

const TRANSPORTEURS = [
  "Colissimo", "Chronopost", "Mondial Relay", "GLS", "DPD", "Autre"
];

const PROBLEMES = [
  "Perte de colis", "Colis endommagé", "Non reçu", "Erreur de préparation",
  "Erreur de réception", "Produit endommagé", "Autre"
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("tickets");
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [msg, setMsg] = useState("");
  const [notif, setNotif] = useState("");
  const [ticketForm, setTicketForm] = useState({
    urgence: false, numero_commande: "", problematique: "",
    transporteur: "", description: "", fichiers_joints: null
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [discussionInput, setDiscussionInput] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    // Récupère l'utilisateur du localStorage
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) window.location = "/login";
    setUser(u);

    loadTickets(u);
    // eslint-disable-next-line
  }, []);

  async function loadTickets(u) {
    setMsg("Chargement...");
    const res = await apiCall("getTickets", { email: u?.email, role: u?.role });
    if (res.status === "success") {
      setTickets(res.tickets || []);
      setStats({
        total: res.tickets.length,
        enCours: res.tickets.filter(t => t.statut === "En cours").length,
        traite: res.tickets.filter(t => t.statut === "Traité").length,
        rembourse: res.tickets.filter(t => t.statut === "Remboursé").length,
      });
      setMsg("");
    } else {
      setMsg("Erreur lors du chargement des tickets.");
    }
  }

  function handleTicketChange(e) {
    const { name, value, type, checked, files } = e.target;
    setTicketForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : (type === "file" ? files[0] : value)
    }));
  }

  async function handleTicketSubmit(e) {
    e.preventDefault();
    setMsg("Création du ticket...");
    let fileUrl = "";
    if (ticketForm.fichiers_joints) {
      // Encode fichier en base64 (simple, pour Google Sheets)
      fileUrl = await toBase64(ticketForm.fichiers_joints);
    }
    const data = {
      societe: user.societe,
      utilisateur: user.nom + " " + user.prenom,
      email: user.email,
      role: user.role,
      urgence: ticketForm.urgence ? "Oui" : "Non",
      numero_commande: ticketForm.urgence ? ticketForm.numero_commande : "",
      sla_cible: ticketForm.urgence ? "Prioritaire" : "Standard",
      problematique: ticketForm.problematique,
      transporteur: ticketForm.transporteur,
      description: ticketForm.description,
      fichiers_joints: fileUrl,
      priorite: ticketForm.urgence ? "Haute" : "Normale",
      type_action: "",
      delai_resolution: "",
      facturation: ticketForm.urgence ? "5€" : "0€",
    };
    const res = await apiCall("createTicket", data);
    if (res.status === "success") {
      setMsg("✅ Ticket créé !");
      setTicketForm({ urgence: false, numero_commande: "", problematique: "", transporteur: "", description: "", fichiers_joints: null });
      fileInputRef.current.value = null;
      loadTickets(user);
      setView("tickets");
      setNotif("Nouveau ticket créé !");
      setTimeout(() => setNotif(""), 3500);
    } else {
      setMsg("Erreur : " + res.message);
    }
  }

  async function openTicket(t) {
    setSelectedTicket(null);
    setView("tickets");
    // Recharge le ticket depuis l’API pour avoir la discussion à jour
    const res = await apiCall("getTickets", { email: user.email, role: user.role });
    if (res.status === "success") {
      const ticket = res.tickets.find(tt => tt.id_ticket === t.id_ticket);
      setSelectedTicket(ticket);
      setView("detail");
    }
  }

  async function handleAddDiscussion(e) {
    e.preventDefault();
    setMsg("Ajout du message...");
    const res = await apiCall("addDiscussion", {
      id_ticket: selectedTicket.id_ticket,
      utilisateur: user.nom + " " + user.prenom,
      commentaire: discussionInput
    });
    if (res.status === "success") {
      setDiscussionInput("");
      openTicket(selectedTicket);
      setNotif("Message envoyé !");
      setTimeout(() => setNotif(""), 3500);
    } else {
      setMsg("Erreur discussion : " + res.message);
    }
  }

  // Fichier → base64
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Menus et notifications
  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-violet-700 to-blue-600">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-2xl rounded-tr-3xl rounded-br-3xl flex flex-col p-6 justify-between min-h-full animate-fade-in">
        <div>
          <div className="flex flex-col items-center mb-10">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-2" />
            <div className="font-extrabold text-xl text-violet-800 mb-2">ClaimOneOff</div>
            <div className="text-gray-500">{user && user.nom}</div>
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition ${view === item.key ? "bg-gradient-to-r from-violet-700 to-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}
                  onClick={() => setView(item.key)}
                >
                  <span className="text-2xl">{item.icon}</span> {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-gray-400 mt-12">v1.0 – Utilisateur</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {notif && (
          <div className="fixed top-10 right-10 bg-green-500 text-white px-8 py-3 rounded-2xl shadow-xl animate-fade-in text-lg z-50">
            {notif}
          </div>
        )}

        {/* Liste des tickets */}
        {view === "tickets" && (
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-8">📋 Mes tickets</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-xl">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-3">ID</th>
                    <th>Statut</th>
                    <th>Problème</th>
                    <th>Urgence</th>
                    <th>Transporteur</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, idx) => (
                    <tr key={t.id_ticket} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2">{t.id_ticket}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          t.statut === "En cours" ? "bg-yellow-100 text-yellow-800" :
                          t.statut === "Traité" ? "bg-green-100 text-green-800" :
                          t.statut === "Remboursé" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-200 text-gray-600"
                        }`}>{t.statut}</span>
                      </td>
                      <td>{t.problematique}</td>
                      <td>
                        {t.urgence === "Oui" &&
                          <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold mr-2">Urgent</span>
                        }
                        {t.urgence === "Non" && <span className="text-xs text-gray-400">Normal</span>}
                      </td>
                      <td>{t.transporteur}</td>
                      <td>{t.date_ouverture}</td>
                      <td>{t.description}</td>
                      <td>
                        <button className="text-violet-800 underline font-bold" onClick={() => openTicket(t)}>Détail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tickets.length === 0 && (
                <div className="text-center text-gray-500 p-8">Aucun ticket pour le moment.</div>
              )}
            </div>
          </div>
        )}

        {/* Statistiques */}
        {view === "stats" && (
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-8">📊 Mes statistiques</h1>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
                <span className="text-xl font-bold text-violet-700">{stats.total}</span>
                <span className="text-gray-600">Total tickets</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
                <span className="text-xl font-bold text-yellow-700">{stats.enCours}</span>
                <span className="text-gray-600">En cours</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
                <span className="text-xl font-bold text-green-700">{stats.traite}</span>
                <span className="text-gray-600">Traités</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { name: "En cours", value: stats.enCours || 0 },
                  { name: "Traités", value: stats.traite || 0 },
                  { name: "Remboursés", value: stats.rembourse || 0 }
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Création d'un ticket */}
        {view === "create" && (
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-8">➕ Créer un nouveau ticket</h1>
            <form onSubmit={handleTicketSubmit} className="bg-white p-8 rounded-xl shadow-2xl max-w-lg">
              <div className="mb-4">
                <label className="font-bold block mb-2">Problématique</label>
                <select name="problematique" required value={ticketForm.problematique} onChange={handleTicketChange} className="border rounded p-2 w-full">
                  <option value="">Sélectionnez...</option>
                  {PROBLEMES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="font-bold block mb-2">Transporteur</label>
                <select name="transporteur" required value={ticketForm.transporteur} onChange={handleTicketChange} className="border rounded p-2 w-full">
                  <option value="">Sélectionnez...</option>
                  {TRANSPORTEURS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="font-bold block mb-2">Description</label>
                <textarea name="description" required className="border rounded p-2 w-full" rows={3} value={ticketForm.description} onChange={handleTicketChange} placeholder="Décrivez le problème…" />
              </div>
              <div className="mb-4 flex items-center">
                <input type="checkbox" name="urgence" checked={ticketForm.urgence} onChange={handleTicketChange} id="urgence" className="mr-2" />
                <label htmlFor="urgence" className="font-bold">Demande urgente</label>
                {ticketForm.urgence && (
                  <span className="ml-3 px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-bold animate-pulse">
                    +5 € (prise en charge prioritaire, numéro de commande requis)
                  </span>
                )}
              </div>
              {ticketForm.urgence && (
                <div className="mb-4">
                  <label className="font-bold block mb-2">Numéro de commande (obligatoire)</label>
                  <input
                    type="text"
                    name="numero_commande"
                    required
                    value={ticketForm.numero_commande}
                    onChange={handleTicketChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="font-bold block mb-2">Fichier joint (PDF, image...)</label>
                <input
                  type="file"
                  name="fichiers_joints"
                  accept="image/*,application/pdf"
                  ref={fileInputRef}
                  onChange={handleTicketChange}
                  className="block"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-violet-700 to-blue-600 text-white py-3 rounded-xl font-bold shadow-xl mt-4 hover:scale-105 transition">
                Envoyer le ticket
              </button>
              {msg && <div className="text-center mt-3 text-violet-700">{msg}</div>}
            </form>
          </div>
        )}

        {/* Détail ticket + discussion */}
        {view === "detail" && selectedTicket && (
          <div>
            <button onClick={() => setView("tickets")} className="mb-4 text-white font-bold">&larr; Retour à la liste</button>
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-extrabold text-violet-800 mb-2">Ticket #{selectedTicket.id_ticket}</h2>
              <div className="mb-4">
                <span className="px-3 py-1 bg-violet-700 text-white rounded-xl mr-3 font-bold">{selectedTicket.statut}</span>
                <span className="text-gray-700">{selectedTicket.problematique} – {selectedTicket.transporteur}</span>
                {selectedTicket.urgence === "Oui" && <span className="ml-3 px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-bold animate-pulse">Urgent</span>}
              </div>
              <div className="mb-2"><b>Description :</b> {selectedTicket.description}</div>
              {selectedTicket.fichiers_joints && <div className="mb-2"><b>Fichier :</b> <a href={selectedTicket.fichiers_joints} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">

