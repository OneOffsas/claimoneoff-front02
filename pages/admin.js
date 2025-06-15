import { useEffect, useState } from "react";
const API_URL = "https://yellow-violet-1ba5.oneoffsas.workers.dev/";

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState("");
  const user = typeof window !== "undefined" && JSON.parse(localStorage.getItem("claimUser"));

  useEffect(() => {
    if (!user || user.role !== "Admin") window.location.href = "/login";
    else fetchTickets();
    // eslint-disable-next-line
  }, []);

  async function fetchTickets() {
    setMsg("Chargement...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getTickets", email: user.email, role: user.role }),
      });
      const data = await res.json();
      setTickets(data.tickets || []);
      setMsg("");
    } catch {
      setMsg("Erreur de chargement.");
    }
  }

  // Statistiques pour le dashboard admin
  const totalTickets = tickets.length;
  const ticketsOuverts = tickets.filter(t => t.statut !== "Clos").length;
  const ticketsUrgents = tickets.filter(t => t.urgence && t.urgence.toLowerCase() === "oui").length;

  return (
    <div className="d-flex" style={{minHeight:"100vh",background:"#f9faff"}}>
      <div className="sidebar-custom p-4 d-none d-md-flex flex-column" style={{width:220}}>
        <div className="brand fs-4 mb-4 text-center">ClaimOneOff</div>
        <div className="mb-2 menu-item-active p-2 fw-bold">Tickets</div>
        <div className="mt-auto text-muted small">
          {user && user.prenom} {user && user.nom}<br />
          <span className="text-secondary">{user && user.societe}</span>
        </div>
      </div>
      <div className="flex-grow-1 p-4">
        <div className="d-md-none mb-3">
          <div className="brand fs-5">ClaimOneOff</div>
        </div>
        <h2 className="fw-bold mb-2">Dashboard admin</h2>
        <div className="row mb-4">
          <div className="col-6 col-md-
