import { Badge } from '@/components/ui/badge';

const priorityConfig = {
  high: {
    label: 'High',
    className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  },
  low: {
    label: 'Low',
    className: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
};

export default function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <Badge variant="outline" className={`text-xs font-medium px-2 py-0.5 rounded-md ${config.className}`}>
      {config.label}
    </Badge>
  );
}
