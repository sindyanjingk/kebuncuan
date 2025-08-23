import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { LoginClient } from "./login-client";

export default async function LoginPage({ params }: { params: { store: string } }) {
  const session = await getServerSession(authOptions);
  
  // If user is already logged in, redirect to store home
  if (session?.user?.email) {
    redirect(`/`);
  }

  // Get store info for branding
  const store = await prisma.store.findUnique({
    where: { slug: params.store },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true
    }
  });

  if (!store) {
    notFound();
  }

  return <LoginClient store={store} />;
}
