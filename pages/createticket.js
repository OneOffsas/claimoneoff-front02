import TicketForm from "../components/TicketForm";

export default function CreateTicketPage() {
  // Tu peux passer onSuccess pour rediriger, ex: () => router.push('/tickets')
  return (
    <div className="min-h-screen bg-gradient-to-tr from-violet-50 to-blue-100 flex items-center justify-center py-10">
      <TicketForm onSuccess={() => { /* ex: alert ou redirection */ }} />
    </div>
  );
}

