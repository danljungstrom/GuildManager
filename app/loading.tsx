import { LoadingSpinner } from '@/components/ui/loading-spinner';

/**
 * Loading fallback for root page
 * Shown during server-side rendering and navigation
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner text="Loading..." />
    </div>
  );
}
