import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGES_BATCH = 10;
export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = Number(searchParams.get('cursor'));
    const channelId = searchParams.get('channelId');

    if (!profile) {
      return new NextResponse('You must be logged in to create a server', {
        status: 401,
      });
    }
    if (!channelId) {
      return new NextResponse('Channel Id is required', {
        status: 400,
      });
    }
    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        take: MESSAGES_BATCH,
        cursor: {
          id: cursor.toString(),
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        take: MESSAGES_BATCH,
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
    let nexCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nexCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor: nexCursor,
    });
  } catch (error) {
    console.error('ERROR in Message Fetching ', error);
    return new NextResponse(
      'An error occurred while fetching the message from the channel',
      {
        status: 500,
      }
    );
  }
}
