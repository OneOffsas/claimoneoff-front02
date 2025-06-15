import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  // Champs du ticket
  const [sujet, setSujet] = useState("");
  const [description, setDescription] = useState("");
  const [urgence, setUrgence] = useState("Non");
  const [numeroCommande, setNumeroCommande] = useState("");
  const [problematique, setProblematique] = useState("");
  const [transporteur, setTransporteur] = useState("");
  const [priorite, setPriorite] = useState("");
  const [typeAction, setTypeAction] = useState("");
  const [chargement, setChargement] = useState(false);

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

  async function handleCreateTicket(e) {
    e.preventDefault();
    setChargement(true);
    setMessage("");
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          societe: user.societe,
          utilisateur: `${user.prenom} ${user.nom}`,
          email: user.email,
          role: user.role,
          urgence,
          numero_commande: numeroCommande,
          problematique,
          transporteur,
          description,
          priorite,
          type_action: typeAction,
          // ... autres champs si besoin
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("Ticket créé !");
        setSujet(""); setDescription(""); setUrgence("Non"); setNumeroCommande(""); setProblematique(""); setTransporteur(""); setPriorite(""); setTypeAction("");
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
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 20 }}>
      <h2>Dashboard {user.role === "Admin" ? "Admin" : "Client"}</h2>
      <div>
        <b>Bonjour {user.prenom} {user.nom}</b> ({user.email} — {user.societe})<br />
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Déconnexion</button>
      </div>
      <h3 style={{ marginTop: 30 }}>Créer un ticket</h3>
      <form onSubmit={handleCreateTicket}>
        <label>Urgence&nbsp;
          <select value={urgence} onChange={e => setUrgence(e.target.value)}>
            <option value="Non">Non</option>
            <option value="Oui">Oui</option>
          </select>
        </label><br />
        <input placeholder="Numéro de commande" value={numeroCommande} onChange={e => setNumeroCommande(e.target.value)} style={{ width: 200, margin: 6 }} />
        <input placeholder="Problématique" value={problematique} onChange={e => setProblematique(e.target.value)} style={{ width: 200, margin: 6 }} />
        <input placeholder="Transporteur" value={transporteur} onChange={e => setTransporteur(e.target.value)} style={{ width: 200, margin: 6 }} />
        <input placeholder="Priorité" value={priorite} onChange={e => setPriorite(e.target.value)} style={{ width: 200, margin: 6 }} />
        <input placeholder="Type d'action" value={typeAction} onChange={e => setTypeAction(e.target.value)} style={{ width: 200, margin: 6 }} />
        <br />
        <textarea
          placeholder="Décris ton problème"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          style={{ width: "90%", margin: "8px 0", padding: 8 }}
        />
        <button
          type="submit"
          disabled={chargement}
          style={{ width: 220, padding: 10, background: "#3b82f6", color: "white", border: "none", borderRadius: 4, marginTop: 12 }}
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
              <th>ID</th>
              <th>Urgence</th>
              <th>N° Commande</th>
              <th>Problématique</th>
              <th>Transporteur</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={i}>
                <td>{t.id}</td>
                <td>{t.urgence}</td>
                <td>{t.numero_commande}</td>
                <td>{t.problematique}</td>
                <td>{t.transporteur}</td>
                <td>{t.description}</td>
                <td>{t.statut}</td>
                <td>{t.date_ouverture}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center" }}>Aucun ticket pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
