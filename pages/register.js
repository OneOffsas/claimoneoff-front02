const res = await fetch("/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    societe, nom, prenom, email, password
  }),
});

