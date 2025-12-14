'use client';

import { CloudUpload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function HeroSection() {
  const t = useTranslations('HomePage.hero');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`${file.name} ready. Rendering will be available soon.`);
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
            className="group mt-10 w-full max-w-4xl rounded-[28px] border border-white/30 bg-white/30 shadow-xl shadow-black/15 backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:shadow-[0_32px_70px_-40px_rgba(0,0,0,0.45)]"
          >
            <div className="flex flex-col gap-4 px-6 py-6 text-left sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {t('uploadTitle')}
                </p>
                <p className="text-sm text-muted-foreground">{t('uploadSub')}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-foreground shadow-lg shadow-black/20 transition group-hover:scale-105">
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
