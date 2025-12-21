'use client';

import type { PricePlan } from '@/payment/types';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get price plans with translations for client components
 *
 * NOTICE: This function should only be used in client components.
 * If you need to get the price plans in server components, use getAllPricePlans instead.
 * Use this function when showing the pricing table or the billing card to the user.
 *
 * docs:
 * https://mksaas.com/docs/config/price
 *
 * @returns The price plans with translated content
 */
export function getPricePlans(): Record<string, PricePlan> {
  const t = useTranslations('PricePlans');
  const priceConfig = websiteConfig.price;
  const plans: Record<string, PricePlan> = {};

  // Add translated content to each plan
  if (priceConfig.plans.free) {
    plans.free = {
      ...priceConfig.plans.free,
      name: t('free.name'),
      description: t('free.description'),
      features: [
        t('free.features.feature-1'),
        t('free.features.feature-2'),
        t('free.features.feature-3'),
        t('free.features.feature-4'),
      ],
      limits: [
        t('free.limits.limit-1'),
        t('free.limits.limit-2'),
        t('free.limits.limit-3'),
      ],
    };
  }

  if (priceConfig.plans.starter) {
    plans.starter = {
      ...priceConfig.plans.starter,
      name: t('starter.name'),
      description: t('starter.description'),
      features: [
        t('starter.features.feature-1'),
        t('starter.features.feature-2'),
        t('starter.features.feature-3'),
      ],
      limits: [t('starter.limits.limit-1')],
    };
  }

  if (priceConfig.plans.pro) {
    plans.pro = {
      ...priceConfig.plans.pro,
      name: t('pro.name'),
      description: t('pro.description'),
      features: [
        t('pro.features.feature-1'),
        t('pro.features.feature-2'),
        t('pro.features.feature-3'),
        t('pro.features.feature-4'),
      ],
      limits: [t('pro.limits.limit-1')],
    };
  }

  if (priceConfig.plans.studio) {
    plans.studio = {
      ...priceConfig.plans.studio,
      name: t('studio.name'),
      description: t('studio.description'),
      features: [
        t('studio.features.feature-1'),
        t('studio.features.feature-2'),
        t('studio.features.feature-3'),
      ],
      limits: [],
    };
  }

  if (priceConfig.plans.pack60) {
    plans.pack60 = {
      ...priceConfig.plans.pack60,
      name: t('pack60.name'),
      description: t('pack60.description'),
      features: [
        t('pack60.features.feature-1'),
        t('pack60.features.feature-2'),
      ],
      limits: [],
    };
  }

  if (priceConfig.plans.pack200) {
    plans.pack200 = {
      ...priceConfig.plans.pack200,
      name: t('pack200.name'),
      description: t('pack200.description'),
      features: [
        t('pack200.features.feature-1'),
        t('pack200.features.feature-2'),
      ],
      limits: [],
    };
  }

  if (priceConfig.plans.pack700) {
    plans.pack700 = {
      ...priceConfig.plans.pack700,
      name: t('pack700.name'),
      description: t('pack700.description'),
      features: [
        t('pack700.features.feature-1'),
        t('pack700.features.feature-2'),
      ],
      limits: [],
    };
  }

  return plans;
}
