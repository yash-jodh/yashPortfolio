import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import FloatingSphere from '../three/FloatingSphere';

export default function Hero() {
  const heroRef     = useRef(null);
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef      = useRef(null);
  const statsRef    = useRef(null);
  const scrollRef   = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    const titleEl = titleRef.current;
    if (titleEl) {
      const words = titleEl.querySelectorAll('.word-inner');
      tl.fromTo(words,
        { y: '110%', rotation: 3 },
        { y: 0, rotation: 0, duration: 1.3, stagger: 0.07, ease: 'expo.out' }
      );
    }

    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, ease: 'expo.out' },
      '-=0.7'
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },
      '-=0.6'
    )
    .fromTo(
      statsRef.current?.children ? Array.from(statsRef.current.children) : [],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' },
      '-=0.5'
    )
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' },
      '-=0.3'
    );

    const onScroll = () => {
      const y = window.scrollY;
      if (heroRef.current) {
        const overlay = heroRef.current.querySelector('.hero-overlay');
        if (overlay) overlay.style.opacity = Math.min(y / 500, 0.7);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const wrapWords = (text) =>
    text.split(' ').map((word, i) => (
      <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.25em' }}>
        <span className="word-inner" style={{ display: 'inline-block' }}>{word}</span>
      </span>
    ));

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{ minHeight: '100vh', padding: 0, overflow: 'hidden', position: 'relative' }}
    >
      <FloatingSphere className="hero-sphere" />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'radial-gradient(ellipse 60% 70% at 70% 50%, transparent 0%, rgba(8,7,6,0.75) 70%)',
        pointerEvents: 'none',
      }} />
      <div className="hero-overlay" style={{
        position: 'absolute', inset: 0, zIndex: 3,
        background: 'rgba(8,7,6,0)',
        pointerEvents: 'none',
        transition: 'opacity 0.1s',
      }} />

      <div style={{
        position: 'relative', zIndex: 4,
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'flex-end',
        padding: 'var(--pad-section) var(--pad-x) 80px',
        paddingTop: '120px',
        gap: '40px',
      }}>

        {/* LEFT */}
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            opacity: 0,
            animation: 'fadeIn 1s 1.8s forwards',
          }}>
            <span style={{ width: 28, height: 1, background: 'var(--gold)', display: 'block' }} />
            Full Stack Developer
          </p>

          <h1
            ref={titleRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4rem, 8.5vw, 9.5rem)',
              fontWeight: 300,
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
            }}
          >
            <div>{wrapWords('Building')}</div>
            <div style={{ paddingLeft: '2rem' }}>
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
                {wrapWords('Digital')}
              </em>
            </div>
            <div>{wrapWords('Experiences')}</div>
          </h1>

          <p
            ref={subtitleRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.92rem',
              lineHeight: 1.9,
              color: 'var(--muted)',
              maxWidth: 420,
              marginTop: 36,
              opacity: 0,
            }}
          >
            ENTC engineer turned full-stack developer — I craft performant, 
            pixel-perfect web apps from database to deployment. React, Node.js, 
            and everything in between.
          </p>

          <div ref={ctaRef} style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 28, opacity: 0 }}>
            <a
              href="#work"
              onClick={(e) => { e.preventDefault(); document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn btn-gold"
            >
              <span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1v11M1 6.5l5.5 5.5 5.5-5.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                View Projects
              </span>
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn btn-outline"
            >
              Hire Me
            </a>
          </div>
        </div>

        {/* RIGHT — Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 20 }}>
          <div
            ref={statsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              background: 'var(--border)',
              border: '1px solid var(--border)',
              maxWidth: 340,
              width: '100%',
            }}
          >
            {[
              { num: '2+',  label: 'Years Coding' },
              { num: '10+', label: 'Projects Built' },
              { num: '7+',  label: 'Tech Stack' },
              { num: '2',   label: 'Live Apps' },
            ].map(({ num, label }) => (
              <div key={label} style={{ background: 'var(--bg)', padding: '28px 20px', textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: 300,
                  color: 'var(--gold)',
                  lineHeight: 1,
                }}>
                  {num}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.56rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginTop: 8,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Open to work badge */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: '#4caf7d',
              boxShadow: '0 0 8px rgba(76,175,125,0.6)',
              animation: 'pulse 2s infinite',
              display: 'inline-block',
            }} />
            Open to Opportunities
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: 0,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>Scroll</span>
        <div style={{
          width: 1, height: 48,
          background: 'linear-gradient(to bottom, var(--gold), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(76,175,125,0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 16px rgba(76,175,125,0.3); }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.6); opacity: 0.4; }
        }
        @media (max-width: 768px) {
          #hero > div > div:last-child { display: none; }
          #hero > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
