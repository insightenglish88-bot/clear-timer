import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Wires up the behaviour a modal dialog is expected to have and that neither
 * of this app's modals previously had: Escape to dismiss, focus moved into the
 * dialog on open, focus kept inside it while open, and focus returned to the
 * control that opened it on close.
 *
 * Returns a ref to attach to the dialog element.
 */
export function useDialog<T extends HTMLElement>(onClose: () => void) {
  const dialogRef = useRef<T | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const node = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const collect = (): HTMLElement[] =>
      node ? (Array.from(node.querySelectorAll(FOCUSABLE)) as HTMLElement[]) : [];

    // Focus the dialog container itself so assistive tech announces the
    // dialog's title, rather than dropping the user straight onto "Close".
    (node ?? collect()[0])?.focus({ preventScroll: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        closeRef.current();
        return;
      }

      if (e.key !== 'Tab' || !node) return;

      const items = collect().filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !node.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Capture phase so Escape closes the dialog before any global shortcut
    // handler further down gets a look at the event.
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, []);

  return dialogRef;
}
