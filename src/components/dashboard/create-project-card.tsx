'use client';

import { createProjectAction } from '@/actions/create-project';
import { uploadFileFromBrowser } from '@/storage';
import { UploadCloud } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export function CreateProjectCard() {
  const locale = useLocale();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      toast.error('Only PNG or JPG supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be 10MB or smaller.');
      return;
    }

    setIsUploading(true);
    try {
      const upload = await uploadFileFromBrowser(file);
      if (!upload?.url) throw new Error('Upload failed');

      const result: any = await createProjectAction({
        inputUrl: upload.url,
        title: file.name,
      });

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }

      if (result?.validationErrors) {
        const first = Object.values(result.validationErrors)[0] as
          | string[]
          | undefined;
        toast.error(first?.[0] ?? 'Invalid input');
        return;
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      const projectId = result?.data?.projectId ?? result?.projectId;
      if (!projectId) {
        toast.error('Create project failed');
        return;
      }
      toast.success('Project created');
      router.push(`/${locale}/workspace/${projectId}`);
    } catch (err) {
      console.error(err);
      toast.error('Upload or project creation failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleUploadClick}
        disabled={isUploading}
        className="group relative flex h-full min-h-[260px] w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[#cfd4da] bg-white p-6 text-[#1f242c] transition hover:border-[#6bb4a0] hover:bg-[#f6faf8] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9dde1] bg-white text-[#1f4b3e] transition-transform group-hover:scale-105">
          <UploadCloud className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold">
          {isUploading ? 'Uploading…' : 'Create New Project'}
        </p>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
