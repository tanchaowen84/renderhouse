import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { project } from '@/db/schema';
import { LocaleLink } from '@/i18n/navigation';
import { getSession } from '@/lib/server';
import { Routes } from '@/routes';
import { eq, desc } from 'drizzle-orm';
import { UploadCloud, ArrowRight, Layers } from 'lucide-react';
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

      {/* Main Content Area - Dark Tech Theme */}
      <div className="flex-1 bg-[#0F1117] p-6 min-h-[calc(100vh-64px)]">
        {projects.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-white/5 bg-[#1E293B]/40 p-12 text-center shadow-2xl backdrop-blur-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]">
                <UploadCloud className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {t('Dashboard.empty.title')}
                </h2>
                <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {t('Dashboard.empty.description')}
                </p>
              </div>
              
              <LocaleLink
                href={Routes.Root}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-indigo-500/40"
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
              className="group relative flex h-full min-h-[280px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="font-semibold text-slate-300 group-hover:text-white transition-colors">Create New Project</p>
            </LocaleLink>

            {projects.map((p) => (
              <LocaleLink
                key={p.id}
                href={`/workspace/${p.id}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#1E293B]/60 shadow-xl backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-500/30"
              >
                {/* Image Area */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#02040a]">
                  {p.inputUrl ? (
                    <Image
                      src={p.inputUrl}
                      alt={p.title ?? 'Project'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-600">
                      <Layers className="h-8 w-8 opacity-20" />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent opacity-60" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md border border-white/10 uppercase tracking-wider">
                    {p.status}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {p.title || 'Untitled Project'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Last edited {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {/* Avatar placeholder if needed */}
                      <div className="h-6 w-6 rounded-full bg-indigo-500/20 border border-[#1E293B]" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-indigo-400 opacity-0 transform translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
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
