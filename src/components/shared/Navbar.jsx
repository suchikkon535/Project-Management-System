'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function Navbar({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl hover:bg-accent transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks, projects..."
            className="h-9 w-64 rounded-xl bg-muted/50 border-0 pl-9 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary"
            id="navbar-search"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
      </div>
    </header>
  );
}
