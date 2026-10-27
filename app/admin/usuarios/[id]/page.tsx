import AdminUserDetail from "@/components/admin-user-detail-content";
import "@/components/admin-user-detail.css";
import "@/components/admin-user-detail-overrides.css";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminUserDetail id={id} />;
}
