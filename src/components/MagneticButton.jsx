/**
 * MagneticButton.jsx
 * Wraps any child element with a magnetic hover effect.
 * The element "pulls" toward the cursor within its bounding area.
 */
import { useRef, useCallback } from 'react';
import gsap from 'gsap';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.strength=0.35]   — Pull strength (0 = none, 1 = full)
 * @param {number} [props.radius=1.2]      — Activation radius multiplier (relative to element size)
 * @param {string} [props.className]
 * @param {object} [props.style]
 * @param {string} [props.as='div']        — Rendered element tag
 */
export default function MagneticButton({
  children,
  strength = 0.35,
  radius = 1.2,
  className = '',
  style = {},
  as: Tag = 'div',
  onClick,
  href,
}) {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.max(rect.width, rect.height) * radius;

    if (dist < maxDist) {
      const power = (1 - dist / maxDist) * strength;
      gsap.to(el, {
        x: dx * power,
        y: dy * power,
        duration: 0.5,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }
  }, [strength, radius]);

  const onMouseLeave = useCallback(() => {
    gsap.to(ref.current, {
      x: 0, y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  }, []);

  const props = {
    ref,
    className,
    style: { display: 'inline-block', ...style },
    onMouseMove,
    onMouseLeave,
    onClick,
  };

  // If href is provided, render as <a>
  if (href) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return <Tag {...props}>{children}</Tag>;
}
