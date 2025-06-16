// components/Layout.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, Container, Nav, Offcanvas, Button } from "react-bootstrap";
import { getUser, clearUser } from "../utils/auth";  // import relatif
import { useRouter } from "next/router";
import { Home, User, LogOut, LayoutDashboard, Ticket, Settings } from "lucide-react"; // icônes

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

  const isAdmin = user && user.role && user.role.toLowerCase() === "admin";

  return (
    <>
      <Navbar bg="light" expand={false} className="mb-4 shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} href="/" className="fw-bold d-flex align-items-center">
            <img src="/logo.png" alt="Logo" width="30" height="30" className="me-2" />
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
                    <Nav.Link as={Link} href="/dashboard" className="d-flex align-items-center">
                      <LayoutDashboard size={18} className="me-2" /> Tableau de bord
                    </Nav.Link>
                    <Nav.Link as={Link} href="/tickets" className="d-flex align-items-center">
                      <Ticket size={18} className="me-2" /> Mes Tickets
                    </Nav.Link>
                    <Nav.Link as={Link} href="/createticket" className="d-flex align-items-center">
                      <Ticket size={18} className="me-2" /> Créer Ticket
                    </Nav.Link>
                    {isAdmin && (
                      <>
                        <hr />
                        <Nav.Link as={Link} href="/admin" className="d-flex align-items-center">
                          <Settings size={18} className="me-2" /> Admin - Tous Tickets
                        </Nav.Link>
                        <Nav.Link as={Link} href="/admin/stats" className="d-flex align-items-center">
                          <Settings size={18} className="me-2" /> Admin - Statistiques
                        </Nav.Link>
                      </>
                    )}
                    <hr />
                    <Button variant="outline-danger" size="sm" onClick={handleLogout} className="mt-2">
                      <LogOut size={16} className="me-1" /> Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} href="/" className="d-flex align-items-center">
                      <Home size={18} className="me-2" /> Accueil
                    </Nav.Link>
                    <Nav.Link as={Link} href="/login" className="d-flex align-items-center">
                      <User size={18} className="me-2" /> Se connecter
                    </Nav.Link>
                    <Nav.Link as={Link} href="/register" className="d-flex align-items-center">
                      <User size={18} className="me-2" /> Créer un compte
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <Container fluid>{children}</Container>
    </>
  );
}
