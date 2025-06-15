import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-violet-700 to-blue-600">
      <div className="bg-white shadow-xl rounded-3xl px-12 py-10 flex flex-col items-center space-y-6 animate-fade-in">
        <img src="/logo.png" alt="Logo ClaimOneOff" className="w-28 h-28 mb-3 drop-shadow-xl" />
        <h1 className="text-3xl font-extrabold text-violet-800 mb-2">Bienvenue sur ClaimOneOff</h1>
        <p className="text-gray-500 text-center mb-4 max-w-xs">Votre espace de gestion des litiges logistiques e-commerce, simple, rapide, efficace et 100% sécurisé.</p>
        <div className="flex gap-4 w-full">
          <Link href="/login" className="w-1/2">
            <button className="w-full py-3 bg-violet-700 rounded-xl text-white font-bold text-lg hover:bg-violet-900 transition-all">Se connecter</button>
          </Link>
          <Link href="/register" className="w-1/2">
            <button className="w-full py-3 bg-blue-600 rounded-xl text-white font-bold text-lg hover:bg-blue-800 transition-all">Créer un compte</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
