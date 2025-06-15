import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const API_URL = "https://script.google.com/macros/s/AKfycbz4oaV2F4-DeHC4-oYaR8wiTgha1ROTXN1WAMQT9H72SPI6b1NCtlClxZ8WwR0f6rZ9lg/exec";

// Simule une "auth" ultra basique locale (dans la vraie vie : utiliser des tokens)
function getUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("user_claimoneoff"));
  } catch {
    return null;
  }
}
function saveUser(user) {
  localStorage.setItem("user_claimoneoff", JSON.stringify(user));
}

function formatDate(d) {
  if (!d) return "";
  if (d.includes("/")) return d;
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR") + " " + date.toLocaleTimeString("fr-FR");
}

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [commentaire, setCommentaire] = useState("");
  const [msg, setMsg] = useState("");
  const [stats, setStats] = useState({ total: 0, enCours: 0, clos: 0, urgent: 0 });
  const router = useRouter();

  // Contrôle accès : redirige si pas connecté
  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "Admin") {
      router.push("/admin");
      return;
    }
    loadTickets(user);
  }, []);

  function loadTickets(user = getUser()) {
    setMsg("Chargement...");
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getTickets",
        email: user.email,
        role: user.role,
      }),
    })
      .then(r => r.json())
      .then(data => {
        setTickets(data.tickets || []);
        setStats({
          total: (data.tickets || []).length,
          enCours: (data.tickets || []).filter(t => t.statut?.toLowerCase().includes("cours")).length,
          clos: (data.tickets || []).filter(t => t.statut?.toLowerCase().includes("clos")).length,
          urgent: (data.tickets || []).filter(t => (t.urgence || "").toLowerCase().includes("oui")).length,
        });
        setMsg("");
      })
      .catch(() => setMsg("Erreur de chargement"));
  }

  async function addDiscussion() {
    if (!selectedTicket || !commentaire.trim()) return;
    setMsg("Ajout du commentaire...");
    try {
      const user = getUser();
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addDiscussion",
          id_ticket: selectedTicket.id_ticket,
          utilisateur: user.nom || user.email,
          commentaire,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setCommentaire("");
        loadTickets();
        setMsg("Commentaire ajouté");
        setTimeout(() => setMsg(""), 1000);
      }
    } catch (e) {
      setMsg("Erreur");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-violet-600 to-blue-500">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl rounded-tr-3xl rounded-br-3xl p-6 flex flex-col items-center sticky top-0 z-10 animate-slide-in-left">
        <img src="/logo.png" alt="ClaimOneOff" className="mb-6 w-20" />
        <h2 className="font-bold text-xl text-violet-700 mb-6">Espace Client</h2>
        <nav className="flex flex-col gap-2 w-full">
          <a className="py-2 px-4 rounded-xl hover:bg-violet-100 font-semibold transition" href="#tickets">Mes tickets</a>
          <a className="py-2 px-4 rounded-xl hover:bg-violet-100 font-semibold transition" href="#stats">Mes stats</a>
          <a className="py-2 px-4 rounded-xl hover:bg-violet-100 font-semibold transition" href="/" onClick={() => {localStorage.clear();}}>Déconnexion</a>
        </nav>
      </aside>
      {/* Main */}
      <main className="flex-1 p-8 bg-gray-50 rounded-tl-3xl min-h-screen">
        <section id="stats" className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-violet-700">Mes KPIs</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <span className="text-lg text-gray-500">Tickets total</span>
              <span className="text-3xl text-violet-700 font-bold">{stats.total}</span>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <span className="text-lg text-gray-500">En cours</span>
              <span className="text-3xl text-blue-700 font-bold">{stats.enCours}</span>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <span className="text-lg text-gray-500">Clôturés</span>
              <span className="text-3xl text-green-600 font-bold">{stats.clos}</span>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <span className="text-lg text-gray-500">Urgents</span>
              <span className="text-3xl text-red-600 font-bold">{stats.urgent}</span>
            </div>
          </div>
        </section>

        <section id="tickets">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-violet-700">Mes tickets</h3>
            <button
              className="bg-violet-600 hover:bg-violet-800 text-white px-4 py-2 rounded-xl shadow transition"
              onClick={loadTickets}
            >
              Rafraîchir
            </button>
          </div>
          {msg && <div className="mb-2 text-center text-red-500">{msg}</div>}
          <div className="overflow-x-auto shadow rounded-xl bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-violet-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Urgence</th>
                  <th className="p-3">Transporteur</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-6">Aucun ticket</td>
                  </tr>
                ) : (
                  tickets.map(t => (
                    <tr key={t.id_ticket} className="hover:bg-violet-50 transition cursor-pointer border-b" onClick={() => setSelectedTicket(t)}>
                      <td className="p-3">{t.id_ticket}</td>
                      <td className="p-3">{formatDate(t.date_ouverture)}</td>
                      <td className="p-3">{t.statut}</td>
                      <td className="p-3">{t.urgence}</td>
                      <td className="p-3">{t.transporteur}</td>
                      <td className="p-3">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-xl text-xs hover:bg-blue-800 transition">Voir</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Popup détail ticket */}
      {selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative shadow-xl">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
              onClick={() => setSelectedTicket(null)}
              title="Fermer"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-violet-700">Détail du ticket</h2>
            <div className="mb-2"><b>ID :</b> {selectedTicket.id_ticket}</div>
            <div className="mb-2"><b>Date d'ouverture :</b> {formatDate(selectedTicket.date_ouverture)}</div>
            <div className="mb-2"><b>Statut :</b> {selectedTicket.statut}</div>
            <div className="mb-2"><b>Priorité :</b> {selectedTicket.priorite}</div>
            <div className="mb-2"><b>Urgence :</b> {selectedTicket.urgence}</div>
            <div className="mb-2"><b>Numéro de commande :</b> {selectedTicket.numero_commande}</div>
            <div className="mb-2"><b>Problématique :</b> {selectedTicket.problematique}</div>
            <div className="mb-2"><b>Transporteur :</b> {selectedTicket.transporteur}</div>
            <div className="mb-2"><b>Description :</b> {selectedTicket.description}</div>
            {selectedTicket.fichiers_joints && (
              <div className="mb-2">
                <b>Fichier :</b>{" "}
                <a
                  href={selectedTicket.fichiers_joints}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700"
                >
                  Voir le fichier
                </a>
              </div>
            )}
            <div className="mb-2">
              <b>Discussion :</b>
              <pre className="bg-gray-100 rounded p-2 mt-1 text-xs max-h-40 overflow-auto">
                {selectedTicket.discussion}
              </pre>
            </div>
            {/* Ajouter un commentaire */}
            <div className="mt-4">
              <textarea
                className="border p-2 rounded w-full mb-2"
                rows={2}
                value={commentaire}
                onChange={e => setCommentaire(e.target.value)}
                placeholder="Ajouter un commentaire (visible à tous les utilisateurs de ce ticket)"
              />
              <button
                onClick={addDiscussion}
                className="bg-violet-600 hover:bg-violet-800 text-white px-6 py-2 rounded-xl shadow transition"
                disabled={!commentaire.trim()}
              >
                Ajouter le commentaire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
