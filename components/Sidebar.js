import Link from "next/link";

export default function Sidebar({ role, active }) {
  // 'role' = "Admin" ou "Client"
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark h-100" style={{width: "240px", minHeight:"100vh", borderTopRightRadius:22}}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4 fw-bold" style={{letterSpacing:2}}>ClaimOneOff</span>
      </a>
      <hr/>
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link href={role === "Admin" ? "/admin-dashboard" : "/dashboard"}>
            <a className={"nav-link text-white" + (active === "dashboard" ? " active bg-gradient" : "")}>
              <i className="bi bi-house-door-fill me-2"/>Tableau de bord
            </a>
          </Link>
        </li>
        <li>
          <Link href={role === "Admin" ? "/tickets-admin" : "/tickets"}>
            <a className={"nav-link text-white" + (active === "tickets" ? " active bg-gradient" : "")}>
              <i className="bi bi-card-list me-2"/>Tickets {role==="Admin" && <span className="badge bg-danger">Admin</span>}
            </a>
          </Link>
        </li>
        <li>
          <Link href="/createticket">
            <a className={"nav-link text-white" + (active === "createticket" ? " active bg-gradient" : "")}>
              <i className="bi bi-plus-circle me-2"/>Créer un ticket
            </a>
          </Link>
        </li>
        <li>
          <Link href="/profile">
            <a className={"nav-link text-white" + (active === "profile" ? " active bg-gradient" : "")}>
              <i className="bi bi-person-circle me-2"/>Mon profil
            </a>
          </Link>
        </li>
        <li>
          <Link href="/logout">
            <a className="nav-link text-white">
              <i className="bi bi-box-arrow-right me-2"/>Déconnexion
            </a>
          </Link>
        </li>
      </ul>
      <hr/>
      <div className="text-white-50 small mt-auto">© ClaimOneOff</div>
    </div>
  );
}

