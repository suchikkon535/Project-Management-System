'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import PriorityBadge from '@/components/shared/PriorityBadge';
import StatusDot from '@/components/shared/StatusDot';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import EmptyState from '@/components/shared/EmptyState';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import { Calendar } from 'lucide-react';

export default function TaskListView({ tasks, projectId }) {
  const { getWorkerById } = useApp();
  const [editingTask, setEditingTask] = useState(null);

  if (tasks.length === 0) {
    return <EmptyState type="tasks" />;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div className="rounded-2xl border border-border overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-5">Task</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1">Assignee</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {tasks.map((task) => {
            const assignee = task.assigneeId ? getWorkerById(task.assigneeId) : null;
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

            return (
              <div
                key={task.id}
                onClick={() => setEditingTask(task)}
                className="grid grid-cols-12 gap-4 px-4 py-3.5 hover:bg-muted/30 cursor-pointer transition-colors items-center"
              >
                <div className="col-span-5">
                  <p className={`text-sm font-medium text-foreground truncate ${task.status === 'done' ? 'line-through opacity-60' : ''}`}>
                    {task.title}
                  </p>
                </div>
                <div className="col-span-2">
                  <StatusDot status={task.status} />
                </div>
                <div className="col-span-2">
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="col-span-2">
                  <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                  </span>
                </div>
                <div className="col-span-1">
                  {assignee && (
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                        {assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingTask && (
        <EditTaskModal
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          projectId={projectId}
        />
      )}
    </>
  );
}
