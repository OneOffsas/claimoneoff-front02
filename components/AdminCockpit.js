import StatsDashboard from "./StatsDashboard";
import AdminTickets from "./AdminTickets";
import UsersAdmin from "./UsersAdmin";
import Profile from "./Profile";

export default function AdminCockpit({ user, page }) {
  if (page === "dashboard") return <StatsDashboard user={user} admin />;
  if (page === "tickets") return <AdminTickets user={user} />;
  if (page === "stats") return <StatsDashboard user={user} admin />;
  if (page === "users") return <UsersAdmin />;
  if (page === "profile") return <Profile user={user} />;
  return null;
}
