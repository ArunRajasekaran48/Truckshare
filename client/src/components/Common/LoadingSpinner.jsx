export function LoadingSpinner({ size = 'md', text, fullPage = false }) {
  const sizes = { xs: 'h-4 w-4', sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`animate-spin rounded-full border-2 border-gray-200 border-t-teal-600 ${sizes[size]}`}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">{spinner}</div>
    );
  }

  return spinner;
}
