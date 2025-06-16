// components/Sidebar.js
import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard, Ticket } from "lucide-react";

export default function Sidebar({ onLogout }) {
  return (
    <aside className="w-60 bg-white shadow-xl flex flex-col p-6">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        {/* Si tu préfères <Image>, tu peux ajuster le width/height */}
        <Image src="/logo.png" alt="Logo ClaimOneOff" width={64} height={64} />
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-4 text-lg">
        <Link href="/dashboard" className="font-semibold text-violet-700 hover:underline">
          <LayoutDashboard className="inline-block mr-2" size={20} /> Dashboard
        </Link>
        <Link href="/tickets" className="hover:text-violet-700">
          <Ticket className="inline-block mr-2" size={20} /> Tous les tickets
        </Link>
        <Link href="/createticket" className="hover:text-violet-700">
          <Ticket className="inline-block mr-2" size={20} /> Créer un ticket
        </Link>
      </nav>
      <div className="flex-1" />
      {/* Bouton de déconnexion */}
      <button
        onClick={onLogout}
        className="mt-4 flex items-center text-red-600 hover:text-red-800"
      >
        <LogOut className="inline-block mr-2" size={20} /> Déconnexion
      </button>
      <div className="text-gray-400 text-xs mt-6">© 2025 ClaimOneOff</div>
    </aside>
  );
}

