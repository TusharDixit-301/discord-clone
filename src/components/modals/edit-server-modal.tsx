'use client';
import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/use-modal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters long',
    })
    .max(32),
  imageUrl: z
    .string()
    .min(1, {
      message: 'Server image is required',
    })
    .url({ message: 'Server image must be a valid URL' }),
});

const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === 'editServer';
  const { server } = data;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name);
      form.setValue('imageUrl', server.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-pmDiscord text-black p-0 overflow-hidden dark:text-slate-200">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl text-left font-bold">
            Customize your server !
          </DialogTitle>
          <DialogDescription className="text-left text-gray-300/40">
            Give your server a personality by adding a name and a profile
            picture.You can always change this later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <article className="space-y-8 px-6">
              <article className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </article>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-gray-400/80">
                      Server Name
                    </FormLabel>
                    <FormControl
                      className="bg-zinc-300/50 border-0 text-black 
                                        focus-visible:ring-0
                                        focus-visible:ring-offset-0
                                        "
                    >
                      <Input
                        disabled={isLoading}
                        className="bg-secDiscord text-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Please enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </article>

            <DialogFooter className=" bg-secDiscord/50 flex flex-row gap-x-2 px-5 py-4">
              <Button
                disabled={isLoading}
                className="w-32 bg-[#5865F2]/80 hover:bg-[#5865F2] text-white"
              >
                {isLoading ? <Loader2 className=" animate-spin" /> : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
