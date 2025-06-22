import { useEffect, useState } from "react";
import { useNotification } from "../components/NotificationProvider";
import ClientCockpit from "../components/ClientCockpit";
import AdminCockpit from "../components/AdminCockpit";

export default function Dashboard() {
  const { showNotification } = useNotification();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) {
      window.location.href = "/login";
    } else {
      setUser(u);
      showNotification(`Bienvenue ${u.prenom || u.nom || ""} !`, "success");
    }
  }, []);

  if (!user) return null;

  return user.role === "Admin"
    ? <AdminCockpit user={user} />
    : <ClientCockpit user={user} />;
}
