import { STATUS_COLORS } from '@/utils/constants';

export function StatusBadge({ status, size = 'sm' }) {
  if (!status) return null;
  const colorClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const sizeClass = size === 'xs' ? 'text-xs px-2 py-1' : 'text-xs px-2.5 py-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${colorClass} ${sizeClass}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
