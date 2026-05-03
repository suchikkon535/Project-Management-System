'use client';

import PriorityBadge from '@/components/shared/PriorityBadge';
import StatusDot from '@/components/shared/StatusDot';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, GripVertical } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function TaskCard({ task, onClick, isDragging }) {
  const { getWorkerById } = useApp();
  const assignee = task.assigneeId ? getWorkerById(task.assigneeId) : null;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl border bg-card p-4 cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'shadow-xl border-primary/40 rotate-2 scale-105'
          : 'border-border hover:border-primary/30 hover:shadow-md'
      }`}
    >
      {/* Drag handle indicator */}
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {/* Title */}
        <h4 className="text-sm font-medium text-foreground leading-snug pr-2 line-clamp-2">
          {task.title}
        </h4>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            {task.dueDate && (
              <span
                className={`flex items-center gap-1 text-[11px] ${
                  isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'
                }`}
              >
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          {assignee && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                {assignee.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}
