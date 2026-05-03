import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const bgColors = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
];

export default function AvatarGroup({ workers, max = 3, size = 'sm' }) {
  const displayed = workers.slice(0, max);
  const remaining = workers.length - max;

  const sizeClass = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs';

  return (
    <div className="flex items-center -space-x-2">
      {displayed.map((worker, i) => (
        <Avatar
          key={worker.id}
          className={cn(
            sizeClass,
            'ring-2 ring-background transition-transform hover:scale-110 hover:z-10',
            bgColors[i % bgColors.length]
          )}
        >
          <AvatarFallback className={cn('text-[10px] font-semibold', bgColors[i % bgColors.length])}>
            {worker.initials}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <Avatar className={cn(sizeClass, 'ring-2 ring-background bg-muted')}>
          <AvatarFallback className="text-[10px] font-medium text-muted-foreground bg-muted">
            +{remaining}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
