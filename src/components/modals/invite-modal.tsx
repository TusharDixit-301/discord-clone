'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Check, Copy, Hash, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === 'invite';
  const { server } = data;
  const inviteLink = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  const regenerateLink = async () => {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen('invite', { server: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-pmDiscord text-black p-0 overflow-hidden dark:text-slate-200">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl text-left font-bold">
            Invite friends to {server?.name}
            <p className="flex flex-row gap-x-1 mt-2">
              <Hash className="w-4 h-4 text-gray-300/70" />
              <span className="text-sm text-gray-300/40 font-medium">
                general
              </span>
            </p>
          </DialogTitle>
        </DialogHeader>
        <article className="py-4 px-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-gray-400/80">
            send a server invite link to a friend
          </Label>
          <article className="flex items-center mt-2 gap-x-1">
            <Input
              disabled={isLoading}
              className="bg-secDiscord border-0 focus-visible:ring-0 text-gray-200 focus-visible:ring-offset-0"
              value={inviteLink}
            />
            <Button
              disabled={isLoading}
              size="icon"
              onClick={onCopy}
              className={cn(
                copied
                  ? 'bg-[#248046]/80 hover:bg-[#248046] w-16'
                  : 'bg-[#5865F2]/80 hover:bg-[#5865F2] w-16'
              )}
            >
              {copied ? (
                <Check className="w-4 h-4 font-bold text-white" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </article>
          <Button
            disabled={isLoading}
            className="text-xs text-zinc-500 mt-4"
            variant="link"
            size="sm"
            onClick={regenerateLink}
          >
            Generate New Link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </article>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
