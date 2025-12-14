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
    <Card className="shadow-none border border-white/10 bg-indigo-500/10 backdrop-blur-sm">
      <CardHeader className="gap-2 p-4">
        <CardTitle className="flex items-center gap-2 text-indigo-100 text-sm">
          <SparklesIcon className="size-4 text-indigo-400" />
          {t('title')}
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Button 
          className="cursor-pointer w-full shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white border-0" 
          size="sm"
          asChild
        >
          <LocaleLink href={Routes.SettingsBilling}>{t('button')}</LocaleLink>
        </Button>
      </CardContent>
    </Card>
  );
}
