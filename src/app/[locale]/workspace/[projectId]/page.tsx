'use server';

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_35%)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-14 pt-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase text-white/60">Workspace</p>
            <h1 className="text-2xl font-semibold text-white">
              {record.title || 'Untitled'}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          {/* Left action panel */}
          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(28,30,36,0.78)_0%,rgba(15,16,20,0.7)_100%)] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">
              {t('Workspace.actions.title')}
            </h2>
            <p className="mt-2 text-sm text-white/80">
              {t('Workspace.actions.subtitle')}
            </p>

            <div className="mt-6 space-y-3">
              <button className="w-full rounded-xl bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/16">
                {t('Workspace.actions.startRender')}
              </button>
              <button className="w-full rounded-xl bg-white/6 px-4 py-3 text-left text-sm text-white/80 transition hover:-translate-y-0.5 hover:bg-white/10">
                {t('Workspace.actions.replace')}
              </button>
            </div>
          </div>

          {/* Right canvas */}
          <div className="relative flex items-center justify-center rounded-2xl border border-white/8 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(0,0,0,0.08))] p-4 shadow-inner shadow-black/30">
            {record.inputUrl ? (
              <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-black/30 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.35),transparent_45%)] pointer-events-none" />
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
