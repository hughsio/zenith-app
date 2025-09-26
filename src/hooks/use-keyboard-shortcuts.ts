import { useEffect } from 'react';
type Shortcut = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
};
export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === event.key.toLowerCase() &&
        (s.ctrlKey === undefined || s.ctrlKey === event.ctrlKey) &&
        (s.metaKey === undefined || s.metaKey === event.metaKey) &&
        (s.shiftKey === undefined || s.shiftKey === event.shiftKey) &&
        (s.altKey === undefined || s.altKey === event.altKey)
      );
      if (shortcut) {
        // Prevent default browser actions (e.g., Ctrl+S for save)
        // if the target is not an input field.
        const target = event.target as HTMLElement;
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
            event.preventDefault();
            shortcut.callback();
        } else if (shortcut.key.toLowerCase() === 'f' && (event.metaKey || event.ctrlKey)) {
            // Allow search shortcut even in inputs
            event.preventDefault();
            shortcut.callback();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}