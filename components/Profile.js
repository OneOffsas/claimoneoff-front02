// /components/Profile.js
export default function Profile({ user }) {
  return (
    <div className="card shadow border-0 p-4">
      <h3>Mon Profil</h3>
      <p><b>Nom :</b> {user.nom}</p>
      <p><b>Prénom :</b> {user.prenom}</p>
      <p><b>Email :</b> {user.email}</p>
      <p><b>Société :</b> {user.societe}</p>
      <p><b>Rôle :</b> {user.role}</p>
    </div>
  );
}
