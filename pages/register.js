const { showNotification } = useNotification();
function handleRegister(e) {
  e.preventDefault();
  // ...fetch
  fetch("/api/register", { ... })
    .then(r => r.json())
    .then(res => {
      if (res.status === "success") {
        showNotification("Inscription réussie !", "success");
        setTimeout(() => { window.location.href = "/login"; }, 1100);
      } else {
        showNotification(res.message || "Erreur d'inscription", "error");
      }
    })
    .catch(() => showNotification("Erreur serveur", "error"));
}

