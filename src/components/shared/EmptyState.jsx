import { FolderOpen, ClipboardList, Users } from 'lucide-react';

const illustrations = {
  projects: {
    icon: FolderOpen,
    title: 'No projects yet',
    description: 'Create your first project to start organizing your work.',
  },
  tasks: {
    icon: ClipboardList,
    title: 'No tasks yet',
    description: 'Add tasks to track your progress and stay productive.',
  },
  workers: {
    icon: Users,
    title: 'No team members yet',
    description: 'Invite workers to collaborate on your projects.',
  },
};

export default function EmptyState({ type = 'tasks', action }) {
  const config = illustrations[type] || illustrations.tasks;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
        {config.description}
      </p>
      {action && action}
    </div>
  );
}
