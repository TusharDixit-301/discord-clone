import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import MediaRoom from '@/components/media-room';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const { serverId, channelId } = params;

  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      serverId: serverId,
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect('/');
  }

  return (
    <div className="bg-white dark:bg-pmDiscord flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            apiUrl="/api/socket/messages"
            name={channel.name}
            query={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
            type="channel"
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
