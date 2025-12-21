'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { websiteConfig } from '@/config/website';
import { usePayment } from '@/hooks/use-payment';
import { LocaleLink } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { SparklesIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function UpgradeCard() {
  if (!websiteConfig.features.enableUpgradeCard) {
    return null;
  }

  const t = useTranslations('Dashboard.upgrade');
  const [mounted, setMounted] = useState(false);
  const { isLoading, currentPlan, subscription } = usePayment();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show the upgrade card if the user has a lifetime membership or a subscription
  const isMember = currentPlan?.isLifetime || !!subscription;

  if (!mounted || isLoading || isMember) {
    return null;
  }

  return (
    <Card className="border border-[#d9dde1] bg-white shadow-[0_14px_32px_rgba(0,0,0,0.06)]">
      <CardHeader className="gap-1 p-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#1f242c]">
          <SparklesIcon className="size-4 text-[#6bb4a0]" />
          {t('title')}
        </CardTitle>
        <CardDescription className="text-xs text-[#6a707a]">
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Button
          className="w-full cursor-pointer rounded-lg border border-[#6bb4a0] bg-white text-[#1f4b3e] shadow-none transition hover:bg-[#f1f7f4]"
          size="sm"
          asChild
        >
          <LocaleLink href={Routes.Pricing}>{t('button')}</LocaleLink>
        </Button>
      </CardContent>
    </Card>
  );
}
