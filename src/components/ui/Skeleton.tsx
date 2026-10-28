/**
 * Building blocks for loading.tsx screens. Each loading screen should mirror
 * its page's real layout (same containers, breakpoints and order) so content
 * drops into place instead of jumping when it arrives.
 */

/** A placeholder block. Size and shape come from className. */
export function Bone({ className = "" }: { className?: string }) {
  return <div className={`bg-luxury-700 rounded-lg ${className}`} />;
}

/**
 * Wraps a loading screen: pulses, and announces the wait to screen readers
 * (a bare skeleton is silent to them).
 */
export function LoadingStatus({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" className={`animate-pulse ${className}`}>
      {children}
      <span className="sr-only">{label}</span>
    </div>
  );
}
