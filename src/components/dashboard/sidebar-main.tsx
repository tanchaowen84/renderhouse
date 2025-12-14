'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import type { NestedMenuItem } from '@/types';

/**
 * Main navigation for the dashboard sidebar
 */
export function SidebarMain({ items }: { items: NestedMenuItem[] }) {
  const pathname = useLocalePathname();

  // Function to check if a path is active
  const isActive = (href: string | undefined): boolean => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Render items with children as SidebarGroup */}
      {items.map((item) =>
        item.items && item.items.length > 0 ? (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-slate-500">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(subItem.href)}
                      className="text-slate-400 hover:text-slate-100 hover:bg-white/5 active:bg-white/10 data-[active=true]:bg-indigo-500/10 data-[active=true]:text-indigo-400"
                    >
                      <LocaleLink href={subItem.href || ''}>
                        {subItem.icon ? subItem.icon : null}
                        <span className="truncate font-medium text-sm">
                          {subItem.title}
                        </span>
                      </LocaleLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          /* Render items without children directly in a SidebarMenu */
          <SidebarGroup key={item.title}>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href)}
                    className="text-slate-400 hover:text-slate-100 hover:bg-white/5 active:bg-white/10 data-[active=true]:bg-indigo-500/10 data-[active=true]:text-indigo-400"
                  >
                    <LocaleLink href={item.href || ''}>
                      {item.icon ? item.icon : null}
                      <span className="truncate font-medium text-sm">
                        {item.title}
                      </span>
                    </LocaleLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )
      )}
    </>
  );
}
