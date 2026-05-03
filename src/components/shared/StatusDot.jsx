const statusConfig = {
  todo: {
    label: 'Todo',
    dotClass: 'bg-slate-400',
    textClass: 'text-slate-600 dark:text-slate-400',
  },
  'in-progress': {
    label: 'In Progress',
    dotClass: 'bg-indigo',
    textClass: 'text-indigo dark:text-indigo-light',
  },
  done: {
    label: 'Done',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
};

export default function StatusDot({ status, showLabel = true }) {
  const config = statusConfig[status] || statusConfig.todo;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
      {showLabel && (
        <span className={`text-xs font-medium ${config.textClass}`}>
          {config.label}
        </span>
      )}
    </span>
  );
}
