import { useState, useEffect } from "react";

export default function TicketsDashboard({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    numero_commande: "",
    problematique: "",
    description: "",
    transporteur: "",
    urgence: "",
    sla_cible: "",
  });
  const [msg, setMsg] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    setMsg("Chargement des tickets...");
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getTickets",
        email: user.email,
        societe: user.societe,
        role: user.role,
      }),
    });
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
    setMsg("");
  };

  useEffect(() => { loadTickets(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg("Création du ticket...");
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createTicket",
        societe: user.societe,
        utilisateur: user.nom + " " + user.prenom,
        email: user.email,
        role: user.role,
        ...form,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setMsg("Ticket créé !");
      setForm({
        numero_commande: "",
        problematique: "",
        description: "",
        transporteur: "",
        urgence: "",
        sla_cible: "",
      });
      loadTickets();
    } else {
      setMsg("Erreur : " + (data.error || JSON.stringify(data)));
    }
  };

  const updateForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="container my-4">
      <h3>Mes tickets</h3>
      <form className="row g-3 mb-4" onSubmit={handleCreate} style={{ background: "#f7f7fa", borderRadius: 10, padding: 20 }}>
        <div className="col-md-4">
          <input
            type="text"
            name="numero_commande"
            className="form-control"
            placeholder="Numéro de commande"
            value={form.numero_commande}
            onChange={updateForm}
            required
          />
        </div>
        <div className="col-md-4">
          <select name="problematique" className="form-select" value={form.problematique} onChange={updateForm} required>
            <option value="">Problème</option>
            <option value="Perte de colis">Perte de colis</option>
            <option value="Colis endommagé">Colis endommagé</option>
            <option value="Non reçu">Non reçu</option>
            <option value="Erreur de préparation">Erreur de préparation</option>
            <option value="Erreur réception">Erreur réception</option>
            <option value="Produit endommagé">Produit endommagé</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div className="col-md-4">
          <select name="transporteur" className="form-select" value={form.transporteur} onChange={updateForm} required>
            <option value="">Transporteur</option>
            <option value="Colissimo">Colissimo</option>
            <option value="Mondial Relay">Mondial Relay</option>
            <option value="Chronopost">Chronopost</option>
            <option value="GLS">GLS</option>
            <option value="DPD">DPD</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div className="col-md-6">
          <textarea
            name="description"
            className="form-control"
            placeholder="Description du problème"
            value={form.description}
            onChange={updateForm}
            required
          />
        </div>
        <div className="col-md-3">
          <select name="urgence" className="form-select" value={form.urgence} onChange={updateForm}>
            <option value="">Urgence</option>
            <option value="Faible">Faible</option>
            <option value="Normale">Normale</option>
            <option value="Haute">Haute</option>
            <option value="Critique">Critique</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="sla_cible"
            className="form-control"
            placeholder="SLA cible (ex : 48h)"
            value={form.sla_cible}
            onChange={updateForm}
          />
        </div>
        <div className="col-12 text-end">
          <button className="btn btn-primary" type="submit">Créer le ticket</button>
        </div>
        <div style={{ color: "red", marginTop: 10 }}>{msg}</div>
      </form>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div>Chargement…</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Date</th>
                  <th>Commande</th>
                  <th>Problème</th>
                  <th>Transporteur</th>
                  <th>Urgence</th>
                  <th>Statut</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      Aucun ticket pour le moment.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t, i) => (
                    <tr key={t.ID_Ticket || t.id_ticket || i}>
                      <td>{i + 1}</td>
                      <td>{t.Date_Ouverture || t.date_ouverture}</td>
                      <td>{t.Numero_Commande || t.numero_commande}</td>
                      <td>{t.Problematique || t.problematique}</td>
                      <td>{t.Transporteur || t.transporteur}</td>
                      <td>{t.Urgence || t.urgence}</td>
                      <td>{t.Statut || t.statut}</td>
                      <td style={{ maxWidth: 200 }}>{t.Description || t.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-outline-secondary btn-sm" onClick={loadTickets}>Rafraîchir</button>
        </div>
      </div>
    </div>
  );
}
