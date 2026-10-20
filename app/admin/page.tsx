import AdminAccessGate from "@/components/admin-access-gate";
import AdminDashboard from "@/components/admin-dashboard";

export default function AdminPage() {
  return <AdminAccessGate><AdminDashboard /></AdminAccessGate>;
}
