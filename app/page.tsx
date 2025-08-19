
import LandingPage from "@/components/landing/LandingPage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    // Cari store milik user
    const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/user/stores?email=${encodeURIComponent(session.user.email)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.stores && json.stores.length > 0) {
        redirect(`/${json.stores[0].slug}/dashboard`);
      }
    }
    // fallback jika tidak ada store
    redirect("/onboarding");
  }
  return <LandingPage/>;
}
