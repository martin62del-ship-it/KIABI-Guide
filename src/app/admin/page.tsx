import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/auth/admin";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  const email = verifySessionToken(token);

  if (!email) return <AdminLogin />;
  return <AdminDashboard email={email} />;
}
