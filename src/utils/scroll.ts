import { useEffect } from "react";

/**
 * Custom hook to handle scroll event and update a state setter based on scroll position.
 * @param setScrolled - State setter function to update scroll state
 * @param threshold - ScrollY threshold to trigger state (default: 50)
 */
export function useScrollTrigger(setScrolled: (scrolled: boolean) => void, threshold: number = 50) {
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll);
    // Call once to set initial state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrolled, threshold]);
}
