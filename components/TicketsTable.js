export default function TicketsTable({ tickets, onRowClick }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4">Liste des tickets</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">ID</th>
            <th className="p-3">Société</th>
            <th className="p-3">Problématique</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.ID_Ticket} onClick={() => onRowClick(t)} className="hover:bg-violet-100 cursor-pointer">
              <td className="p-3">{t.ID_Ticket}</td>
              <td className="p-3">{t.Societe}</td>
              <td className="p-3">{t.Problematique}</td>
              <td className="p-3">{t.Statut}</td>
              <td className="p-3">{t.Date_Ouverture}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
