/**
 * CursorPreview.jsx
 * A floating preview panel that follows the cursor when hovering
 * over project cards or trigger elements.
 *
 * Usage:
 *   1. Mount <CursorPreview /> once at the app root (above everything).
 *   2. Add data-preview="My Label" and data-preview-sub="Category" to any element.
 *   3. The panel appears and tracks the cursor automatically.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/* Preview "images" — SVG-generated visuals (no actual image files needed) */
const PREVIEW_VISUALS = {
  'QuickBite': {
    bg: 'radial-gradient(ellipse 80% 60% at 35% 55%, rgba(200,100,60,0.28) 0%, transparent 60%), linear-gradient(160deg, #1a1008 0%, #0e0a06 100%)',
    pattern: 'diagonal',
  },
  'NewsFlow': {
    bg: 'radial-gradient(ellipse 60% 80% at 70% 30%, rgba(60,120,200,0.22) 0%, transparent 65%), linear-gradient(200deg, #080e1a 0%, #060a10 100%)',
    pattern: 'grid',
  },
  'Dev Portfolio': {
    bg: 'radial-gradient(ellipse 70% 50% at 50% 70%, rgba(200,164,90,0.22) 0%, transparent 60%), linear-gradient(170deg, #141008 0%, #0c0a06 100%)',
    pattern: 'circles',
  },
  'Auth System': {
    bg: 'radial-gradient(ellipse 90% 60% at 20% 40%, rgba(90,200,130,0.2) 0%, transparent 55%), linear-gradient(135deg, #080e0c 0%, #060a08 100%)',
    pattern: 'horizontal',
  },
  'E-Store API': {
    bg: 'radial-gradient(ellipse 60% 90% at 80% 50%, rgba(160,90,200,0.2) 0%, transparent 65%), linear-gradient(240deg, #10080e 0%, #0a060b 100%)',
    pattern: 'wave',
  },
};

function PatternOverlay({ type }) {
  const base = { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 };
  if (type === 'diagonal')
    return <svg style={base} viewBox="0 0 300 400" preserveAspectRatio="none">
      {[...Array(14)].map((_,i) => <line key={i} x1={i*40-100} y1="0" x2={i*40+200} y2="400" stroke="#c8a45a" strokeWidth="0.7"/>)}
    </svg>;
  if (type === 'grid')
    return <svg style={base} viewBox="0 0 300 400" preserveAspectRatio="none">
      {[...Array(6)].map((_,i) => <line key={`v${i}`} x1={i*55} y1="0" x2={i*55} y2="400" stroke="#c8a45a" strokeWidth="0.5"/>)}
      {[...Array(8)].map((_,i) => <line key={`h${i}`} x1="0" y1={i*55} x2="300" y2={i*55} stroke="#c8a45a" strokeWidth="0.5"/>)}
    </svg>;
  if (type === 'circles')
    return <svg style={base} viewBox="0 0 300 400">
      {[40,80,130,190,260].map((r,i) => <circle key={i} cx="150" cy="200" r={r} stroke="#c8a45a" strokeWidth="0.6" fill="none"/>)}
    </svg>;
  if (type === 'wave')
    return <svg style={base} viewBox="0 0 300 400" preserveAspectRatio="none">
      {[...Array(8)].map((_,i) => (
        <path key={i} d={`M0 ${i*55} Q75 ${i*55-25} 150 ${i*55} Q225 ${i*55+25} 300 ${i*55}`} stroke="#c8a45a" strokeWidth="0.5" fill="none"/>
      ))}
    </svg>;
  // horizontal (default)
  return <svg style={base} viewBox="0 0 300 400" preserveAspectRatio="none">
    {[...Array(10)].map((_,i) => <line key={i} x1="0" y1={i*42} x2="300" y2={i*42} stroke="#c8a45a" strokeWidth="0.5"/>)}
  </svg>;
}

export default function CursorPreview() {
  const panelRef  = useRef(null);
  const titleRef  = useRef(null);
  const subRef    = useRef(null);
  const bgRef     = useRef(null);

  const pos    = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const active = useRef(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    /* ── Track mouse globally ── */
    const onMove = (e) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;

      const target = e.target.closest('[data-preview]');

      if (target && !active.current) {
        // Show
        active.current = true;
        const name = target.getAttribute('data-preview') || '';
        const sub  = target.getAttribute('data-preview-sub') || '';
        const visual = PREVIEW_VISUALS[name];

        if (titleRef.current) titleRef.current.textContent = name;
        if (subRef.current)   subRef.current.textContent   = sub;
        if (bgRef.current && visual) bgRef.current.style.background = visual.bg;

        // Update pattern
        const patternEl = panel.querySelector('.preview-pattern');
        if (patternEl) patternEl.setAttribute('data-type', visual?.pattern || 'horizontal');

        gsap.to(panel, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'expo.out',
        });
      } else if (!target && active.current) {
        // Hide
        active.current = false;
        gsap.to(panel, {
          opacity: 0,
          scale: 0.9,
          duration: 0.4,
          ease: 'expo.in',
        });
      }
    };

    window.addEventListener('mousemove', onMove);

    /* ── Lerp follow ── */
    const tick = () => {
      frameRef.current = requestAnimationFrame(tick);
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.1;
      p.y += (p.ty - p.y) * 0.1;

      // Offset so panel doesn't cover cursor
      panel.style.left = (p.x + 24) + 'px';
      panel.style.top  = (p.y - 40) + 'px';

      // Subtle tilt
      const dX = p.tx - p.x;
      const dY = p.ty - p.y;
      gsap.set(panel, {
        rotateY: dX * 0.04,
        rotateX: -dY * 0.02,
      });
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        zIndex: 8000,
        width: 220,
        height: 280,
        pointerEvents: 'none',
        opacity: 0,
        transform: 'scale(0.9)',
        transformStyle: 'preserve-3d',
        transformOrigin: 'top left',
      }}
    >
      {/* Card */}
      <div
        ref={bgRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <PatternOverlay type="horizontal" />

        {/* Gradient vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8,7,6,0.9) 0%, rgba(8,7,6,0.1) 50%, transparent 100%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '20px 18px',
        }}>
          <p ref={subRef} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: 6,
          }}>
            Category
          </p>
          <h4 ref={titleRef} style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            fontWeight: 300,
            lineHeight: 1.1,
            color: 'var(--cream)',
          }}>
            Project Title
          </h4>
        </div>

        {/* Corner arrow */}
        <div style={{
          position: 'absolute',
          top: 14, right: 14,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--gold)',
        }}>↗</div>
      </div>
    </div>
  );
}
