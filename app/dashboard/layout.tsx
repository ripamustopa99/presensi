import { getAuthData } from "@/lib/auth.helper";
import DashboardLayout from "@/components/dashboard/DashboardManager";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthData();

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
