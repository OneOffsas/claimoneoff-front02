export default function Profile({ user }) {
  if (!user) return <div>Chargement…</div>;
  return (
    <div className="container my-4">
      <h3>Mon profil</h3>
      <ul className="list-group">
        <li className="list-group-item"><b>Nom :</b> {user.nom}</li>
        <li className="list-group-item"><b>Prénom :</b> {user.prenom}</li>
        <li className="list-group-item"><b>Email :</b> {user.email}</li>
        <li className="list-group-item"><b>Société :</b> {user.societe}</li>
        <li className="list-group-item"><b>Rôle :</b> {user.role}</li>
      </ul>
    </div>
  );
}
