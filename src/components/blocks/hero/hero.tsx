'use client';

import { createProjectAction } from '@/actions/create-project';
import { uploadFileFromBrowser } from '@/storage';
import { CloudUpload, Sparkles, UploadCloud } from 'lucide-react';
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
    <main
      id="hero"
      className="relative min-h-[88vh] overflow-hidden bg-[#f5f6f7] text-[#1a1d24]"
    >
      {/* Soft paper texture + right-half grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cpath d=%22M0 0h40v40H0z%22 fill=%22none%22/%3E%3Cpath d=%22M40 0H0v40%22 stroke=%22%23e5e7eb%22 stroke-width=%220.5%22 opacity=%220.32%22/%3E%3C/svg%3E')] opacity-[0.35]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.7),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.55),transparent_40%)]" />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-6 pb-24 pt-20 md:flex-row md:items-center md:gap-16 md:px-10 lg:px-16">
        {/* Left column: copy + CTA */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9dde1] bg-white/70 px-3.5 py-1 text-xs font-medium text-[#6a707a] shadow-[0_6px_18px_rgba(0,0,0,0.03)]">
            <Sparkles className="size-3 text-[#6bb4a0]" />
            <span>AI architectural rendering</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-bricolage-grotesque text-4xl leading-[1.2] tracking-[0.01em] md:text-5xl">
              How will your project look like?
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[#4f5560]">
              Upload a single drawing and see photorealistic renders in minutes.
            </p>
          </div>

          <div className="w-full max-w-xl space-y-3">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
              className="group flex w-full items-stretch gap-3 rounded-2xl border border-[#d9dde1] bg-white/90 p-4 text-left shadow-[0_18px_45px_rgba(0,0,0,0.06)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#cfd4da] hover:shadow-[0_22px_55px_rgba(0,0,0,0.08)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="flex-1 space-y-1">
                <div className="text-[17px] font-semibold text-[#1d2128]">
                  {isUploading ? 'Uploading…' : 'Upload your drawing'}
                </div>
                <div className="text-sm text-[#6a707a]">
                  PNG / JPG / JPEG · sketch / floor plan / elevation / photo
                </div>
              </div>

              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6bb4a0] text-white transition duration-200 ease-out group-hover:brightness-[1.07]">
                <UploadCloud className="size-5" />
              </span>
            </button>

          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Right column: preview card */}
        <div className="flex flex-1 justify-center md:justify-end">
          <div className="relative w-full max-w-[420px] rounded-2xl border border-[#d9dde1] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3 text-xs font-medium text-[#6a707a]">
              <span>Preview</span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#d9dde1] px-2 py-0.5 text-[11px] text-[#1f4b3e]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6bb4a0]" />
                  After
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#d9dde1] px-2 py-0.5 text-[11px] text-[#6a707a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#cdd2d8]" />
                  Before
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-52 rounded-xl border border-[#e4e7eb] bg-gradient-to-br from-[#f8fafc] to-[#eef2f6]" aria-label="Before sketch placeholder">
                  <div className="absolute inset-3 rounded-lg border border-dashed border-[#cfd4da]" />
                  <div className="absolute left-3 top-3 text-[11px] uppercase tracking-[0.08em] text-[#8a9099]">
                    Before
                  </div>
                </div>
                <div className="relative h-52 rounded-xl border border-[#e4e7eb] bg-gradient-to-br from-[#d7efe6] via-white to-[#eef4ff] shadow-[0_16px_40px_rgba(0,0,0,0.05)]" aria-label="After render placeholder">
                  <div className="absolute inset-3 rounded-lg bg-[radial-gradient(circle_at_30%_30%,rgba(107,180,160,0.25),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(75,130,243,0.22),transparent_40%)]" />
                  <div className="absolute left-3 top-3 text-[11px] uppercase tracking-[0.08em] text-[#2f4c43]">
                    After
                  </div>
                  <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[10px] font-medium text-[#1f4b3e] shadow-sm">
                    <CloudUpload className="size-3" />
                    AI render
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
