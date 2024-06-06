'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';

const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();
  const isModalOpen = isOpen && type === 'leaveServer';
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => {
    onClose();
  };

  const serverId = params.serverId;

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete(`/api/servers/${serverId}/leave-server`);
      router.refresh();
      onClose();
    } catch (error) {
      console.error('An error occurred while leaving the server', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-pmDiscord text-black p-0 overflow-hidden dark:text-slate-200">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl text-left font-bold">
            Leave &apos;{data.server?.name}&apos;
          </DialogTitle>
        </DialogHeader>
        <article className="px-6 text-[#D2D5D8] text-start">
          Do you really want to leave{' '}
          <span className="font-semibold">{data.server?.name}</span>? You
          won&apos;t be able to rejoin this server unless you are invited back.
        </article>
        <DialogFooter className=" bg-secDiscord/50 flex flex-row gap-x-2 px-5 py-4">
          <Button className="" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white w-28 hover:bg-red-500/90"
            onClick={handleLeaveServer}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Leave Server'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
