import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { DirectMessage } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGES_BATCH = 10;
export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = Number(searchParams.get('cursor'));
    const conversationId = searchParams.get('conversationId');

    if (!profile) {
      return new NextResponse('You must be logged in to create a server', {
        status: 401,
      });
    }
    if (!conversationId) {
      return new NextResponse('Channel Id is required', {
        status: 400,
      });
    }
    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        where: {
          conversationId,
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
      messages = await db.directMessage.findMany({
        where: {
          conversationId,
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
    console.error('ERROR in Direct Message Fetching ', error);
    return new NextResponse('An error occurred while fetching the messages', {
      status: 500,
    });
  }
}
