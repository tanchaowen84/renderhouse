'use server';

import { project } from '@/db/schema';
import { LocaleLink } from '@/i18n/navigation';
import { getSession } from '@/lib/server';
import { UserButton } from '@/components/layout/user-button';
import { eq } from 'drizzle-orm';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDb } from '@/db';
import { ArrowLeftIcon, SparklesIcon, RefreshCwIcon, UploadIcon, LayersIcon } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: Locale; projectId: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { locale, projectId } = await params;
  const t = await getTranslations();
  const session = await getSession();
  if (!session) notFound();

  const db = await getDb();
  const record = await db
    .select()
    .from(project)
    .where(eq(project.id, projectId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!record || record.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#0F1117] text-slate-200">
      {/* Dark Grid Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Vignette effect */}
      <div 
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,17,23,0.8)_100%)]"
      />

      {/* Header - Minimal & Floating */}
      <header className="relative z-20 flex h-16 w-full items-center justify-between px-6 pt-4">
        <div className="flex items-center gap-3 rounded-full bg-slate-900/50 px-4 py-2 backdrop-blur-md border border-white/5">
          <LocaleLink
            href="/dashboard"
            className="flex items-center justify-center rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="size-4" />
          </LocaleLink>
          <div className="h-4 w-px bg-white/10" />
          <span className="font-medium text-slate-200 text-sm">
            {record.title || 'Untitled Project'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-slate-900/50 px-3 py-1.5 text-xs font-medium text-slate-400 border border-white/5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {t('Workspace.status.default')}
          </div>
          <div className="rounded-full border border-white/10 p-0.5 bg-slate-900/50 backdrop-blur-md">
            <UserButton user={session.user} />
          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="relative z-10 flex flex-1 overflow-hidden">
        
        {/* Floating Action Panel (Left) */}
        <div className="absolute left-6 top-6 z-30 w-80 animate-in slide-in-from-left-4 fade-in duration-500">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#1E293B]/80 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-slate-100">
                <LayersIcon className="size-5 text-indigo-400" />
                <h2 className="text-lg font-bold">
                  {t('Workspace.actions.title')}
                </h2>
              </div>
              <p className="mb-6 text-xs leading-relaxed text-slate-400">
                {t('Workspace.actions.subtitle')}
              </p>

              <div className="space-y-3">
                <button className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-[1px] shadow-lg transition-all hover:shadow-indigo-500/25 active:scale-[0.98]">
                  <div className="relative flex items-center gap-3 rounded-xl bg-[#1E293B]/40 px-4 py-3.5 backdrop-blur-sm transition-colors group-hover:bg-transparent">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white shadow-inner">
                      <SparklesIcon className="size-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-white">
                        {t('Workspace.actions.startRender')}
                      </span>
                      <span className="text-[10px] text-indigo-100/70">
                        Generate new AI render
                      </span>
                    </div>
                  </div>
                </button>

                <button className="group w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3.5 text-left transition-all hover:bg-white/10 hover:border-white/10 active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                      <RefreshCwIcon className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                        {t('Workspace.actions.replace')}
                      </span>
                      <span className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors">
                        Upload different image
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Quick Tips / Status could go here */}
            {/* <div className="rounded-xl border border-white/5 bg-[#1E293B]/50 p-4 backdrop-blur-md">
               ...
            </div> */}
          </div>
        </div>

        {/* Image Stage (Center) */}
        <div className="flex h-full w-full items-center justify-center p-8 lg:pl-96 animate-in zoom-in-95 fade-in duration-700">
          {record.inputUrl ? (
            <div className="relative group max-h-[85vh] max-w-[90%]">
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10 bg-[#1E293B]">
                <Image
                  src={record.inputUrl}
                  alt={record.title ?? 'Project input'}
                  width={1920}
                  height={1080}
                  className="h-auto w-auto max-h-[80vh] max-w-full object-contain"
                  priority
                />
                
                {/* Hover Overlay Actions (Optional future enhancement) */}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 pointer-events-none" />
              </div>
              
              {/* Image Info Label (Bottom Center) */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-md">
                  Original Input
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 ring-1 ring-white/10 border border-dashed border-white/10">
                <UploadIcon className="size-8 opacity-50" />
              </div>
              <p className="font-medium">{t('Workspace.noInput')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
