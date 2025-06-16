// pages/createticket.js
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Form, Button, Alert, Card, Spinner, Modal } from "react-bootstrap";
import { getUser } from "@/utils/auth";
import { useRouter } from "next/router";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/"; // remplace

export default function CreateTicket() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [form, setForm] = useState({
    societe: "",
    utilisateur: "",
    email: "",
    role: "",
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
  const [msg, setMsg] = useState({ text: "", variant: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
    } else {
      setUser(u);
      // Pré-remplir certains champs
      setForm(prev => ({
        ...prev,
        societe: u.societe || "",
        utilisateur: u.nom + " " + u.prenom,
        email: u.email,
        role: u.role
      }));
    }
  }, [router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Afficher modal surcoût si urgence = "Haute"
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (form.urgence === "Haute") {
      setShowModal(true);
    }
  }, [form.urgence]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", variant: "" });
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createTicket", ...form }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg({ text: "Ticket créé avec succès !", variant: "success" });
        // Option: rediriger vers dashboard
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setMsg({ text: "Erreur : " + (data.message || "Inconnue"), variant: "danger" });
      }
    } catch (err) {
      console.error("CreateTicket error:", err);
      setMsg({ text: "Erreur réseau, réessayez.", variant: "danger" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="d-flex justify-content-center">
        <Card style={{ maxWidth: "700px", width: "100%" }} className="p-4">
          <h2 className="mb-4 text-center">Créer un Ticket</h2>
          {msg.text && <Alert variant={msg.variant}>{msg.text}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* Société, Utilisateur (readonly) */}
            <Form.Group className="mb-3">
              <Form.Label>Société</Form.Label>
              <Form.Control type="text" name="societe" value={form.societe} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Utilisateur</Form.Label>
              <Form.Control type="text" name="utilisateur" value={form.utilisateur} readOnly />
            </Form.Group>
            {/* Email, Role hidden */}
            <Form.Control type="hidden" name="email" value={form.email} />
            <Form.Control type="hidden" name="role" value={form.role} />

            <Form.Group className="mb-3">
              <Form.Label>Urgence</Form.Label>
              <Form.Select name="urgence" value={form.urgence} onChange={handleChange} required>
                <option value="">Sélectionner</option>
                <option value="Faible">Faible</option>
                <option value="Normale">Normale</option>
                <option value="Haute">Haute</option>
              </Form.Select>
            </Form.Group>
            {showModal && (
              <Modal show onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Urgence Haute</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  ⚠️ Vous avez choisi une urgence « Haute ». Ce service sera traité en priorité, surcoût indicatif de 5 €. 
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
                </Modal.Footer>
              </Modal>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Numéro de commande</Form.Label>
              <Form.Control
                type="text"
                name="numero_commande"
                value={form.numero_commande}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>SLA cible</Form.Label>
              <Form.Control
                type="text"
                name="sla_cible"
                value={form.sla_cible}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Problématique (titre)</Form.Label>
              <Form.Control
                type="text"
                name="problematique"
                value={form.problematique}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Transporteur</Form.Label>
              <Form.Control
                type="text"
                name="transporteur"
                value={form.transporteur}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description détaillée</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fichiers joints (lien)</Form.Label>
              <Form.Control
                type="text"
                name="fichiers_joints"
                value={form.fichiers_joints}
                onChange={handleChange}
                placeholder="URL Drive, Dropbox..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priorité</Form.Label>
              <Form.Control
                type="text"
                name="priorite"
                value={form.priorite}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type d’action souhaitée</Form.Label>
              <Form.Control
                type="text"
                name="type_action"
                value={form.type_action}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Délai de résolution souhaité</Form.Label>
              <Form.Control
                type="text"
                name="delai_resolution"
                value={form.delai_resolution}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Facturation (coût indicatif)</Form.Label>
              <Form.Control
                type="text"
                name="facturation"
                value={form.facturation}
                onChange={handleChange}
                placeholder="Par ex. 5 € si urgence"
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading} className="w-100">
              {loading ? <Spinner animation="border" size="sm" /> : "Créer le ticket"}
            </Button>
          </Card>
        </div>
      </Layout>
    );
}
