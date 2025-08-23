import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile/profile-form"
import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Get full user data from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      username: true
    }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8">
      <ProfileForm user={user} />
    </div>
  )
}
