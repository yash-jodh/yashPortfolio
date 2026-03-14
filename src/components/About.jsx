import { useEffect, useRef } from 'react';
import { animateSplitText, animateFadeUp, animateClipReveal } from '../animations/scrollAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef    = useRef(null);
  const imageRef   = useRef(null);
  const lineRef    = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    animateSplitText(headingRef.current, { stagger: 0.04, duration: 1.3 });
    animateFadeUp(bodyRef.current?.querySelectorAll('p'), { stagger: 0.12 });

    if (imageRef.current) animateClipReveal(imageRef.current, 'bottom');

    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.6, ease: 'expo.inOut',
          scrollTrigger: { trigger: lineRef.current, start: 'top 90%', once: true },
        }
      );
    }

    if (imageRef.current) {
      gsap.to(imageRef.current.querySelector('.portrait-inner'), {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: imageRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  }, []);

  return (
    <section id="about" ref={sectionRef}>
      <div ref={lineRef} style={{ height: 1, background: 'var(--border-2)', marginBottom: 'var(--pad-section)', transformOrigin: 'left center' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '80px', alignItems: 'center' }}>

        {/* LEFT */}
        <div>
          <p className="eyebrow">
            <span className="eyebrow-num">02</span>
            About Me
          </p>

          <h2 ref={headingRef} className="display" style={{ fontSize: 'clamp(2.8rem, 4.5vw, 5rem)', marginBottom: 32 }}>
            Engineer at Heart,<br /><em>Developer</em> by Craft
          </h2>

          <div ref={bodyRef} className="body-text">
            <p style={{ marginBottom: 20 }}>
              I'm Yash Jodh, an Electronics &amp; Telecommunication Engineering under graduate
              who fell in love with the web. My engineering background gives me a unique
              edge — I think in systems, optimize for performance, and love
              understanding how things work under the hood.
            </p>
            <p style={{ marginBottom: 20 }}>
              I've self-trained in the MERN stack and built full-stack applications
              from scratch — handling everything from database schema design to
              crafting pixel-perfect UIs that users actually enjoy.
            </p>
            <p>
              My goal is to write clean, maintainable code that solves real problems.
              Whether it's a consumer-facing app or an internal tool, I care about
              both the code quality and the experience it delivers.
            </p>
          </div>

          {/* Teaser text pointing to car section */}
          <div style={{ marginTop: 44, padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
              ↓ Scroll to unlock my stack
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--muted)' }}>
              React · Node.js · Express · JavaScript · HTML/CSS · MySQL · MongoDB · REST APIs
            </p>
          </div>
        </div>

        {/* RIGHT: Portrait */}
        <div style={{ position: 'relative' }}>
          <div ref={imageRef} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'var(--surface)' }}>
            <div
              className="portrait-inner"
              style={{
                width: '100%', height: '120%', marginTop: '-10%',
                background: `
                  radial-gradient(ellipse 80% 60% at 40% 40%, rgba(200,164,90,0.15) 0%, transparent 60%),
                  repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(200,164,90,0.035) 2px, rgba(200,164,90,0.035) 4px),
                  var(--surface-2)
                `,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
              }}
            >
              {/* Initials */}
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9rem',
                fontWeight: 300,
                color: 'rgba(200,164,90,0.12)',
                letterSpacing: '-0.05em',
                userSelect: 'none',
                lineHeight: 1,
              }}>YJ</span>

              {/* Tech badges floating */}
              {['React', 'Node', 'MongoDB', 'MySQL'].map((t, i) => (
                <div key={t} style={{
                  position: 'absolute',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  border: '1px solid var(--border)',
                  padding: '5px 11px',
                  background: 'rgba(8,7,6,0.7)',
                  top:  [18, 'auto', 28, 'auto'][i],
                  bottom: ['auto', 60, 'auto', 90][i],
                  left:  [18, 'auto', 'auto', 18][i],
                  right: ['auto', 18, 18, 'auto'][i],
                  animation: `techFloat${i} ${3 + i * 0.4}s ease-in-out infinite alternate`,
                }}>
                  {t}
                </div>
              ))}

              {/* Grid overlay */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }} viewBox="0 0 400 500" preserveAspectRatio="none">
                {[...Array(10)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="#c8a45a" strokeWidth="0.5"/>)}
                {[...Array(8)].map((_, i) => <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="#c8a45a" strokeWidth="0.5"/>)}
              </svg>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: -18, right: -18, width: '75%', height: '75%', border: '1px solid var(--border)', pointerEvents: 'none', zIndex: -1 }} />

          {/* ENTC badge */}
          <div style={{
            position: 'absolute', top: 28, left: -28,
            background: 'var(--bg)', border: '1px solid var(--border)',
            padding: '16px 20px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>ENTC</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6 }}>Engineering<br/>Under Graduate</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes techFloat0 { from{transform:translateY(0)} to{transform:translateY(-6px)} }
        @keyframes techFloat1 { from{transform:translateY(0)} to{transform:translateY(-8px)} }
        @keyframes techFloat2 { from{transform:translateY(0)} to{transform:translateY(-5px)} }
        @keyframes techFloat3 { from{transform:translateY(0)} to{transform:translateY(-7px)} }
        @media (max-width: 768px) {
          #about > div { grid-template-columns: 1fr !important; }
          #about > div > div:last-child { display: none; }
        }
      `}</style>
    </section>
  );
}