'use client';
import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile, Server } from '@prisma/client';
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ActionTooltip from '../action-tooltip';
import UserAvatar from '../user-avatar';

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: (
    <ActionTooltip
      label="Guest"
      className="text-xs font-light bg-transparent capitalize"
    >
      <ShieldQuestion className="ml-auto h-4 w-4 text-green-500" />
    </ActionTooltip>
  ),
  [MemberRole.MODERATOR]: (
    <ActionTooltip
      label="Moderator"
      className="text-xs font-light bg-transparent capitalize"
    >
      <ShieldCheck className="ml-auto h-4 w-4 text-indigo-500" />
    </ActionTooltip>
  ),
  [MemberRole.ADMIN]: (
    <ActionTooltip
      label="Admin"
      className="text-xs font-light bg-transparent capitalize"
    >
      <ShieldAlert className="ml-auto h-4 w-4 text-rose-500" />
    </ActionTooltip>
  ),
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[member?.role];

  const onClick = () => {
    router.push(`/servers/${server?.id}/conversations/${member?.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/20',
        params?.memberId == member?.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        src={member?.profile?.imageUrl}
        className="h-8 w-8 md:h-5 md:w-5"
      />
      <p
        className={cn(
          'dark:text=zinc-500 line-clamp-1 text-sm font-normal text-zinc-500 transition group-hover:text-zinc-600 dark:group-hover:text-zinc-300',
          params?.memberId === member?.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member?.profile?.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
