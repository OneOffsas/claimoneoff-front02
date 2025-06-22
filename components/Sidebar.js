import { FaTachometerAlt, FaChartPie, FaTable, FaUsers, FaFileExport } from "react-icons/fa";
import Link from "next/link";

const items = [
  { icon: <FaTachometerAlt />, label: "Dashboard", href: "/dashboard" },
  { icon: <FaChartPie />, label: "Statistiques", href: "/dashboard/stats" },
  { icon: <FaTable />, label: "Tickets", href: "/dashboard/tickets" },
  { icon: <FaFileExport />, label: "Export CSV", href: "/dashboard/exports" },
  { icon: <FaUsers />, label: "Utilisateurs", href: "/dashboard/users" }
];

export default function AdminSidebar({ current }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-violet-900 to-blue-900 shadow-xl flex flex-col py-8 z-10">
      <div className="text-3xl text-white font-extrabold px-8 mb-12 tracking-widest">ClaimOneOff</div>
      <nav className="flex-1 flex flex-col gap-3">
        {items.map(({icon, label, href}) =>
          <Link key={href} href={href}>
            <div className={`flex items-center gap-4 px-8 py-3 text-lg cursor-pointer rounded-l-2xl transition-all duration-150 
                ${current===label.toLowerCase() ? 'bg-white/20 text-white font-bold scale-105' : 'text-gray-200 hover:bg-white/10 hover:scale-105'}`}>
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </div>
          </Link>
        )}
      </nav>
    </aside>
  );
}

