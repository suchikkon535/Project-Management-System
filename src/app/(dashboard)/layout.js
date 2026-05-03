'use client';

import { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/shared/Sidebar';
import Navbar from '@/components/shared/Navbar';
import ToastContainer from '@/components/shared/ToastContainer';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar — mobile: slide in/out, desktop: always visible */}
        <div
          className={cn(
            'lg:block',
            mobileOpen ? 'block' : 'hidden'
          )}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main content */}
        <div
          className={cn(
            'flex flex-1 flex-col transition-all duration-300 min-w-0',
            sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'
          )}
        >
          <Navbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

        <ToastContainer />
      </div>
    </AppProvider>
  );
}
