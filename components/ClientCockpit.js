import TicketsDashboard from "./TicketsDashboard";
import StatsDashboard from "./StatsDashboard";
import Profile from "./Profile";

export default function ClientCockpit({ user, page }) {
  if (page === "tickets") return <TicketsDashboard user={user} />;
  if (page === "stats") return <StatsDashboard user={user} />;
  if (page === "profile") return <Profile user={user} />;
  return <StatsDashboard user={user} />;
}
