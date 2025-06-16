// components/Layout.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, Container, Nav, Offcanvas, NavDropdown, Button } from "react-bootstrap";
import { getUser, clearUser } from "@/utils/auth";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  function handleLogout() {
    clearUser();
    router.push("/login");
  }

  // Déterminer si admin pour afficher certains liens
  const isAdmin = user && user.role && user.role.toLowerCase() === "admin";

  return (
    <>
      {/* Navbar en haut */}
      <Navbar bg="light" expand={false} className="mb-4 shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} href="/" className="fw-bold">
            {/* Logo si tu as /public/logo.png */}
            <img src="/logo.png" alt="Logo" width="30" height="30" className="d-inline-block align-top me-2" />
            ClaimOneOff
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column">
                {user ? (
                  <>
                    {/* Liens communs */}
                    <Nav.Link as={Link} href="/dashboard">Tableau de bord</Nav.Link>
                    <Nav.Link as={Link} href="/tickets">Mes Tickets</Nav.Link>
                    <Nav.Link as={Link} href="/createticket">Créer Ticket</Nav.Link>
                    {isAdmin && (
                      <>
                        <hr />
                        <Nav.Link as={Link} href="/admin">Admin - Tous Tickets</Nav.Link>
                        <Nav.Link as={Link} href="/admin/stats">Admin - Statistiques</Nav.Link>
                      </>
                    )}
                    <hr />
                    <Button variant="outline-danger" size="sm" onClick={handleLogout}>Déconnexion</Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} href="/login">Se connecter</Nav.Link>
                    <Nav.Link as={Link} href="/register">Créer un compte</Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Contenu principal */}
      <Container fluid>
        {children}
      </Container>
    </>
  );
}
