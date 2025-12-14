'use client';

import { Button } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { cn } from '@/lib/utils';
import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * Mode switcher component, used in the footer
 */
export function ModeSwitcherHorizontal() {
  // Mode switching disabled; force dark mode elsewhere.
  return null;
}
