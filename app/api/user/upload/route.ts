import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Route segment config for file uploads
export const maxDuration = 60; // 60 seconds timeout for file uploads

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Max size 4MB
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 4MB" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(
      `profile-${session.user.email}-${Date.now()}.${file.type.split("/")[1]}`, 
      file, 
      { access: "public" }
    );

    // Update user profile with new image URL
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { imageUrl: blob.url },
      select: { imageUrl: true }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[PROFILE_UPLOAD]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
