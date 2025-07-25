import * as React from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook for intersection observer
 * Useful for implementing lazy loading, infinite scroll, and animations
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0, root = null, rootMargin = "0%", freezeOnceVisible = false } = options;
  
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();
  const [node, setNode] = React.useState<Element | null>(null);
  
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = React.useCallback(
    ([entry]: IntersectionObserverEntry[]): void => {
      setEntry(entry);
    },
    []
  );

  React.useEffect(() => {
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [node, threshold, root, rootMargin, frozen, updateEntry]);

  return {
    ref: setNode,
    entry,
    isIntersecting: !!entry?.isIntersecting,
    isVisible: !!entry?.isIntersecting,
  };
}