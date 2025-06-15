import Link from "next/link";
import { Home, Ticket, BarChart, Settings, LogOut } from "lucide-react";

export default function Sidebar({ onLogout }) {
  return (
    <aside className="h-screen bg-gradient-to-b from-violet-800 to-blue-900 w-64 flex flex-col shadow-2xl">
      <div className="p-6 text-white font-bold text-2xl">ClaimOneOff</div>
      <nav className="flex-1">
        <ul>
          <li>
            <Link href="/dashboard" className="flex items-center p-4 hover:bg-violet-700 transition text-white">
              <Home className="mr-2" /> Tableau de bord
            </Link>
          </li>
          <li>
            <Link href="/tickets" className="flex items-center p-4 hover:bg-violet-700 transition text-white">
              <Ticket className="mr-2" /> Tickets
            </Link>
          </li>
          <li>
            <Link href="/stats" className="flex items-center p-4 hover:bg-violet-700 transition text-white">
              <BarChart className="mr-2" /> Statistiques
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center p-4 hover:bg-violet-700 transition text-white">
              <Settings className="mr-2" /> Paramètres
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <button onClick={onLogout} className="flex items-center text-white hover:text-red-400">
          <LogOut className="mr-2" /> Déconnexion
        </button>
      </div>
    </aside>
  );
}

