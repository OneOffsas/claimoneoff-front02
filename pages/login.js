import { useNotification } from "../components/NotificationProvider";

// ...ton code de formulaire
const { showNotification } = useNotification();

function handleLogin(e) {
  e.preventDefault();
  // ...fetch
  fetch("/api/login", { ... })
    .then(r => r.json())
    .then(res => {
      if (res.status === "success") {
        localStorage.setItem("user", JSON.stringify(res));
        showNotification("Connexion réussie !", "success");
        setTimeout(() => { window.location.href = "/dashboard"; }, 900);
      } else {
        showNotification(res.message || "Erreur de connexion", "error");
      }
    })
    .catch(() => showNotification("Erreur serveur", "error"));
}

