import { STATUS_COLORS } from '@/utils/constants';

export function StatusBadge({ status, size = 'sm' }) {
  if (!status) return null;
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  const sizeClass = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeClass}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
