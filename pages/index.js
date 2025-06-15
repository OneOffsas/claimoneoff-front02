import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-tr from-violet-600 to-blue-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="ClaimOneOff" className="w-20 h-20" />
        </div>
        <h1 className="text-3xl font-bold text-center text-violet-700 mb-4">Bienvenue sur ClaimOneOff</h1>
        <p className="text-center text-gray-500 mb-8">La gestion des litiges logistiques la plus simple du marché.</p>
        <div className="flex flex-col gap-4">
          <Link href="/login" className="w-full bg-violet-700 text-white py-2 rounded-lg font-semibold text-lg hover:bg-violet-900 transition">Se connecter</Link>
          <Link href="/register" className="w-full border border-violet-600 text-violet-800 py-2 rounded-lg font-semibold text-lg hover:bg-violet-50 transition">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
