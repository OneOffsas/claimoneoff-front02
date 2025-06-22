import Sidebar from '../../components/Sidebar'

export default function Dashboard() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-10 pl-72">
        <h1 className="text-4xl font-bold mb-6">Dashboard global</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl shadow p-6 bg-white">
            <p className="text-lg font-medium text-gray-600">Tickets ouverts</p>
            <p className="text-3xl font-bold text-violet-700">12</p>
          </div>
          <div className="rounded-2xl shadow p-6 bg-white">
            <p className="text-lg font-medium text-gray-600">Tickets résolus</p>
            <p className="text-3xl font-bold text-green-600">8</p>
          </div>
          <div className="rounded-2xl shadow p-6 bg-white">
            <p className="text-lg font-medium text-gray-600">Temps moyen de résolution</p>
            <p className="text-3xl font-bold text-blue-600">2h37</p>
          </div>
        </div>
        {/* Tu ajoutes ici les graphs ou ce que tu veux */}
      </main>
    </div>
  );
}
