import { useCallback, useEffect, useRef } from "react";

/**
 * Press-and-hold repeat for stepper buttons: fires once immediately, then
 * accelerates from `initialDelay` down to `minDelay` while held.
 */
export function useHoldRepeat(
  action: () => void,
  { initialDelay = 300, minDelay = 40, accel = 0.82 }: { initialDelay?: number; minDelay?: number; accel?: number } = {},
) {
  const actionRef = useRef(action);
  actionRef.current = action;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    stop();
    actionRef.current();
    let delay = initialDelay;
    const tick = () => {
      actionRef.current();
      delay = Math.max(minDelay, delay * accel);
      timer.current = setTimeout(tick, delay);
    };
    timer.current = setTimeout(tick, delay);
  }, [stop, initialDelay, minDelay, accel]);

  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      start();
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onLostPointerCapture: stop,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
}
