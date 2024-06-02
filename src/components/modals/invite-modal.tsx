'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';
import axios from 'axios';
import { Check, Copy, RefreshCw } from 'lucide-react';
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
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite People
          </DialogTitle>
        </DialogHeader>
        <article className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite link
          </Label>
          <article className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteLink}
            />
            <Button disabled={isLoading} size="icon" onClick={onCopy}>
              {copied ? (
                <Check className="w-4 h-4 text-green-400 font-bold" />
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
