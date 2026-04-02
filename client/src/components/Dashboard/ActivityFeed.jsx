import { timeAgo } from '@/utils/formatters';

const activityMeta = {
  SHIPMENT_CREATED:  { icon: '📦', color: 'bg-blue-100 text-blue-600' },
  SHIPMENT_MATCHED:  { icon: '🔍', color: 'bg-purple-100 text-purple-600' },
  BOOKING_CREATED:   { icon: '📋', color: 'bg-amber-100 text-amber-600' },
  BOOKING_CONFIRMED: { icon: '✅', color: 'bg-green-100 text-green-600' },
  TRIP_STARTED:      { icon: '🚛', color: 'bg-teal-100 text-teal-600' },
  TRIP_COMPLETED:    { icon: '🏁', color: 'bg-emerald-100 text-emerald-600' },
  PAYMENT_RECEIVED:  { icon: '💰', color: 'bg-yellow-100 text-yellow-600' },
};

export function ActivityFeed({ activities = [], limit = 10 }) {
  const items = activities.slice(0, limit);

  if (!items.length) {
    return <p className="text-sm text-gray-400 py-4 text-center">No recent activity</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((activity, i) => {
        const meta = activityMeta[activity.type] || { icon: '📌', color: 'bg-gray-100 text-gray-600' };
        return (
          <li key={activity.id || i} className="flex items-start gap-3">
            <span className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${meta.color}`}>
              {meta.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">{timeAgo(activity.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
