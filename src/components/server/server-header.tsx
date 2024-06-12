'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersAndProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface ServerHeaderProps {
  server: ServerWithMembersAndProfiles;
  role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu onOpenChange={(open) => setMenuOpen(open)}>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          {menuOpen ? (
            <X className="h-5 w-5 ml-auto" />
          ) : (
            <ChevronDown className="h-5 w-5 ml-auto" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] bg-[#111214]">
        {isModerator && (
          <DropdownMenuItem
            className="text-indigo-400 hover:bg-indigo-500 hover:text-white px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen('invite', { server })}
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-600 hover:text-white"
            onClick={() => onOpen('editServer', { server })}
          >
            Server Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer group-hover:bg-indigo-600 hover:text-white"
            onClick={() => onOpen('members', { server })}
          >
            Manage Members
            <User className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-600 hover:text-white"
            onClick={() => onOpen('createChannel')}
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => onOpen('deleteServer', { server })}
          >
            Delete Server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className="dark:text-red-500 px-3 py-2 text-sm cursor-pointer text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => onOpen('leaveServer', { server })}
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
