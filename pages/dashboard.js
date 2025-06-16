// pages/dashboard.js
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Table, Button, Modal, Badge, Spinner } from "react-bootstrap";
import { getUser } from "../utils/auth";
import { useRouter } from "next/router";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/"; // ton endpoint

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
    } else {
      setUser(u);
      fetchTickets(u);
    }
  }, [router]);

  async function fetchTickets(u) {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getTickets", email: u.email, role: u.role }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setTickets(data.tickets || []);
      } else {
        console.error("Erreur fetchTickets:", data);
      }
    } catch (err) {
      console.error("fetchTickets network error:", err);
    } finally {
      setLoading(false);
    }
  }

  function getBadgeVariant(statut) {
    if (!statut) return "secondary";
    const s = statut.toLowerCase();
    if (s.includes("résolu") || s.includes("resolu")) return "success";
    if (s.includes("en cours") || s.includes("encours")) return "primary";
    if (s.includes("remboursé") || s.includes("rembourse")) return "warning";
    return "secondary";
  }

  return (
    <Layout>
      <h1 className="mb-4">Mes Tickets</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="mb-3">
            <Button variant="success" onClick={() => router.push("/createticket")}>
              Créer un ticket
            </Button>
          </div>
          {tickets.length === 0 ? (
            <p>Aucun ticket trouvé.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date ouverture</th>
                  <th>Urgence</th>
                  <th>Sujet</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id_ticket}>
                    <td className="font-monospace">{ticket.id_ticket}</td>
                    <td>{ticket.date_ouverture}</td>
                    <td>{ticket.urgence}</td>
                    <td>{ticket.problematique}</td>
                    <td>
                      <Badge bg={getBadgeVariant(ticket.statut)}>{ticket.statut}</Badge>
                    </td>
                    <td>
                      <Button size="sm" onClick={() => setSelectedTicket(ticket)}>
                        Voir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      {selectedTicket && (
        <Modal show onHide={() => setSelectedTicket(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Ticket {selectedTicket.id_ticket}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Utilisateur :</strong> {selectedTicket.utilisateur}</p>
            <p><strong>Email :</strong> {selectedTicket.email}</p>
            <p><strong>Date ouverture :</strong> {selectedTicket.date_ouverture}</p>
            <p><strong>Urgence :</strong> {selectedTicket.urgence}</p>
            <p><strong>Numéro commande :</strong> {selectedTicket.numero_commande}</p>
            <p><strong>SLA cible :</strong> {selectedTicket.sla_cible}</p>
            <p><strong>Problématique :</strong> {selectedTicket.problematique}</p>
            <p><strong>Transporteur :</strong> {selectedTicket.transporteur}</p>
            <p><strong>Description :</strong> {selectedTicket.description}</p>
            {selectedTicket.fichiers_joints && (
              <p>
                <strong>Fichier joint :</strong>{" "}
                <a href={selectedTicket.fichiers_joints} target="_blank" rel="noopener noreferrer">
                  Voir le fichier
                </a>
              </p>
            )}
            <p><strong>Statut :</strong> {selectedTicket.statut}</p>
            <p><strong>Date MAJ :</strong> {selectedTicket.date_maj}</p>
            <p><strong>Priorité :</strong> {selectedTicket.priorite}</p>
            <p><strong>Type action :</strong> {selectedTicket.type_action}</p>
            <p><strong>Délai résolution :</strong> {selectedTicket.delai_resolution}</p>
            <p><strong>Facturation :</strong> {selectedTicket.facturation}</p>
            {selectedTicket.discussion && (
              <div className="mt-3">
                <h5>Discussion</h5>
                <pre style={{ whiteSpace: "pre-wrap", background: "#f8f9fa", padding: "10px" }}>
                  {selectedTicket.discussion}
                </pre>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedTicket(null)}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Layout>
  );
}
