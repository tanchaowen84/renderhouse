import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { project } from '@/db/schema';
import { LocaleLink } from '@/i18n/navigation';
import { getSession } from '@/lib/server';
import { Routes } from '@/routes';
import { desc, eq } from 'drizzle-orm';
import { ArrowRight, Layers, UploadCloud } from 'lucide-react';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDb } from '@/db';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations();
  const session = await getSession();
  if (!session) {
    notFound();
  }

  const db = await getDb();
  const projects = await db
    .select()
    .from(project)
    .where(eq(project.userId, session.user.id))
    .orderBy(desc(project.createdAt));

  const breadcrumbs = [
    {
      label: t('Dashboard.dashboard.title'),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      {/* Main Content Area - Light, paper-inspired */}
      <div className="flex-1 min-h-[calc(100vh-64px)] bg-[#f5f6f7] px-6 pb-10 pt-8">
        {projects.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-[#d9dde1] bg-white p-12 text-center shadow-[0_22px_50px_rgba(0,0,0,0.08)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9dde1] bg-white text-[#1f4b3e]">
                <UploadCloud className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-[#1f242c] tracking-tight">
                  {t('Dashboard.empty.title')}
                </h2>
                <p className="mx-auto max-w-xs text-[#6a707a] leading-relaxed">
                  {t('Dashboard.empty.description')}
                </p>
              </div>

              <LocaleLink
                href={Routes.Root}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#1f4b3e] bg-[#1f4b3e] px-8 py-3 text-sm font-semibold text-white transition hover:brightness-[1.05]"
              >
                <span>{t('Dashboard.empty.cta')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </LocaleLink>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* New Project Card (Quick Action) */}
            <LocaleLink
              href={Routes.Root}
              className="group relative flex h-full min-h-[260px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[#cfd4da] bg-white p-6 text-[#1f242c] transition hover:border-[#6bb4a0] hover:bg-[#f6faf8]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9dde1] bg-white text-[#1f4b3e] transition-transform group-hover:scale-105">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold">Create New Project</p>
            </LocaleLink>

            {projects.map((p) => (
              <LocaleLink
                key={p.id}
                href={`/workspace/${p.id}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#e0e4ea] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.07)] transition-all hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(0,0,0,0.1)]"
              >
                {/* Image Area */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0f2f5]">
                  {p.inputUrl ? (
                    <Image
                      src={p.inputUrl}
                      alt={p.title ?? 'Project'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#b3bac3]">
                      <Layers className="h-8 w-8 opacity-50" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 rounded-full border border-[#d9dde1] bg-white/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[#4c525c]">
                    {p.status}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-[#1f242c] line-clamp-1 transition-colors group-hover:text-[#1f4b3e]">
                      {p.title || 'Untitled Project'}
                    </h3>
                    <p className="text-xs text-[#6a707a]">
                      Last edited {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full border border-[#d9dde1] bg-white" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-[#1f4b3e] opacity-0 translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      Open Workspace <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </LocaleLink>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
