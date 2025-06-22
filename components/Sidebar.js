import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaTachometerAlt, FaChartBar, FaTicketAlt, FaFileCsv, FaUsers
} from "react-icons/fa";

const menu = [
  { icon: <FaTachometerAlt />, label: "Dashboard", url: "/dashboard" },
  { icon: <FaChartBar />, label: "Statistiques", url: "/dashboard/stats" },
  { icon: <FaTicketAlt />, label: "Tickets", url: "/dashboard/tickets" },
  { icon: <FaFileCsv />, label: "Export CSV", url: "/dashboard/exports" },
  { icon: <FaUsers />, label: "Utilisateurs", url: "/dashboard/users" }
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-white shadow-xl flex flex-col z-20">
      <div className="text-2xl font-bold px-6 py-6 bg-gradient-to-r from-violet-600 to-blue-800 text-white tracking-widest">
        ClaimOneOff
      </div>
      <nav className="flex-1 flex flex-col gap-3 mt-8 px-3">
        {menu.map((item, idx) => (
          <Link key={idx} href={item.url} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-lg transition-all 
            ${router.pathname === item.url ? 'bg-violet-600 text-white shadow-md' : 'hover:bg-violet-100 text-violet-800'}`}>
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
