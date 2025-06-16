// pages/index.js
import Layout from "../components/Layout";
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function Home() {
  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <h1 className="mb-4">Bienvenue sur ClaimOneOff</h1>
        <div>
          <Button as={Link} href="/login" variant="primary" className="me-2">Se connecter</Button>
          <Button as={Link} href="/register" variant="success">Créer un compte</Button>
        </div>
      </div>
    </Layout>
  );
}
