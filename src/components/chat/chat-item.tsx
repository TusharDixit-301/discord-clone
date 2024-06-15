'use client';
import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Member, MemberRole, Profile } from '@prisma/client';
import axios from 'axios';
import {
  Edit,
  FileIcon,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Trash,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ActionTooltip from '../action-tooltip';
import { Button } from '../ui/button';
import { Form, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import UserAvatar from '../user-avatar';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  [MemberRole.GUEST]: (
    <ShieldQuestion className="h-4 w-4 text-green-500 ml-2" />
  ),
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-red-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;

  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;

  const fileType = fileUrl?.split('.').pop();
  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save edit message : ', error);
    }
  };

  const onMemberClick = () => {
    if (member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  useEffect(() => {
    form.reset({ content });
  }, [content, form]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <main className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <section className="group flex gap-x-2 items-start w-full">
        <figure
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </figure>
        <section className="flex flex-col w-full">
          <article className="flex items-center gap-x-2">
            <article className="flex items-center">
              <p
                className="font-semibold text-sm hover:underline cursor-pointer"
                onClick={onMemberClick}
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </article>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </article>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <article className="flex items-center relative p-2 mt-2 rounded-md bg-background/10">
              <FileIcon
                className="h-20 w-20 fill-indigo-200 stroke-indigo-400 hover:cursor-pointer"
                onClick={() => {
                  window.open(fileUrl, '_blank', 'noopener,noreferrer');
                }}
              />
            </article>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="relative w-full">
                        <Input
                          disabled={isLoading}
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          placeholder="Edited message"
                          {...field}
                        />
                      </div>
                    </FormItem>
                  )}
                />

                <Button size="sm" variant="primary">
                  {isLoading ? <Loader2 className=" animate-spin" /> : 'Save'}
                </Button>
              </form>
              <span className="text-[10px] text-zinc-400 mt-1">
                Please press escape to cancel, Enter to save
              </span>
            </Form>
          )}
        </section>
      </section>
      {canDeleteMessage && (
        <article className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
            />
          </ActionTooltip>
        </article>
      )}
    </main>
  );
};

export default ChatItem;
