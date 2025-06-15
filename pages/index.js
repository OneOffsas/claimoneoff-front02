import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-700 via-blue-500 to-indigo-900 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        {/* Effet de bulles animées en fond */}
        <div className="animate-bounce absolute left-1/4 top-1/3 w-80 h-80 rounded-full bg-violet-400 opacity-20 blur-3xl"></div>
        <div className="animate-pulse absolute right-1/3 top-2/4 w-72 h-72 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
      </div>
      <div className="bg-white/90 rounded-3xl shadow-xl px-12 py-10 flex flex-col items-center max-w-2xl">
        <img src="/logo.png" alt="ClaimOneOff" className="w-28 mb-6 drop-shadow-2xl rounded-2xl" />
        <h1 className="text-4xl font-extrabold text-violet-700 mb-2 text-center tracking-tight">ClaimOneOff</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          La plateforme de gestion de litiges logistiques <span className="text-violet-600 font-bold">ultra performante</span>
        </h2>
        <p className="mb-8 text-lg text-gray-500 text-center">
          Suivi des tickets en temps réel, statistiques avancées, interface intuitive et expérience client digne des meilleurs outils du marché.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/login">
            <button className="w-full sm:w-auto px-6 py-3 bg-violet-700 hover:bg-violet-900 transition-all text-white rounded-full text-lg font-bold shadow-xl">
              Se connecter
            </button>
          </Link>
          <Link href="/register">
            <button className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-700 transition-all text-white rounded-full text-lg font-bold shadow-xl">
              Créer un compte
            </button>
          </Link>
        </div>
        <div className="text-xs text-gray-400 mt-6 text-center">© {new Date().getFullYear()} ClaimOneOff. Tous droits réservés.</div>
      </div>
    </div>
  );
}
