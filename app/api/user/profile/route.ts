import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        username: true,
        imageUrl: true,
        phone: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        country: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET_USER_PROFILE_ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      username,
      phone,
      address,
      city,
      province,
      postalCode,
      country
    } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username,
        phone,
        address,
        city,
        province,
        postalCode,
        country
      },
      select: {
        id: true,
        email: true,
        username: true,
        imageUrl: true,
        phone: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        country: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('UPDATE_USER_PROFILE_ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
