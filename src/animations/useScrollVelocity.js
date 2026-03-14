/**
 * useScrollVelocity.js
 * Custom React hook that tracks scroll velocity and exposes
 * it via a ref (for use in animation frames without re-renders).
 *
 * Also exports a standalone getScrollVelocity() for non-React contexts.
 */
import { useEffect, useRef } from 'react';

/**
 * useScrollVelocity
 * Returns a ref whose .current is the current scroll velocity (px/frame).
 * Positive = scrolling down, Negative = scrolling up.
 *
 * @param {object} options
 * @param {number} [options.damping=0.85]  — How quickly velocity decays (0-1)
 * @param {number} [options.scale=1]       — Multiplier on raw velocity
 * @returns {{ velocityRef: React.MutableRefObject<number>, directionRef: React.MutableRefObject<1|-1> }}
 */
export function useScrollVelocity({ damping = 0.85, scale = 1 } = {}) {
  const velocityRef  = useRef(0);
  const directionRef = useRef(1);  // 1 = down, -1 = up
  const lastY        = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const frameRef     = useRef(null);

  useEffect(() => {
    let prevVelocity = 0;

    const tick = () => {
      frameRef.current = requestAnimationFrame(tick);
      const currentY = window.scrollY;
      const delta    = currentY - lastY.current;
      lastY.current  = currentY;

      // Lerp toward new velocity
      prevVelocity += (delta * scale - prevVelocity) * (1 - damping);
      velocityRef.current  = prevVelocity;
      directionRef.current = delta >= 0 ? 1 : -1;
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [damping, scale]);

  return { velocityRef, directionRef };
}

/**
 * createScrollVelocityTracker
 * Non-React version. Returns { velocity, direction, destroy }.
 * Useful in Three.js animation loops.
 */
export function createScrollVelocityTracker({ damping = 0.85, scale = 1 } = {}) {
  let velocity  = 0;
  let direction = 1;
  let lastY     = window.scrollY;
  let frame;

  const tick = () => {
    frame = requestAnimationFrame(tick);
    const currentY = window.scrollY;
    const delta = currentY - lastY;
    lastY = currentY;
    velocity += (delta * scale - velocity) * (1 - damping);
    direction = delta >= 0 ? 1 : -1;
  };
  frame = requestAnimationFrame(tick);

  return {
    get velocity() { return velocity; },
    get direction() { return direction; },
    destroy() { cancelAnimationFrame(frame); },
  };
}

/**
 * useScrollProgress
 * Tracks overall page scroll progress (0 → 1).
 * @returns {{ progressRef: React.MutableRefObject<number> }}
 */
export function useScrollProgress() {
  const progressRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = total > 0 ? window.scrollY / total : 0;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return { progressRef };
}

/**
 * useScrollDirection
 * Returns a ref: 'down' | 'up' | 'idle'
 */
export function useScrollDirection() {
  const dirRef  = useRef('idle');
  const lastY   = useRef(0);

  useEffect(() => {
    let timeout;
    const onScroll = () => {
      const y = window.scrollY;
      dirRef.current = y > lastY.current ? 'down' : 'up';
      lastY.current  = y;
      clearTimeout(timeout);
      timeout = setTimeout(() => { dirRef.current = 'idle'; }, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { dirRef };
}
