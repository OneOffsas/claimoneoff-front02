import { FaTachometerAlt, FaChartPie, FaTable, FaUsers, FaFileExport } from "react-icons/fa";
import Link from "next/link";

export default function AdminSidebar({ current }) {
  return (
    <nav className="admin-sidebar bg-gradient-to-b from-violet-800 to-blue-900 text-white h-full flex flex-col w-60 p-6">
      <div className="text-3xl font-bold mb-8">ClaimOneOff</div>
      <MenuLink icon={<FaTachometerAlt />} label="Dashboard" href="/dashboard" current={current === 'dashboard'} />
      <MenuLink icon={<FaChartPie />} label="Statistiques" href="/dashboard/stats" current={current === 'stats'} />
      <MenuLink icon={<FaTable />} label="Tickets" href="/dashboard/tickets" current={current === 'tickets'} />
      <MenuLink icon={<FaFileExport />} label="Export CSV" href="/dashboard/exports" current={current === 'exports'} />
      <MenuLink icon={<FaUsers />} label="Utilisateurs" href="/dashboard/users" current={current === 'users'} />
    </nav>
  );
}
function MenuLink({ icon, label, href, current }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition bg-white/10 cursor-pointer mb-2 ${current && "bg-violet-600 font-bold"}`}>
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  );
}
