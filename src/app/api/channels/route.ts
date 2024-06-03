import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();

    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('You must be logged in to create a server', {
        status: 401,
      });
    }

    if (name.toLowerCase() === 'general') {
      return new NextResponse('Channel name cannot be general', {
        status: 400,
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
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error('Servers Post Error: ', error);
    return new NextResponse('An error occurred while creating the server', {
      status: 500,
    });
  }
}

// data: {
//     profileId: profile.id,
//     name,
//     imageUrl,
//     inviteCode: uuid(),
//     channels: {
//       create: [
//         {
//           name: 'general',
//           profileId: profile.id,
//         },
//       ],
//     },
//     members: {
//       create: [
//         {
//           profileId: profile.id,
//           role: MemberRole.ADMIN,
//         },
//       ],
//     },
//   },
