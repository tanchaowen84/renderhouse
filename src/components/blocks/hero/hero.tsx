'use client';

import { createProjectAction } from '@/actions/create-project';
import { uploadFileFromBrowser } from '@/storage';
import { CloudUpload } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function HeroSection() {
  const t = useTranslations('HomePage.hero');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
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

      if (result?.error === 'Unauthorized') {
        const cb = encodeURIComponent(pathname || '/');
        router.push(`/${locale}/auth/login?callbackUrl=${cb}`);
        return;
      }

      const projectId = result?.data?.projectId ?? result?.projectId;
      if (!projectId) {
        toast.error(result?.error ?? 'Create project failed');
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
    <main id="hero" className="bg-gradient-to-b from-background to-muted/60">
      <section className="relative">
        <div className="mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-balance text-4xl font-bricolage-grotesque leading-tight sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {t('description')}
          </p>

          <button
            type="button"
            onClick={handleUploadClick}
            className="group relative mt-10 w-full max-w-3xl overflow-hidden rounded-[26px] border border-white/50 bg-[linear-gradient(135deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.16)_100%)] shadow-2xl shadow-black/20 backdrop-blur-xl ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_26px_60px_-36px_rgba(0,0,0,0.35)] dark:border-white/15 dark:bg-[linear-gradient(135deg,rgba(28,30,36,0.72)_0%,rgba(18,18,20,0.58)_100%)] dark:shadow-black/40 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_75%_15%,rgba(255,255,255,0.14),transparent_30%)] opacity-90" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/5 mix-blend-screen opacity-70" />
            <div className="relative flex flex-col gap-4 px-6 py-6 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-lg font-semibold text-foreground drop-shadow-sm">
                  {t('uploadTitle')}
                </p>
                <p className="text-sm text-muted-foreground">{t('uploadSub')}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/25 transition group-hover:scale-105">
                <CloudUpload className="h-6 w-6" />
              </div>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </section>
    </main>
  );
}
