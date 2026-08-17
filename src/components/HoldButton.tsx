import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  holdLabel?: string;
  holdMs?: number;
  onComplete: () => void;
  className?: string;
}

/** Press-and-hold to confirm a destructive action, with a fill progress bar. */
export function HoldButton({
  label,
  holdLabel = "Keep holding…",
  holdMs = 900,
  onComplete,
  className = "",
}: Props) {
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  const done = useRef(false);

  const stop = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setProgress(0);
  }, []);

  useEffect(() => stop, [stop]);

  const begin = useCallback(() => {
    stop();
    done.current = false;
    start.current = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - start.current) / holdMs);
      setProgress(p);
      if (p >= 1) {
        if (!done.current) {
          done.current = true;
          onComplete();
        }
        stop();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [holdMs, onComplete, stop]);

  return (
    <button
      onPointerDown={(e) => {
        if (e.button !== 0 && e.pointerType === "mouse") return;
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        begin();
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full select-none touch-none overflow-hidden rounded-md border border-border bg-secondary py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:border-primary ${className}`}
    >
      <span
        className="absolute inset-y-0 left-0 flame-bg"
        style={{ width: `${progress * 100}%`, opacity: 0.9 }}
      />
      <span className="relative">{progress > 0 ? holdLabel : label}</span>
    </button>
  );
}
