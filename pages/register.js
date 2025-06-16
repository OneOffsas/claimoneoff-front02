// pages/register.js
import { useState } from "react";
import Layout from "@/components/Layout";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { useRouter } from "next/router";
import { saveUser } from "@/utils/auth";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/"; // Remplace par ton endpoint

export default function Register() {
  const [societe, setSociete] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", variant: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", variant: "" });
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          societe,
          nom,
          prenom,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMsg({ text: "Compte créé ! Vous pouvez vous connecter.", variant: "success" });
        // Option: auto-login et redirect vers dashboard ? On peut simplement rediriger après quelques secondes
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setMsg({ text: "Erreur : " + (data.message || "Inconnue"), variant: "danger" });
      }
    } catch (err) {
      console.error("Register error:", err);
      setMsg({ text: "Erreur réseau, réessayez.", variant: "danger" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="d-flex justify-content-center">
        <Card style={{ maxWidth: "500px", width: "100%" }} className="p-4">
          <h2 className="mb-4 text-center">Créer un compte</h2>
          {msg.text && <Alert variant={msg.variant}>{msg.text}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formSociete">
              <Form.Label>Société</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom de la société"
                value={societe}
                onChange={e => setSociete(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ton nom"
                value={nom}
                onChange={e => setNom(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPrenom">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ton prénom"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ton email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading} className="w-100">
              {loading ? "Création en cours..." : "Créer mon compte"}
            </Button>
          </Form>
        </Card>
      </div>
    </Layout>
  );
}


