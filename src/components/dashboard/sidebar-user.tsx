'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { websiteConfig } from '@/config/website';
import { useLocalePathname, useLocaleRouter } from '@/i18n/navigation';
import { LOCALES, routing } from '@/i18n/routing';
import { authClient } from '@/lib/auth-client';
import { useLocaleStore } from '@/stores/locale-store';
import { usePaymentStore } from '@/stores/payment-store';
import type { User } from 'better-auth';
import {
  ChevronsUpDown,
  Languages,
  LaptopIcon,
  LogOut,
  MoonIcon,
  SunIcon,
} from 'lucide-react';
import { type Locale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { UserAvatar } from '../layout/user-avatar';

interface SidebarUserProps {
  user: User;
  className?: string;
}

/**
 * User navigation for the dashboard sidebar
 */
export function SidebarUser({ user, className }: SidebarUserProps) {
  const { setTheme } = useTheme();
  const router = useLocaleRouter();
  const { isMobile } = useSidebar();
  const pathname = useLocalePathname();
  const params = useParams();
  const { currentLocale, setCurrentLocale } = useLocaleStore();
  const { resetState } = usePaymentStore();
  const [, startTransition] = useTransition();
  const t = useTranslations();

  const setLocale = (nextLocale: Locale) => {
    setCurrentLocale(nextLocale);

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  };

  const showModeSwitch = websiteConfig.metadata.mode?.enableSwitch ?? false;
  const showLocaleSwitch = LOCALES.length > 1;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log('sign out success');
          // Reset payment state on sign out
          resetState();
          router.replace('/');
        },
        onError: (error) => {
          console.error('sign out error:', error);
          toast.error(t('Common.logoutFailed'));
        },
      },
    });
  };

  return (
    <SidebarMenu className="border-t border-white/5 pt-4">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer text-slate-400 hover:text-white hover:bg-white/5 data-[state=open]:bg-white/10 data-[state=open]:text-white"
            >
              <UserAvatar
                name={user.name}
                image={user.image}
                className="size-8 border border-white/10"
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-slate-500">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-[#1E293B] border-white/10 text-slate-300"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar
                  name={user.name}
                  image={user.image}
                  className="size-8 border border-white/10"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">{user.name}</span>
                  <span className="truncate text-xs text-slate-500">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {(showModeSwitch || showLocaleSwitch) && <DropdownMenuSeparator className="bg-white/10" />}

            {showModeSwitch && (
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer hover:bg-white/5 focus:bg-white/5 hover:text-white focus:text-white">
                    <LaptopIcon className="mr-2 size-4" />
                    <span>{t('Common.mode.label')}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-[#1E293B] border-white/10 text-slate-300">
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-white/5 focus:bg-white/5 hover:text-white focus:text-white"
                      onClick={() => setTheme('light')}
                    >
                      <SunIcon className="mr-2 size-4" />
                      <span>{t('Common.mode.light')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-white/5 focus:bg-white/5 hover:text-white focus:text-white"
                      onClick={() => setTheme('dark')}
                    >
                      <MoonIcon className="mr-2 size-4" />
                      <span>{t('Common.mode.dark')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-white/5 focus:bg-white/5 hover:text-white focus:text-white"
                      onClick={() => setTheme('system')}
                    >
                      <LaptopIcon className="mr-2 size-4" />
                      <span>{t('Common.mode.system')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            )}

            {showLocaleSwitch && (
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer hover:bg-white/5 focus:bg-white/5 hover:text-white focus:text-white">
                    <Languages className="mr-2 size-4" />
                    <span>{t('Common.language')}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-[#1E293B] border-white/10 text-slate-300">
                    {routing.locales.map((localeOption) => (
                      <DropdownMenuItem
                        key={localeOption}
                        onClick={() => setLocale(localeOption)}
                        className="cursor-pointer hover:bg-white/5 focus:bg-white/5 hover:text-white focus:text-white"
                      >
                        {websiteConfig.i18n.locales[localeOption].flag && (
                          <span className="mr-2 text-md">
                            {websiteConfig.i18n.locales[localeOption].flag}
                          </span>
                        )}
                        <span className="text-sm">
                          {websiteConfig.i18n.locales[localeOption].name}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            )}

            <DropdownMenuSeparator className="bg-white/10" />

            <DropdownMenuItem
              className="cursor-pointer hover:bg-white/5 focus:bg-white/5 hover:text-white focus:text-white"
              onClick={async (event) => {
                event.preventDefault();
                handleSignOut();
              }}
            >
              <LogOut className="mr-2 size-4" />
              {t('Common.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
