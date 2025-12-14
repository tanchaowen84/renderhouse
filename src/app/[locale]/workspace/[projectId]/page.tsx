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
import { ArrowLeftIcon } from 'lucide-react';
import { WorkspaceClient } from './workspace-client';

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
        
        {/* Client Component for Interactive Sidebar & Canvas */}
        <WorkspaceClient 
          initialRecord={record}
          messages={{
            actions: {
              title: t('Workspace.actions.title'),
              subtitle: t('Workspace.actions.subtitle'),
              startRender: t('Workspace.actions.startRender'),
              replace: t('Workspace.actions.replace'),
            },
            noInput: t('Workspace.noInput')
          }}
        />

      </main>
    </div>
  );
}
