import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-violet-700 via-indigo-600 to-blue-400">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center animate-fade-in">
        <img src="/logo.png" alt="ClaimOneOff" className="mx-auto mb-6 w-24 h-24 rounded-full shadow" />
        <h1 className="text-3xl font-extrabold text-violet-800 mb-2 font-logo">ClaimOneOff</h1>
        <p className="text-gray-500 mb-8">Votre plateforme de gestion des litiges logistiques e-commerce, moderne et intuitive.</p>
        <div className="flex flex-col gap-4">
          <Link href="/login" className="py-3 px-6 bg-violet-700 hover:bg-violet-900 rounded-xl text-white font-bold shadow transition-all">Se connecter</Link>
          <Link href="/register" className="py-3 px-6 bg-white border border-violet-700 text-violet-700 hover:bg-violet-700 hover:text-white rounded-xl font-bold shadow transition-all">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
