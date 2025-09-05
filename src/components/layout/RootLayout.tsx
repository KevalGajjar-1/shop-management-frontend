import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import Header from './Header';

const RootLayout: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    // Public layout for login/welcome pages
    return (
      <div className="min-h-screen w-full">
        <Outlet />
      </div>
    );
  }

  // Authenticated layout with sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with sidebar trigger */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <Header />
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <div className="min-h-[calc(100vh-theme(spacing.16))] flex-1 rounded-xl bg-muted/50 p-4">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default RootLayout;
