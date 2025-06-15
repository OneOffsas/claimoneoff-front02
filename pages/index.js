import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-700 to-blue-500">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center animate-fade-in">
        <Image src="/logo.png" width={96} height={96} alt="Logo ClaimOneOff" />
        <h1 className="mt-6 mb-2 text-3xl font-extrabold text-violet-800 text-center">Bienvenue sur ClaimOneOff</h1>
        <p className="mb-8 text-gray-600 text-center">Votre outil professionnel de gestion de tickets logistiques.</p>
        <div className="flex gap-4 w-full">
          <Link href="/login" className="w-1/2 text-center py-3 rounded-xl bg-violet-700 text-white font-bold hover:bg-violet-800 shadow-md">Se connecter</Link>
          <Link href="/register" className="w-1/2 text-center py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
