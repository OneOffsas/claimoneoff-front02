// pages/login.js
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { useRouter } from "next/router";
import { saveUser, getUser } from "../utils/auth";

const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/"; // ton endpoint

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", variant: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    if (u) {
      if (u.role && u.role.toLowerCase() === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", variant: "" });
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email,
          password
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        saveUser(data);
        if (data.role && data.role.toLowerCase() === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setMsg({ text: "Erreur : " + (data.message || "Email ou mot de passe incorrect"), variant: "danger" });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMsg({ text: "Erreur réseau, réessayez.", variant: "danger" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="d-flex justify-content-center">
        <Card style={{ maxWidth: "400px", width: "100%" }} className="p-4">
          <h2 className="mb-4 text-center">Se connecter</h2>
          {msg.text && <Alert variant={msg.variant}>{msg.text}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ton email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
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
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <a href="/forgot">Mot de passe oublié ?</a>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

