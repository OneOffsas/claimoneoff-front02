import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { CircleCheck, CircleAlert, LoaderCircle, Ticket, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    setLoading(true);
    try {
      // Ex : appel à ton API
      setTickets([
        {
          id: "TCKT_12345",
          utilisateur: "Sophie Dupont",
          email: "sophie@entreprise.com",
          date_ouverture: "2025-06-16 09:00",
          statut: "En cours",
          urgence: "Haute",
          sujet: "Colis perdu",
          description: "Le colis n&apos;est pas arrivé.",
          transporteur: "Colissimo",
        },
        {
          id: "TCKT_67890",
          utilisateur: "Yann Martin",
          email: "yann@autre.fr",
          date_ouverture: "2025-06-14 15:12",
          statut: "Résolu",
          urgence: "Normale",
          sujet: "Retard livraison",
          description: "Livraison annoncée mais rien reçu.",
          transporteur: "Chronopost",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const kpiTotal = tickets.length;
  const kpiEnCours = tickets.filter(t => t.statut === "En cours").length;
  const kpiResolu = tickets.filter(t => t.statut === "Résolu").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={() => { window.location.href = "/login"; }} />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold text-violet-800 mb-6">Admin - Gestion des Tickets</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg flex items-center p-6">
            <Ticket className="text-violet-600 mr-4" size={32} />
            <div>
              <div className="text-2xl font-bold">{kpiTotal}</div>
              <div className="text-gray-500">Tickets total</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg flex items-center p-6">
            <LoaderCircle className="text-blue-500 mr-4" size={32} />
            <div>
              <div className="text-2xl font-bold">{kpiEnCours}</div>
              <div className="text-gray-500">En cours</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg flex items-center p-6">
            <CircleCheck className="text-green-500 mr-4" size={32} />
            <div>
              <div className="text-2xl font-bold">{kpiResolu}</div>
              <div className="text-gray-500">Résolus</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-violet-800 flex items-center">
              <Ticket className="mr-2" /> Tous les tickets
            </div>
            <button
              className="bg-violet-700 text-white px-4 py-2 rounded-xl hover:bg-violet-900 transition"
              onClick={() => fetchTickets()}
            >
              Rafraîchir
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-violet-600 to-blue-500 text-white">
                    <th className="p-2">ID</th>
                    <th className="p-2">Utilisateur</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Ouverture</th>
                    <th className="p-2">Statut</th>
                    <th className="p-2">Urgence</th>
                    <th className="p-2">Sujet</th>
                    <th className="p-2">Transporteur</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="p-2 font-mono">{ticket.id}</td>
                      <td className="p-2">{ticket.utilisateur}</td>
                      <td className="p-2">{ticket.email}</td>
                      <td className="p-2">{ticket.date_ouverture}</td>
                      <td className="p-2">
                        {ticket.statut === "Résolu" ? (
                          <span className="text-green-600 font-bold">Résolu</span>
                        ) : ticket.statut === "En cours" ? (
                          <span className="text-blue-600 font-bold">En cours</span>
                        ) : (
                          <span className="text-orange-500 font-bold">{ticket.statut}</span>
                        )}
                      </td>
                      <td className="p-2">{ticket.urgence}</td>
                      <td className="p-2">{ticket.sujet}</td>
                      <td className="p-2">{ticket.transporteur}</td>
                      <td className="p-2">
                        <button
                          className="text-violet-700 font-bold hover:underline"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full relative animate-fade-in-up">
              <button
                onClick={() => setSelectedTicket(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-red-400 text-2xl"
                title="Fermer"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-violet-700 flex items-center">
                <Ticket className="mr-2" /> Ticket {selectedTicket.id}
              </h2>
              <div className="mb-2"><b>Utilisateur :</b> {selectedTicket.utilisateur}</div>
              <div className="mb-2"><b>Email :</b> {selectedTicket.email}</div>
              <div className="mb-2"><b>Date d’ouverture :</b> {selectedTicket.date_ouverture}</div>
              <div className="mb-2"><b>Sujet :</b> {selectedTicket.sujet}</div>
              <div className="mb-2"><b>Description :</b> {selectedTicket.description}</div>
              <div className="mb-2"><b>Statut :</b> {selectedTicket.statut}</div>
              <div className="mb-2"><b>Urgence :</b> {selectedTicket.urgence}</div>
              <div className="mb-2"><b>Transporteur :</b> {selectedTicket.transporteur}</div>
              <button
                className="mt-6 w-full py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-violet-800 transition"
                onClick={() => setSelectedTicket(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

