import AdminUserDetail from "@/components/admin-user-detail";
import "@/components/admin-user-detail.css";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminUserDetail id={id} />;
}
