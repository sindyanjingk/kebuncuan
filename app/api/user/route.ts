import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash, compare } from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/user - Get user data
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    if (!email) {
      return NextResponse.json({ error: "Email diperlukan" }, { status: 400 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        balance: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("[USER_GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const { username, currentPassword, newPassword } = json

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
    }

    // Data to update
    const data: any = {}
    
    // Update username if provided
    if (username && username !== user.username) {
      data.username = username
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      if (!await compare(currentPassword, user.passwordHash)) {
        return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 })
      }
      data.passwordHash = await hash(newPassword, 10)
    }

    // Update user
    if (Object.keys(data).length > 0) {
      const updated = await prisma.user.update({
        where: { email: session.user.email },
        data
      })

      return NextResponse.json({
        message: "Profile berhasil diupdate",
        user: {
          id: updated.id,
          email: updated.email,
          username: updated.username,
        }
      })
    }

    return NextResponse.json({ message: "Tidak ada perubahan" })
  } catch (error) {
    console.error("[USER_UPDATE]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
