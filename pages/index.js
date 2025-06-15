import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-700 to-blue-600">
      <Head><title>ClaimOneOff</title></Head>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="ClaimOneOff" className="w-24 h-24" />
        </div>
        <h1 className="text-3xl font-bold text-center text-violet-700 mb-8">Bienvenue sur ClaimOneOff</h1>
        <div className="flex flex-col gap-4">
          <Link href="/login" className="w-full bg-violet-700 text-white py-3 rounded hover:bg-violet-900 text-center font-bold text-lg transition">
            Se connecter
          </Link>
          <Link href="/register" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-800 text-center font-bold text-lg transition">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
