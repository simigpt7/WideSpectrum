/**
 * Utility function to merge class names conditionally
 * Similar to clsx but simpler
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
