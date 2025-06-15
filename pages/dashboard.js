import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [sujet, setSujet] = useState("");
  const [description, setDescription] = useState("");
  const [chargement, setChargement] = useState(false);

  // Récupère l'utilisateur connecté
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      window.location.href = "/login";
    } else {
      setUser(JSON.parse(u));
      fetchTickets(JSON.parse(u));
    }
    // eslint-disable-next-line
  }, []);

  // Récupère les tickets (pour ce client ou tous si admin)
  async function fetchTickets(u) {
    setChargement(true);
    setMessage("");
    try {
      const res = await fetch("/api/tickets?role=" + u.role + "&email=" + u.email);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {
      setMessage("Erreur lors du chargement des tickets");
    }
    setChargement(false);
  }

  // Créer un ticket
  async function handleCreateTicket(e) {
    e.preventDefault();
    setChargement(true);
    setMessage("");
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sujet,
          description,
          email: user.email,
          societe: user.societe,
          nom: user.nom,
          prenom: user.prenom,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("Ticket créé !");
        setSujet("");
        setDescription("");
        fetchTickets(user);
      } else {
        setMessage(data.message || "Erreur lors de la création");
      }
    } catch {
      setMessage("Erreur réseau ou serveur");
    }
    setChargement(false);
  }

  if (!user) return <div>Chargement...</div>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h2>Dashboard {user.role === "Admin" ? "Admin" : "Client"}</h2>
      <div>
        <b>Bonjour {user.prenom} {user.nom}</b> ({user.email} — {user.societe})<br />
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Déconnexion</button>
      </div>
      <h3 style={{ marginTop: 30 }}>Créer un ticket</h3>
      <form onSubmit={handleCreateTicket}>
        <input
          placeholder="Sujet du ticket"
          value={sujet}
          onChange={e => setSujet(e.target.value)}
          required
          style={{ width: "100%", margin: "8px 0", padding: 8 }}
        />
        <textarea
          placeholder="Décris ton problème"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          style={{ width: "100%", margin: "8px 0", padding: 8 }}
        />
        <button
          type="submit"
          disabled={chargement}
          style={{ width: "100%", padding: 10, background: "#3b82f6", color: "white", border: "none", borderRadius: 4, marginTop: 12 }}
        >
          {chargement ? "Création..." : "Créer le ticket"}
        </button>
      </form>
      <h3 style={{ marginTop: 30 }}>Mes tickets</h3>
      {message && <div style={{ marginTop: 8, color: message.startsWith("Ticket") ? "green" : "red" }}>{message}</div>}
      {chargement ? <div>Chargement des tickets...</div> : (
        <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>Numéro</th>
              <th>Sujet</th>
              <th>Description</th>
              <th>Status</th>
              <th>Créé par</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={i}>
                <td>{t.id}</td>
                <td>{t.sujet}</td>
                <td>{t.description}</td>
                <td>{t.status}</td>
                <td>{t.email}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center" }}>Aucun ticket pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
