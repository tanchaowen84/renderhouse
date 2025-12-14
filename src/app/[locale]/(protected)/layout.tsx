import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { PropsWithChildren } from 'react';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
      className="bg-[#0F1117]"
    >
      <DashboardSidebar />
      <SidebarInset className="min-h-screen bg-[#0F1117] overflow-x-hidden border-none shadow-none m-0 rounded-none">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
