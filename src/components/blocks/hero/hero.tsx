'use client';

import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
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

          <div className="mt-10 w-full max-w-4xl rounded-2xl border border-border bg-background shadow-xl">
            <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-left">
                <p className="text-lg font-semibold">{t('uploadTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('uploadSub')}</p>
              </div>
              <Button
                type="button"
                size="lg"
                className="gap-2"
                onClick={handleUploadClick}
              >
                <Upload className="h-5 w-5" />
                {t('uploadButton')}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
