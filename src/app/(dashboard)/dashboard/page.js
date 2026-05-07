'use client';

import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { FolderKanban, ClipboardList, CheckCircle2, Users, ArrowUpRight, Clock, Loader2 } from 'lucide-react';
import PriorityBadge from '@/components/shared/PriorityBadge';
import Link from 'next/link';

const formatRelativeTime = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

export default function DashboardPage() {
  const { user, stats, tasks, activities, workers, sidebarProjects, tasksLoading, projectsLoading } = useApp();

  const priorityTasks = tasks
    .filter((t) => t.status !== 'done' && !t.completed)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
    })
    .slice(0, 4);

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-indigo bg-indigo/10',
      trend: `${stats.totalProjects} active`,
    },
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: ClipboardList,
      color: 'text-blue-500 bg-blue-500/10',
      trend: `${tasks.filter((t) => t.status === 'in-progress').length} in progress`,
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-500/10',
      trend: `${Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)}% completion`,
    },
    {
      label: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      color: 'text-amber-500 bg-amber-500/10',
      trend: 'Across all projects',
    },
  ];

  const isLoading = tasksLoading || projectsLoading;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-2xl border-border hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : (
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground">{stat.trend}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Priority Tasks</h2>
            <Link
              href="/projects"
              className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {tasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {priorityTasks.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No pending tasks</p>
              )}
              {priorityTasks.map((task, i) => (
                <Card
                  key={task._id || task.id}
                  className="rounded-2xl border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {task.title}
                      </h4>
                      {task.assigneeName && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary text-[8px] font-bold">
                            {task.assigneeInitials}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {task.assigneeName}
                          </span>
                        </div>
                      )}
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {activities.map((activity) => {
              const actUser = workers.find((w) => w.id === activity.userId);
              return (
                <div
                  key={activity.id}
                  className="flex gap-3 rounded-xl p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold mt-0.5">
                    {actUser?.initials || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{actUser?.name || 'Unknown'}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
