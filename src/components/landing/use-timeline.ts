import { useEffect, useRef, useState } from "react";

/**
 * Loops through animation frames while the element is on screen;
 * `durations[i]` is how long frame i stays up, in milliseconds.
 *
 * The last frame is the finished state: it is what the server renders, what
 * the loop holds on between runs, and all that users with reduced motion see.
 */
export function useTimeline<T extends Element>(durations: readonly number[]) {
  const ref = useRef<T>(null);
  const [frame, setFrame] = useState(durations.length - 1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) {
      return;
    }
    const timer = setTimeout(() => setFrame(current => (current + 1) % durations.length), durations[frame]);
    return () => clearTimeout(timer);
  }, [playing, frame, durations]);

  return { ref, frame };
}
