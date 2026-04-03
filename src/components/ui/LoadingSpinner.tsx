export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        data-testid="loading-spinner"
        className={`${sizes[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}
