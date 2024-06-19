import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { NextApiResponseServerIO } from '@/types';
import { MemberRole } from '@prisma/client';
import { NextApiRequest } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content } = req.body;
    const { directMessageId, conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!directMessageId || !conversationId) {
      return res
        .status(400)
        .json({ message: 'DirectMessage ID, Conversation ID is missing' });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const isOwner = directMessage.memberId === member.id;
    const canModify = isAdmin || isModerator || isOwner;

    if (req.method === 'DELETE') {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          deleted: true,
          fileUrl: null,
          content: 'This message has been deleted',
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === 'PATCH') {
      if (!isOwner) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.error('Message POST : ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
