import StatsDashboard from "./StatsDashboard";
import TicketsDashboard from "./TicketsDashboard";
import Profile from "./Profile";

export default function ClientCockpit({ user, page }) {
  if (page === "dashboard") return <StatsDashboard user={user} />;
  if (page === "tickets") return <TicketsDashboard user={user} />;
  if (page === "stats") return <StatsDashboard user={user} />;
  if (page === "profile") return <Profile user={user} />;
  return null;
}
