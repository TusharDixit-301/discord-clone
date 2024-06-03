import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { serverId } = params;

    if (!profile) {
      return new NextResponse('Unauthorized ', {
        status: 401,
      });
    }
    if (!serverId) {
      return new NextResponse('Server ID is required', {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error(`ServerId Post Error : ${params.serverId}`, error);
    return new NextResponse('An error occurred while leaving the server', {
      status: 500,
    });
  }
}
