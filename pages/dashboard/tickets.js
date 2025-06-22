import AdminLayout from "../../components/AdminLayout";
import TicketsTable from "../../components/TicketsTable";
export default function TicketsPage() {
  return (
    <AdminLayout current="tickets">
      <h1 className="text-2xl font-bold mb-8">Tous les tickets</h1>
      <TicketsTable />
    </AdminLayout>
  );
}
