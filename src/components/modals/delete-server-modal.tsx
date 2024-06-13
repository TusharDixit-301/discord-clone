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
import qs from 'query-string';
import { useState } from 'react';
import { Button } from '../ui/button';

const DeleteServerModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();
  const isModalOpen = isOpen && type === 'deleteServer';

  const serverId = params?.serverId;

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/servers/${serverId}`,
      });
      await axios.delete(url);
      router.refresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-pmDiscord text-black p-0 overflow-hidden dark:text-slate-200">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl text-left font-bold">
            Delete &apos;{data.server?.name}&apos;
          </DialogTitle>
        </DialogHeader>
        <article className="px-6 text-[#D2D5D8] text-start">
          Are you sure you really want to delete
          <span className="font-semibold"> {data.server?.name}</span> server?
          Once deleted, it can not be restored.
        </article>
        <DialogFooter className=" bg-secDiscord/50 flex flex-row gap-x-2 px-5 py-4">
          <Button className="" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white w-20 hover:bg-red-500/90"
            onClick={handleDelete}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
