'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Home,
  FolderKanban,
  ClipboardList,
  Users,
  Plus,
  ChevronLeft,
  LogOut,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Team', href: '/team', icon: Users },
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const { user, projects } = useApp();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
        collapsed ? 'w-[68px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">T</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-foreground">TaskFlow</span>
              <span className="text-[10px] text-muted-foreground">Productivity Pro</span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="hidden lg:flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform duration-200',
              collapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {!collapsed && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Projects
              </span>
              <Link
                href="/projects"
                className="rounded-md p-0.5 hover:bg-accent transition-colors"
                aria-label="Create project"
              >
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </div>
            <div className="space-y-0.5">
              {projects.slice(0, 5).map((project) => {
                const isActive = pathname === `/projects/${project.id}`;
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150',
                      isActive
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-3">
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent transition-colors cursor-pointer',
            collapsed && 'justify-center px-0'
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
