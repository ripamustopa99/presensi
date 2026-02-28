import { getAuthData } from "@/lib/auth.helper";
import DashboardLayout from "@/components/dashboard/DashboardManager";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthData();
  // const user = {
  //   _id: "1fa3123sdf",
  //   name: "fdasdf",
  //   role: "guru",
  // };

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
