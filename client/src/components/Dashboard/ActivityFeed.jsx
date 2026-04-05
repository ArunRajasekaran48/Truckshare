import { timeAgo } from '@/utils/formatters';

const activityMeta = {
  SHIPMENT_CREATED:  { icon: '📦', color: 'bg-blue-50 text-blue-600 border border-blue-100' },
  SHIPMENT_MATCHED:  { icon: '🔍', color: 'bg-purple-50 text-purple-600 border border-purple-100' },
  BOOKING_CREATED:   { icon: '📋', color: 'bg-amber-50 text-amber-600 border border-amber-100' },
  BOOKING_CONFIRMED: { icon: '✅', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  TRIP_STARTED:      { icon: '🚛', color: 'bg-teal-50 text-teal-600 border border-teal-100' },
  TRIP_COMPLETED:    { icon: '🏁', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  PAYMENT_RECEIVED:  { icon: '💰', color: 'bg-yellow-50 text-yellow-600 border border-yellow-100' },
};

export function ActivityFeed({ activities = [], limit = 10 }) {
  const items = activities.slice(0, limit);

  if (!items.length) {
    return <p className="text-sm text-slate-500 py-4 text-center font-medium">No recent activity</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((activity, i) => {
        const meta = activityMeta[activity.type] || { icon: '📌', color: 'bg-slate-100 text-slate-600 border border-slate-200' };
        return (
          <li key={activity.id || i} className="flex items-start gap-3">
            <span className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${meta.color}`}>
              {meta.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900 font-medium">{activity.description}</p>
              <p className="text-xs text-slate-500 mt-1">{timeAgo(activity.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
