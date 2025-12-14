import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { project } from '@/db/schema';
import { LocaleLink } from '@/i18n/navigation';
import { getSession } from '@/lib/server';
import { Routes } from '@/routes';
import { eq } from 'drizzle-orm';
import { UploadCloud } from 'lucide-react';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDb } from '@/db';

/**
 * Dashboard page
 *
 * NOTICE: This is a demo page for the dashboard, no real data is used,
 * we will show real data in the future
 */
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
    .orderBy(project.createdAt);

  const breadcrumbs = [
    {
      label: t('Dashboard.dashboard.title'),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      {projects.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-border bg-muted/30 p-10 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">
              {t('Dashboard.empty.title')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('Dashboard.empty.description')}
            </p>
            <LocaleLink
              href={Routes.Root}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              {t('Dashboard.empty.cta')}
            </LocaleLink>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <LocaleLink
              key={p.id}
              href={`/dashboard/${p.id}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-40 w-full overflow-hidden bg-muted">
                {p.inputUrl ? (
                  <Image
                    src={p.inputUrl}
                    alt={p.title ?? 'Project'}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                ) : null}
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-left">
                  <p className="text-sm font-semibold line-clamp-1">
                    {p.title || 'Untitled'}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {p.status}
                  </p>
                </div>
                <span className="text-xs rounded-full bg-muted px-3 py-1 text-muted-foreground">
                  {t('Dashboard.card.open')}
                </span>
              </div>
            </LocaleLink>
          ))}
        </div>
      )}
    </>
  );
}
