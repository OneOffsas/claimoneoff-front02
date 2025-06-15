import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-primary to-secondary flex flex-col items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-10 flex flex-col items-center max-w-lg w-full animate-fade-in">
        <img src="/logo.png" alt="ClaimOneOff" className="w-20 mb-4" />
        <h1 className="text-4xl font-extrabold text-primary mb-2">ClaimOneOff</h1>
        <p className="text-gray-700 mb-6 text-center">Votre plateforme ultime de gestion des litiges logistiques e-commerce, <span className="text-secondary font-semibold">design & performance</span>.</p>
        <div className="flex space-x-4">
          <Link href="/login">
            <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-lg hover:bg-secondary transition">Se connecter</button>
          </Link>
          <Link href="/register">
            <button className="border-2 border-primary text-primary px-6 py-2 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition">Créer un compte</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
