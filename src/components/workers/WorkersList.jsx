'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Mail } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import InviteWorkerModal from '@/components/workers/InviteWorkerModal';

const bgColors = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
];

export default function WorkersList() {
  const { workers } = useApp();
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Workers Management</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage team access levels and organizational roles.
          </p>
        </div>
        <Button
          onClick={() => setShowInvite(true)}
          className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
          id="invite-worker-btn"
        >
          <UserPlus className="h-4 w-4" />
          Invite Worker
        </Button>
      </div>

      {/* Workers list */}
      {workers.length === 0 ? (
        <EmptyState
          type="workers"
          action={
            <Button
              onClick={() => setShowInvite(true)}
              className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <UserPlus className="h-4 w-4" />
              Invite your first worker
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {workers.map((worker, i) => (
            <Card
              key={worker.id}
              className="rounded-2xl border-border hover:border-primary/20 hover:shadow-sm transition-all duration-200"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className={`text-sm font-semibold ${bgColors[i % bgColors.length]}`}
                    >
                      {worker.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{worker.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {worker.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={worker.role === 'Admin' ? 'default' : 'secondary'}
                    className={`rounded-md text-xs ${worker.role === 'Admin'
                        ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10'
                        : ''
                      }`}
                  >
                    {worker.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <InviteWorkerModal open={showInvite} onClose={() => setShowInvite(false)} />
    </div>
  );
}
