'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import { X } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'messageFile' | 'serverImage';
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value.split('.').pop();

  if (value && fileType !== 'pdf') {
    return (
      <figure className="relative h-20 w-20">
        <Skeleton className="h-full w-full rounded-full" />
        <Image
          fill
          src={value}
          alt="Uploaded image"
          className="w-full h-full rounded-full shadow-lg"
        />
        <button
          onClick={() => onChange('')}
          className="bg-red-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-lg border-red-700"
        >
          <X className="h-4 w-4" />
        </button>
      </figure>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(err) => {
        console.error(err);
      }}
    />
  );
};

export default FileUpload;
