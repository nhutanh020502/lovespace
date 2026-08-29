import { useCallback } from 'react';

export function useHaptic(enabled = true) {
  const trigger = useCallback((pattern: number | number[] = 15) => {
    if (enabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore on unsupported browsers
      }
    }
  }, [enabled]);

  const light = useCallback(() => trigger(10), [trigger]);
  const medium = useCallback(() => trigger(25), [trigger]);
  const heartbeat = useCallback(() => trigger([50, 100, 50]), [trigger]);

  return {
    trigger,
    light,
    medium,
    heartbeat
  };
}
