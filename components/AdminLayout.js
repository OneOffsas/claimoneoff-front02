import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children, current }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar current={current} />
      <main className="ml-64 w-full p-10">{children}</main>
    </div>
  );
}
