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
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-white/5 bg-[#0F1117] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 text-slate-400">
        <SidebarTrigger className="-ml-1 cursor-pointer hover:bg-white/5 hover:text-white" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 bg-white/10"
        />

        <Breadcrumb>
          <BreadcrumbList className="text-base font-medium text-slate-400">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={`breadcrumb-${index}`}>
                {index > 0 && (
                  <BreadcrumbSeparator
                    key={`sep-${index}`}
                    className="hidden md:block text-slate-600"
                  />
                )}
                <BreadcrumbItem
                  key={`item-${index}`}
                  className={
                    index < breadcrumbs.length - 1 ? 'hidden md:block' : ''
                  }
                >
                  {item.isCurrentPage ? (
                    <BreadcrumbPage className="text-slate-200 font-semibold">{item.label}</BreadcrumbPage>
                  ) : (
                    <span className="hover:text-slate-200 transition-colors cursor-default">{item.label}</span>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* dashboard header actions on the right side */}
        <div className="ml-auto flex items-center gap-3 px-4">
          {actions}

          <ThemeSelector />
          <ModeSwitcher />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
