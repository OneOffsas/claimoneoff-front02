// components/Menu.js
export default function Menu({ user, onNav, current }) {
  const items = [
    { key: "dashboard", label: "Tableau de bord", icon: "📊" },
    { key: "tickets", label: "Mes tickets", icon: "🎫" },
    ...(user.role === "Admin" ? [
      { key: "users", label: "Utilisateurs", icon: "👤" },
      { key: "stats", label: "Stats Globales", icon: "📈" },
    ] : []),
    { key: "profile", label: "Profil", icon: "🧑" }
  ];
  return (
    <nav className="menu-side">
      <h2 className="logo">ClaimOneOff</h2>
      <ul>
        {items.map(it => (
          <li
            key={it.key}
           
