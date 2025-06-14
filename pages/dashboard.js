import { useEffect, useState } from "react";
import { apiCall } from "../utils/api";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) window.location.href = "/login";
    setUser(u);
    loadTickets(u);
  }, []);

  async function loadTickets(u) {
    const res = await apiCall("getTickets", { email: u?.email, role: u?.role });
    if (res.status === "success") setTickets(res.tickets || []);
  }

  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div style={{maxWidth: "1100px", margin: "auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px"}}>
        <img src="/logo.png" width={100} height={48} alt="Logo" className="logo" />
        <div>
          <span>Bienvenue, {user?.prenom} {user?.nom} ({user?.role})</span>
          <button onClick={logout} style={{marginLeft:16}}>Déconnexion</button>
        </div>
      </div>
      <button onClick={()=>setShowForm(!showForm)}>
        {showForm ? "Annuler" : "Créer un ticket"}
      </button>
      {showForm && <TicketForm user={user} onSuccess={()=>{ setShowForm(false); loadTickets(user); }} />}
      <TicketList tickets={tickets} user={user} refresh={()=>loadTickets(user)} />
    </div>
  );
}
