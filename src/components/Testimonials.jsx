import { useEffect, useRef } from 'react';
import { animateSplitText, animateFadeUp, animateStagger } from '../animations/scrollAnimations';
import MagneticButton from './MagneticButton';

const TECH_STACK = [
  { title: 'Frontend',   org: 'React.js',   year: '2024', category: 'UI Development' },
  { title: 'Backend',    org: 'Node.js',     year: '2024', category: 'Server-Side' },
  { title: 'Database',   org: 'MongoDB',     year: '2023', category: 'NoSQL' },
  { title: 'Database',   org: 'MySQL',       year: '2023', category: 'SQL / Relational' },
  { title: 'Framework',  org: 'Express.js',  year: '2023', category: 'REST APIs' },
  { title: 'Core',       org: 'JavaScript',  year: '2022', category: 'ES6+' },
];

const HIGHLIGHTS = [
  {
    quote: 'FoodDash is a full-stack food delivery app — React frontend, Node/Express backend, MongoDB database, JWT authentication, and cart + order management built entirely from scratch.',
    name:  'FoodDash',
    role:  'Food Delivery App · 2026',
    initials: '🍔',
    color: '#e07050',
  },
  {
    quote: 'X-Times aggregates live news across categories using the News API, with a clean React UI, search functionality, category filters, and responsive design across all devices.',
    name:  'X-Times',
    role:  'News Aggregator · 2024',
    initials: '📰',
    color: '#5090d0',
  },
  {
    quote: 'My ENTC background means I think in systems and signals — translating those problem-solving instincts into robust, scalable web architectures is where I find my edge.',
    name:  'Yash Jodh',
    role:  'ENTC Under Graduate · Full Stack Developer',
    initials: 'YJ',
    color: '#c8a45a',
  },
  {
    quote: 'Building this portfolio pushed me into Three.js, GLSL shaders, and GSAP animations — proving that engineering curiosity never stops at the boundaries of a single domain.',
    name:  'This Portfolio',
    role:  'WebGL + React · 2025',
    initials: '⚡',
    color: '#90d050',
  },
];

const LEARNING = ['TypeScript', 'Next.js', 'Docker', 'Redis', 'GraphQL', 'AWS', 'Tailwind CSS'];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const awardsRef  = useRef(null);
  const testimsRef = useRef(null);

  useEffect(() => {
    animateSplitText(headingRef.current, { stagger: 0.04 });
    animateStagger(awardsRef.current, awardsRef.current?.querySelectorAll('.award-item'), { stagger: 0.07, y: 24 });
    animateFadeUp(testimsRef.current?.querySelectorAll('.testimonial-card'), { stagger: 0.12 });
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} style={{ paddingTop: 0 }}>

      {/* ── TECH STACK GRID ── */}
      <div style={{ borderTop: '1px solid var(--border-2)', paddingTop: 'var(--pad-section)', marginTop: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p className="eyebrow">
              <span className="eyebrow-num">05</span>
              Tech Arsenal
            </p>
            <h2 ref={headingRef} className="display" style={{ fontSize: 'clamp(2.8rem, 4.5vw, 5rem)' }}>
              Stack &amp;<br /><em>Skills</em>
            </h2>
          </div>
          <MagneticButton href="#contact" style={{ textDecoration: 'none' }}>
            <span className="btn btn-outline">Get In Touch →</span>
          </MagneticButton>
        </div>

        <div ref={awardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'var(--border-2)', border: '1px solid var(--border-2)' }}>
          {TECH_STACK.map((item, i) => (
            <div key={i} className="award-item"
              style={{ background: 'var(--bg)', padding: '36px 32px', position: 'relative', overflow: 'hidden', transition: 'background 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg)'}
            >
              <span style={{ position: 'absolute', top: 20, right: 20, fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.14em', color: 'var(--muted-2)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
                {item.title} · {item.year}
              </p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, marginBottom: 6, lineHeight: 1.1 }}>
                {item.org}
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                {item.category}
              </p>
              <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, background: 'var(--gold)', width: 0, transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)' }}
                onMouseEnter={(e) => e.currentTarget.style.width = '100%'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── PROJECT HIGHLIGHTS ── */}
      <div style={{ marginTop: 'var(--pad-section)' }}>
        <p className="eyebrow" style={{ marginBottom: 52 }}>
          <span className="eyebrow-num" />
          Project Highlights
        </p>

        <div ref={testimsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {HIGHLIGHTS.map((t, i) => (
            <div key={i} className="testimonial-card"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', padding: '40px', position: 'relative', opacity: 0 }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: `${t.color}18`, border: `1px solid ${t.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', marginBottom: 24,
              }}>
                {t.initials}
              </div>

              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.65, fontStyle: 'italic', color: 'var(--cream)', marginBottom: 28 }}>
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 24, borderTop: '1px solid var(--border-2)' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 500, color: t.color, marginBottom: 2 }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CURRENTLY LEARNING MARQUEE ── */}
      <div style={{ marginTop: 'var(--pad-section)', borderTop: '1px solid var(--border-2)', paddingTop: 48 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'center', marginBottom: 40 }}>
          Currently exploring →
        </p>

        <div style={{ overflow: 'hidden', position: 'relative' }}>
          {[{ left: 0, bg: 'linear-gradient(to right, var(--bg), transparent)' },
            { right: 0, bg: 'linear-gradient(to left, var(--bg), transparent)' }
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, width: 80, zIndex: 1, pointerEvents: 'none', ...s }} />
          ))}

          <div style={{ display: 'flex', width: 'max-content', animation: 'marqueePress 18s linear infinite' }}>
            {[...LEARNING, ...LEARNING, ...LEARNING].map((name, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem', fontWeight: 300, fontStyle: 'italic',
                color: 'var(--muted)', padding: '0 48px', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 48,
                transition: 'color 0.3s', cursor: 'default',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                {name}
                <span style={{ fontSize: '0.5rem', color: 'var(--border)' }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marqueePress { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        .award-item:hover > div:last-child { width: 100% !important; }
        @media(max-width:768px){ .testimonial-card{min-width:0} }
      `}</style>
    </section>
  );
}
