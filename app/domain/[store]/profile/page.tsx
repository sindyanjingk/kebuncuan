import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CustomerProfileClient } from "./profile-client";

interface ProfilePageProps {
  params: { store: string }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  return <CustomerProfileClient storeSlug={params.store} />;
}
