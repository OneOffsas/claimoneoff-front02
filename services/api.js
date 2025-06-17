// services/api.js

export async function login(email, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(user) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function fetchTickets(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/tickets?${qs}`);
  return res.json();
}

export async function createTicket(ticket) {
  const res = await fetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket),
  });
  return res.json();
}

export async function updateTicket(fields) {
  const res = await fetch('/api/ticket', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_ticket: fields.id_ticket, fields }),
  });
  return res.json();
}

export async function addComment(id_ticket, utilisateur, commentaire) {
  const res = await fetch('/api/ticket', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_ticket, utilisateur, commentaire }),
  });
  return res.json();
}
