'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { websiteConfig } from '@/config/website';
import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

/**
 * Mode switcher component, used in the navbar
 */
export function ModeSwitcher() {
  // Mode switching disabled; force dark mode elsewhere.
  return null;
}
