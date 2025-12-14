import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { LocaleLink } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { UploadCloud } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Dashboard page
 *
 * NOTICE: This is a demo page for the dashboard, no real data is used,
 * we will show real data in the future
 */
export default function DashboardPage() {
  const t = useTranslations();

  const breadcrumbs = [
    {
      label: t('Dashboard.dashboard.title'),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="flex flex-1 items-center justify-center py-12">
        <div className="flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-border bg-muted/30 p-10 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">{t('Dashboard.empty.title')}</h2>
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
    </>
  );
}
