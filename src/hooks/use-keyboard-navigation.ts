import * as React from "react";

interface UseKeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  enabled?: boolean;
}

/**
 * Custom hook for handling keyboard navigation
 * Provides consistent keyboard interaction patterns across components
 */
export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    enabled = true,
  } = options;

  React.useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onEscape?.();
          break;
        case "Enter":
          onEnter?.();
          break;
        case "ArrowUp":
          event.preventDefault();
          onArrowUp?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          onArrowDown?.();
          break;
        case "ArrowLeft":
          onArrowLeft?.();
          break;
        case "ArrowRight":
          onArrowRight?.();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);

  return {
    keyboardProps: {
      onKeyDown: (event: React.KeyboardEvent) => {
        // Allow components to handle additional key events
        switch (event.key) {
          case "Escape":
            onEscape?.();
            break;
          case "Enter":
            onEnter?.();
            break;
          case "ArrowUp":
            event.preventDefault();
            onArrowUp?.();
            break;
          case "ArrowDown":
            event.preventDefault();
            onArrowDown?.();
            break;
          case "ArrowLeft":
            onArrowLeft?.();
            break;
          case "ArrowRight":
            onArrowRight?.();
            break;
        }
      },
    },
  };
}