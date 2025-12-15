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
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#f5f6f7] text-[#1f242c]">
      {/* Subtle grid on right half */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cpath d=%22M0 0h40v40H0z%22 fill=%22none%22/%3E%3Cpath d=%22M40 0H0v40%22 stroke=%22%23e5e7eb%22 stroke-width=%220.5%22 opacity=%220.32%22/%3E%3C/svg%3E')] opacity-30" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.7),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.5),transparent_40%)]" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex h-16 w-full items-center justify-between px-6 pt-4">
        <div className="flex items-center gap-3 rounded-full border border-[#d9dde1] bg-white/90 px-4 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.05)] backdrop-blur">
          <LocaleLink
            href="/dashboard"
            className="flex items-center justify-center rounded-full p-1.5 text-[#4c525c] transition-colors hover:bg-[#f3f5f8]"
          >
            <ArrowLeftIcon className="size-4" />
          </LocaleLink>
          <div className="h-4 w-px bg-[#e3e6ea]" />
          <span className="text-sm font-medium text-[#1f242c]">
            {record.title || 'Untitled Project'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#d9dde1] bg-white/90 px-3.5 py-1.5 text-xs font-medium text-[#1f4b3e] shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6bb4a0] opacity-60"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6bb4a0]"></span>
            </span>
            <span>Free plan · 2 credits left</span>
          </div>
          <div className="rounded-full border border-[#d9dde1] bg-white p-0.5 shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
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
