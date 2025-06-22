import AdminSidebar from "./AdminSidebar";
export default function AdminLayout({ children, current }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar current={current} />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
