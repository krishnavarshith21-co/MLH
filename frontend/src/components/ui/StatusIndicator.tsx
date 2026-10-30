interface StatusIndicatorProps {
  status: 'healthy' | 'warning' | 'error' | 'migrating' | 'idle';
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusIndicator({ status, label, size = 'sm' }: StatusIndicatorProps) {
  const colors = {
    healthy: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    migrating: 'bg-champagne',
    idle: 'bg-secondary-text',
  };

  const dotSizes = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex">
        <span className={`${colors[status]} ${dotSizes[size]} rounded-full`} />
        {(status === 'migrating' || status === 'healthy') && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-40 animate-ping`} />
        )}
      </span>
      {label && <span className="text-sm text-secondary-text">{label}</span>}
    </div>
  );
}
