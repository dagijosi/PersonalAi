import { type Dispatch,type SetStateAction, type MutableRefObject } from 'react';

/**
 * Handles delayed padding logic for scroll-based UI transitions.
 * @param isScrolled Whether the page is scrolled.
 * @param setShowFullPadding State setter for padding.
 * @param timeoutRef Ref to store timeout id.
 * @param delay Delay in ms before showing padding (default 700ms).
 */
export function handleDelayedPadding(
  isScrolled: boolean,
  setShowFullPadding: Dispatch<SetStateAction<boolean>>,
  timeoutRef: MutableRefObject<number | null>,
  delay = 700
) {
  if (!isScrolled) {
    timeoutRef.current = window.setTimeout(() => {
      setShowFullPadding(true);
    }, delay);
  } else {
    setShowFullPadding(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }
}

/**
 * Cleanup function to clear timeout.
 * @param timeoutRef Ref to timeout id.
 */
export function cleanupDelayedPadding(timeoutRef: MutableRefObject<number | null>) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
}
