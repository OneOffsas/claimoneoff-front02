// pages/admin.js
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Table, Button, Modal, Badge, Spinner, Row, Col, Card, Form } from "react-bootstrap";
import { getUser } from "../utils/auth";
import { useRouter } from "next/router";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/"; // ton endpoint

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
    } else if (u.role && u.role.toLowerCase() !== "admin") {
      router.replace("/dashboard");
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
        console.error("Erreur fetchTickets admin:", data);
      }
    } catch (err) {
      console.error("fetchTickets admin network error:", err);
    } finally {
      setLoading(false);
    }
  }

  const total = tickets.length;
  const enCours = tickets.filter(t => t.statut && t.statut.toLowerCase().includes("en cours")).length;
  const resolus = tickets.filter(t => t.statut && (t.statut.toLowerCase().includes("résolu") || t.statut.toLowerCase().includes("resolu"))).length;
  const rembourse = tickets.filter(t => t.statut && (t.statut.toLowerCase().includes("remboursé") || t.statut.toLowerCase().includes("rembourse"))).length;

  function getBadgeVariant(statut) {
    if (!statut) return "secondary";
    const s = statut.toLowerCase();
    if (s.includes("résolu") || s.includes("resolu")) return "success";
    if (s.includes("en cours") || s.includes("encours")) return "primary";
    if (s.includes("remboursé") || s.includes("rembourse")) return "warning";
    return "secondary";
  }

  async function handleChangeStatus(ticketId, newStatus) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatus", id_ticket: ticketId, statut: newStatus }),
      });
      const data = await res.json();
      if (data.status === "success") {
        fetchTickets(user);
        if (selectedTicket && selectedTicket.id_ticket === ticketId) {
          setSelectedTicket(prev => ({ ...prev, statut: newStatus, date_maj: new Date().toISOString() }));
        }
      } else {
        console.error("Erreur updateStatus:", data);
      }
    } catch (err) {
      console.error("updateStatus error:", err);
    }
  }

  return (
    <Layout>
      <h1 className="mb-4">Admin - Tous les Tickets</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total</Card.Title>
                  <Card.Text className="display-6">{total}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>En cours</Card.Title>
                  <Card.Text className="display-6">{enCours}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Résolus</Card.Title>
                  <Card.Text className="display-6">{resolus}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Remboursé</Card.Title>
                  <Card.Text className="display-6">{rembourse}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Email</th>
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
                  <td>{ticket.utilisateur}</td>
                  <td>{ticket.email}</td>
                  <td>{ticket.date_ouverture}</td>
                  <td>{ticket.urgence}</td>
                  <td>{ticket.problematique}</td>
                  <td>
                    <Badge bg={getBadgeVariant(ticket.statut)}>{ticket.statut}</Badge>
                  </td>
                  <td>
                    <Button size="sm" onClick={() => setSelectedTicket(ticket)}>Voir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
              <p><strong>Fichier joint :</strong>{" "}
                <a href={selectedTicket.fichiers_joints} target="_blank" rel="noopener noreferrer">
                  Voir le fichier
                </a>
              </p>
            )}
            <p>
              <strong>Statut :</strong>{" "}
              <Badge bg={getBadgeVariant(selectedTicket.statut)}>{selectedTicket.statut}</Badge>
            </p>
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
            <Form.Group className="mt-3">
              <Form.Label>Changer le statut :</Form.Label>
              <Form.Select
                defaultValue={selectedTicket.statut}
                onChange={e => handleChangeStatus(selectedTicket.id_ticket, e.target.value)}
              >
                <option value="En cours">En cours</option>
                <option value="Résolu">Résolu</option>
                <option value="Remboursé">Remboursé</option>
                <option value="En attente">En attente</option>
                <option value="Réclamation">Réclamation</option>
              </Form.Select>
            </Form.Group>
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

