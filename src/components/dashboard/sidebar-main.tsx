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
            <SidebarGroupLabel className="px-1 text-[12px] font-medium uppercase tracking-[0.08em] text-[#9aa1aa]">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-1.5">
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(subItem.href)}
                      className="rounded-lg text-[#4c525c] hover:text-[#1f242c] hover:bg-white data-[active=true]:border data-[active=true]:border-[#d9dde1] data-[active=true]:bg-white data-[active=true]:text-[#1f242c]"
                    >
                      <LocaleLink href={subItem.href || ''}>
                        {subItem.icon ? subItem.icon : null}
                        <span className="truncate text-sm font-medium">
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
            <SidebarGroupContent className="flex flex-col gap-1.5">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href)}
                    className="rounded-lg text-[#4c525c] hover:text-[#1f242c] hover:bg-white data-[active=true]:border data-[active=true]:border-[#d9dde1] data-[active=true]:bg-white data-[active=true]:text-[#1f242c]"
                  >
                    <LocaleLink href={item.href || ''}>
                      {item.icon ? item.icon : null}
                      <span className="truncate text-sm font-medium">
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
