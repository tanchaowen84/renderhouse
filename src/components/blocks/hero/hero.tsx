'use client';

import { createProjectAction } from '@/actions/create-project';
import { uploadFileFromBrowser } from '@/storage';
import { CloudUpload, Sparkles } from 'lucide-react';
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
    <main id="hero" className="relative overflow-hidden bg-[#0F1117] min-h-[90vh] flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Subtle Gradient Spotlights - Indigo/Blue instead of heavy Purple */}
        <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        
        {/* Grid Texture */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0F1117_100%)]" />
      </div>

      <section className="relative z-10 w-full">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 text-center">
          
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="size-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">AI Architecture Rendering</span>
          </div>

          <h1 className="text-balance text-5xl font-bold tracking-tight text-white sm:text-7xl font-bricolage-grotesque leading-[1.1]">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            {t('description')}
          </p>

          <button
            type="button"
            onClick={handleUploadClick}
            className="group relative mt-12 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#1E293B]/60 p-1 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/20 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isUploading}
          >
            {/* Inner Content Area */}
            <div className="relative flex items-center justify-between rounded-xl bg-[#0F1117]/80 border border-white/5 px-8 py-8 transition-colors group-hover:bg-[#0F1117]/60">
              <div className="flex flex-col items-start gap-2">
                <p className="text-xl font-semibold text-white">
                  {isUploading ? 'Uploading...' : t('uploadTitle')}
                </p>
                <p className="text-sm text-slate-400">{t('uploadSub')}</p>
              </div>
              
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500">
                <CloudUpload className="h-7 w-7" />
              </div>
            </div>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
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
