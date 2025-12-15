import { HeaderSection } from '@/components/layout/header-section';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import type * as React from 'react';

export default function UseCasesSection() {
  const t = useTranslations('HomePage.useCases');

  return (
    <section id="use-cases" className="px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          description={t('description')}
          subtitleAs="h2"
          descriptionAs="p"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <UseCaseCard
            title={t('items.item-1.title')}
            description={t('items.item-1.description')}
          />

          <UseCaseCard
            title={t('items.item-2.title')}
            description={t('items.item-2.description')}
          />

          <UseCaseCard
            title={t('items.item-3.title')}
            description={t('items.item-3.description')}
          />

          <UseCaseCard
            title={t('items.item-4.title')}
            description={t('items.item-4.description')}
          />

          <UseCaseCard
            title={t('items.item-5.title')}
            description={t('items.item-5.description')}
          />

          <UseCaseCard
            title={t('items.item-6.title')}
            description={t('items.item-6.description')}
          />
        </div>
      </div>
    </section>
  );
}

const UseCaseCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Card className="group border-[#e3e6ea] p-7 shadow-[0_14px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-all duration-200 bg-white">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#1f242c] group-hover:text-[#1f4b3e] transition-colors">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[#6a707a]">
          {description}
        </p>
      </div>
    </Card>
  );
};
