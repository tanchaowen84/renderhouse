'use server';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { project } from '@/db/schema';
import { getSession } from '@/lib/server';
import { eq } from 'drizzle-orm';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDb } from '@/db';

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

  const breadcrumbs = [
    { label: t('Dashboard.dashboard.title'), href: '/dashboard' },
    { label: record.title || 'Untitled', isCurrentPage: true },
  ];

  return (
    <div className="flex h-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="relative flex flex-1 flex-col gap-6 bg-gradient-to-b from-background/80 to-background px-6 pb-10">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          {/* Left action panel */}
          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(28,30,36,0.72)_0%,rgba(18,18,20,0.58)_100%)] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">
              {t('Workspace.actions.title')}
            </h2>
            <p className="mt-2 text-sm text-white/80">
              {t('Workspace.actions.subtitle')}
            </p>

            <div className="mt-6 space-y-4">
              <button className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/15">
                {t('Workspace.actions.startRender')}
              </button>
              <button className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:-translate-y-0.5 hover:bg-white/10">
                {t('Workspace.actions.replace')}
              </button>
            </div>
          </div>

          {/* Right canvas */}
          <div className="relative flex items-center justify-center rounded-2xl border border-border bg-muted/20">
            {record.inputUrl ? (
              <div className="relative h-[460px] w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                <Image
                  src={record.inputUrl}
                  alt={record.title ?? 'Project input'}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('Workspace.noInput')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
