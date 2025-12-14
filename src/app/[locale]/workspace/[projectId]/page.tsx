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
    <div className="relative min-h-screen bg-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.5,
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-14 pt-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <LocaleLink
              href="/dashboard"
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-white/90"
            >
              {t('Workspace.header.back')}
            </LocaleLink>
            <span>›</span>
            <span className="font-semibold text-slate-800">
              {record.title || 'Untitled'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              {t('Workspace.status.default')}
            </span>
            <UserButton user={session.user} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          {/* Left action panel */}
          <div className="rounded-2xl border border-white/70 bg-white/95 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              {t('Workspace.actions.title')}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t('Workspace.actions.subtitle')}
            </p>

            <div className="mt-6 space-y-3">
              <button className="w-full rounded-xl bg-primary px-4 py-3 text-left text-sm font-semibold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:bg-primary/90">
                {t('Workspace.actions.startRender')}
              </button>
              <button className="w-full rounded-xl bg-slate-100 px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md">
                {t('Workspace.actions.replace')}
              </button>
            </div>
          </div>

          {/* Right canvas */}
          <div className="relative flex items-center justify-center rounded-3xl border border-white/80 bg-white/95 p-6 shadow-xl">
            {record.inputUrl ? (
              <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={record.inputUrl}
                    alt={record.title ?? 'Project input'}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
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
