import { ScrollArea } from '@/components/ui/scroll-area';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ChannelType, MemberRole } from '@prisma/client';
import {
  Hash,
  Mic,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Video,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import ServerHeader from './server-header';
import ServerSearch from './server-search';

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: (
    <ShieldQuestion className="mr-2 h-4 w-4 text-green-500" />
  ),
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-red-500" />,
};

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }
  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  // #1E1F22
  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );

  const myRole = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <main className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={myRole} />
      <ScrollArea className="flex-1 px-3">
        <ServerSearch
          data={[
            {
              label: 'Text Channels',
              type: 'channel',
              data: textChannels.map((channel) => ({
                icon: channelIconMap[channel.type],
                name: channel.name,
                id: channel.id,
              })),
            },
            {
              label: 'Voice Channels',
              type: 'channel',
              data: audioChannels.map((channel) => ({
                icon: channelIconMap[channel.type],
                name: channel.name,
                id: channel.id,
              })),
            },
            {
              label: 'Video Channels',
              type: 'channel',
              data: videoChannels.map((channel) => ({
                icon: channelIconMap[channel.type],
                name: channel.name,
                id: channel.id,
              })),
            },
            {
              label: 'Members',
              type: 'member',
              data: members.map((member) => ({
                icon: roleIconMap[member.role],
                name: member.profile.name,
                id: member.id,
              })),
            },
          ]}
        />
      </ScrollArea>
    </main>
  );
};

export default ServerSidebar;
