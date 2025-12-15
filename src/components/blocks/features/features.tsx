'use client';

import { HeaderSection } from '@/components/layout/header-section';
import { BorderBeam } from '@/components/magicui/border-beam';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChartBarIncreasingIcon,
  Database,
  Fingerprint,
  IdCard,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

/**
 * https://nsui.irung.me/features
 * pnpm dlx shadcn@canary add https://nsui.irung.me/r/features-12.json
 */
export default function FeaturesSection() {
  const t = useTranslations('HomePage.features');
  type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4';
  const [activeItem, setActiveItem] = useState<ImageKey>('item-1');

  const images = {
    'item-1': {
      image: 'https://cdn.flowchartai.org/static/blocks/feature1.png',
      darkImage: 'https://cdn.flowchartai.org/static/blocks/feature1.png',
      alt: 'Product Feature One',
    },
    'item-2': {
      image: 'https://cdn.flowchartai.org/static/blocks/feature2.png',
      darkImage: 'https://cdn.flowchartai.org/static/blocks/feature2.png',
      alt: 'Product Feature Two',
    },
    'item-3': {
      image: 'https://cdn.flowchartai.org/static/blocks/feature3.png',
      darkImage: 'https://cdn.flowchartai.org/static/blocks/feature3.png',
      alt: 'Product Feature Three',
    },
    'item-4': {
      image: 'https://cdn.flowchartai.org/static/blocks/feature4.png',
      darkImage: 'https://cdn.flowchartai.org/static/blocks/feature4.png',
      alt: 'Product Feature Four',
    },
  };

  return (
    <section id="features" className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-16">
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          subtitleAs="h2"
          description={t('description')}
          descriptionAs="p"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="lg:pr-0 text-left space-y-3">
              <h3 className="text-3xl font-semibold lg:text-4xl text-[#1f242c] leading-normal">
                {t('title')}
              </h3>
              <p className="mt-2 text-[#6a707a]">{t('description')}</p>
            </div>
            <Accordion
              type="single"
              value={activeItem}
              onValueChange={(value) => setActiveItem(value as ImageKey)}
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <Database className="size-4" />
                    {t('items.item-1.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-1.description')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <Fingerprint className="size-4" />
                    {t('items.item-2.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-2.description')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <IdCard className="size-4" />
                    {t('items.item-3.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-3.description')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <ChartBarIncreasingIcon className="size-4" />
                    {t('items.item-4.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-4.description')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="relative flex w-full overflow-hidden rounded-2xl border border-[#e3e6ea] bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,0.08)] lg:col-span-7">
            <div className="aspect-76/59 relative w-full rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeItem}-id`}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="size-full overflow-hidden rounded-2xl border border-[#e6e8ec] bg-white flex items-center justify-center"
                >
                  <Image
                    src={images[activeItem].image}
                    className="max-w-full max-h-full object-contain"
                    alt={images[activeItem].alt}
                    width={1207}
                    height={929}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
