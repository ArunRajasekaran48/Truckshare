export function EmptyState({ icon = '📭', title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-lg bg-white border border-slate-200">
      <span className="text-6xl mb-6 opacity-80">{icon}</span>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-md mb-8">{description}</p>}
      {action && onAction && (
        <button onClick={onAction} className="btn-primary">
          {action}
        </button>
      )}
    </div>
  );
}
