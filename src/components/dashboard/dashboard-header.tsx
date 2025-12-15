import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import React, { type ReactNode } from 'react';
import LocaleSwitcher from '../layout/locale-switcher';
import { ModeSwitcher } from '../layout/mode-switcher';
import { ThemeSelector } from '../layout/theme-selector';

interface DashboardBreadcrumbItem {
  label: string;
  isCurrentPage?: boolean;
}

interface DashboardHeaderProps {
  breadcrumbs: DashboardBreadcrumbItem[];
  actions?: ReactNode;
}

/**
 * Dashboard header
 */
export function DashboardHeader({
  breadcrumbs,
  actions,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-[#e6e8ec] bg-[#f9fafb] text-[#38404a] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1 cursor-pointer rounded-md border border-transparent px-2 py-1 text-[#38404a] transition hover:border-[#d9dde1] hover:bg-white" />
        <Separator
          orientation="vertical"
          className="mx-2 h-5 bg-[#dfe2e6]"
        />

        <Breadcrumb>
          <BreadcrumbList className="text-base font-medium text-[#4c525c]">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={`breadcrumb-${index}`}>
                {index > 0 && (
                  <BreadcrumbSeparator
                    key={`sep-${index}`}
                    className="hidden md:block text-[#c5c9ce]"
                  />
                )}
                <BreadcrumbItem
                  key={`item-${index}`}
                  className={
                    index < breadcrumbs.length - 1 ? 'hidden md:block' : ''
                  }
                >
                  {item.isCurrentPage ? (
                    <BreadcrumbPage className="text-[#1f242c] font-semibold">{item.label}</BreadcrumbPage>
                  ) : (
                    <span className="cursor-default transition-colors hover:text-[#1f242c]">{item.label}</span>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2 px-2 text-sm text-[#4c525c]">
          {actions}
          <ThemeSelector />
          <ModeSwitcher />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
