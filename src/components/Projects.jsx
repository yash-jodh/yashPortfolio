import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateSplitText } from '../animations/scrollAnimations';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────
   PROJECTS DATA
   👉 Replace liveUrl and githubUrl with your real links
───────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: '01',
    title: 'FoodDash',
    category: 'Food Delivery App',
    year: '2026',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    description:
      'A full-stack food delivery platform with real-time order tracking, restaurant listings, cart management, and secure user authentication — built end-to-end.',
    highlights: ['JWT Auth', 'REST API', 'Cart System', 'Order Tracking'],
    accent: 'rgba(200,100,60,0.2)',
    accentColor: '#e07050',
    lines: 'diagonal',
    icon: '🍔',
    liveUrl: 'https://swift-spoon-tau.vercel.app',      
    githubUrl: 'https://github.com/yash-jodh/swift-spoon', 
  },
  {
    id: '02',
    title: 'X-Times',
    category: 'News Aggregator',
    year: '2024',
    tags: ['React', 'Firebase', 'News API'],
    description:
      'A responsive news aggregator pulling live headlines across categories — tech, sports, business, entertainment — with search, filtering, and infinite scroll.',
    highlights: ['Live API', 'Category Filter', 'Search', 'Infinite Scroll'],
    accent: 'rgba(60,120,200,0.18)',
    accentColor: '#5090d0',
    lines: 'grid',
    icon: '📰',
    liveUrl: 'https://news-final-pied.vercel.app',        
    githubUrl: 'https://github.com/yash-jodh/news-final', 
  },
  {
    id: '03',
    title: 'Dev Portfolio',
    category: 'Personal Website',
    year: '2026',
    tags: ['React', 'Three.js', 'GSAP', 'Vite'],
    description:
      'This very portfolio — cinematic WebGL animations, custom GLSL shaders, GSAP scroll storytelling, and smooth Lenis scroll. Built to stand out.',
    highlights: ['WebGL', 'GLSL Shaders', 'GSAP', 'Lenis'],
    accent: 'rgba(200,164,90,0.22)',
    accentColor: '#c8a45a',
    lines: 'circles',
    icon: '⚡',
    liveUrl: 'https://yash-portfolio-eight-theta.vercel.app',             
    githubUrl: 'https://github.com/yash-jodh/yashPortfolio', 
  },
  {
    id: '04',
    title: 'Auth System',
    category: 'Backend Project',
    year: '2024',
    tags: ['Node.js', 'Express', 'MySQL', 'JWT'],
    description:
      'A robust authentication and authorization service — register, login, password hashing with bcrypt, role-based access control, and token refresh flows.',
    highlights: ['bcrypt', 'JWT Refresh', 'RBAC', 'MySQL'],
    accent: 'rgba(90,200,130,0.16)',
    accentColor: '#50c87a',
    lines: 'horizontal',
    icon: '🔐',
    liveUrl: null,                                           // null = no live demo
    // githubUrl: 'https://github.com/yashjodh/auth-system',   // 👈 replace
  },
  {
    id: '05',
    title: 'E-Store API',
    category: 'REST API',
    year: '2024',
    tags: ['Node.js', 'Express', 'MongoDB', 'Mongoose'],
    description:
      'A complete e-commerce REST API with product CRUD, category management, order processing, Mongoose schemas, and Postman-documented endpoints.',
    highlights: ['CRUD', 'Pagination', 'Mongoose', 'Postman'],
    accent: 'rgba(160,90,200,0.16)',
    accentColor: '#a05ac8',
    lines: 'vertical',
    icon: '🛒',
    liveUrl: null,                                           // null = no live demo
    githubUrl: 'https://github.com/yashjodh/estore-api',    // 👈 replace
  },
];

/* ── SVG pattern backgrounds ── */
function PatternSVG({ type }) {
  const base = { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 };
  if (type === 'diagonal')
    return (
      <svg style={base} viewBox="0 0 400 500" preserveAspectRatio="none">
        {[...Array(20)].map((_, i) => (
          <line key={i} x1={i * 40 - 200} y1="0" x2={i * 40 + 200} y2="500" stroke="#c8a45a" strokeWidth="0.6" />
        ))}
      </svg>
    );
  if (type === 'vertical')
    return (
      <svg style={base} viewBox="0 0 400 500" preserveAspectRatio="none">
        {[...Array(16)].map((_, i) => (
          <line key={i} x1={i * 26} y1="0" x2={i * 26} y2="500" stroke="#c8a45a" strokeWidth="0.5" />
        ))}
      </svg>
    );
  if (type === 'circles')
    return (
      <svg style={base} viewBox="0 0 400 500">
        {[60, 110, 170, 240, 320].map((r, i) => (
          <circle key={i} cx="200" cy="250" r={r} stroke="#c8a45a" strokeWidth="0.6" fill="none" />
        ))}
      </svg>
    );
  if (type === 'grid')
    return (
      <svg style={base} viewBox="0 0 400 500" preserveAspectRatio="none">
        {[...Array(8)].map((_, i) => (
          <line key={`v${i}`} x1={i * 55} y1="0" x2={i * 55} y2="500" stroke="#c8a45a" strokeWidth="0.5" />
        ))}
        {[...Array(10)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 55} x2="400" y2={i * 55} stroke="#c8a45a" strokeWidth="0.5" />
        ))}
      </svg>
    );
  return (
    <svg style={base} viewBox="0 0 400 500" preserveAspectRatio="none">
      {[...Array(10)].map((_, i) => (
        <line key={i} x1="0" y1={i * 52} x2="400" y2={i * 52} stroke="#c8a45a" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

/* ────────────────────────────────────────────────── */

export default function Projects() {
  const sectionRef   = useRef(null);
  const containerRef = useRef(null);
  const trackRef     = useRef(null);
  const headingRef   = useRef(null);
  const stRef        = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track) return;

    animateSplitText(headingRef.current, { stagger: 0.04, duration: 1.2 });

    const getScrollAmount = () => {
      if (!trackRef.current) return 0;
      return -(trackRef.current.scrollWidth - window.innerWidth);
    };

    const anim = gsap.to(track, {
      x: () => getScrollAmount(),
      ease: 'none',
      paused: true,
    });

    const mainST = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: () => '+=' + Math.abs(getScrollAmount()),
      pin: true,
      scrub: 1.5,
      animation: anim,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    });
    stRef.current = mainST;

    const cards = track.querySelectorAll('.project-card');
    const cardTriggers = [];
    cards.forEach((card) => {
      const ct = ScrollTrigger.create({
        trigger: card,
        containerAnimation: anim,
        start: 'left 95%',
        once: true,
        onEnter: () => {
          gsap.fromTo(card,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'expo.out' }
          );
        },
      });
      cardTriggers.push(ct);
    });

    return () => {
      mainST.kill();
      cardTriggers.forEach((ct) => ct.kill());
      anim.kill();
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} style={{ padding: 0, position: 'relative' }}>

      {/* Section header */}
      <div style={{
        padding: 'var(--pad-section) var(--pad-x) 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div>
          <p className="eyebrow">
            <span className="eyebrow-num">04</span>
            Selected Work
          </p>
          <h2 ref={headingRef} className="display" style={{ fontSize: 'clamp(3rem, 5.5vw, 6rem)' }}>
            Things I've<br /><em>Built</em>
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: 8,
          }}>
            ← Drag to explore →
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.12em',
            color: 'rgba(107,101,96,0.5)',
          }}>
            {PROJECTS.length} projects
          </p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div ref={containerRef} style={{ overflow: 'hidden' }}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '2px',
            paddingLeft: 'var(--pad-x)',
            paddingRight: 'var(--pad-x)',
            paddingBottom: 'var(--pad-section)',
            willChange: 'transform',
          }}
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────── */
function ProjectCard({ project }) {
  const cardRef      = useRef(null);
  const overlayRef   = useRef(null);
  const mouseDownPos = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  /* 3D tilt */
  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
    gsap.to(cardRef.current, {
      rotateY: x, rotateX: y,
      duration: 0.4, ease: 'expo.out',
      transformPerspective: 900,
    });
  };

  const onMouseEnter = () => {
    setHovered(true);
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.4 });
    gsap.to(cardRef.current, { scale: 1.015, duration: 0.5, ease: 'expo.out' });
  };

  const onMouseLeave = () => {
    setHovered(false);
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.5 });
    gsap.to(cardRef.current, {
      scale: 1, rotateY: 0, rotateX: 0,
      duration: 0.7, ease: 'expo.out',
    });
  };

  /* Record mousedown position to detect drag vs click */
  const onMouseDown = (e) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  /* Card body click → open liveUrl (or githubUrl fallback) */
  const onCardClick = (e) => {
    // ignore if mouse moved more than 6px (it was a scroll-drag)
    const dx = Math.abs(e.clientX - mouseDownPos.current.x);
    const dy = Math.abs(e.clientY - mouseDownPos.current.y);
    if (dx > 6 || dy > 6) return;

    // ignore clicks that landed on the action buttons
    if (e.target.closest('.proj-btn')) return;

    const url = project.liveUrl || project.githubUrl;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  /* Button click — stop bubbling so card click doesn't also fire */
  const openUrl = (url, e) => {
    e.stopPropagation();
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasLink = !!(project.liveUrl || project.githubUrl);

  return (
    <div
      ref={cardRef}
      className="project-card"
      data-preview={project.title}
      data-preview-sub={project.category}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onClick={onCardClick}
      style={{
        position: 'relative',
        width: 'clamp(340px, 30vw, 480px)',
        minHeight: '70vh',
        flexShrink: 0,
        background: 'var(--surface)',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        cursor: hasLink ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 70% at 35% 40%, ${project.accent} 0%, transparent 65%), var(--surface-2)`,
      }} />

      <PatternSVG type={project.lines} />

      {/* Hover overlay */}
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(8,7,6,0.97) 0%, rgba(8,7,6,0.45) 55%, transparent 100%)',
        opacity: 0,
      }} />

      {/* Big background project number */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)',
        fontSize: '14rem', fontWeight: 300,
        color: 'rgba(200,164,90,0.04)',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>
        {project.id}
      </div>

      {/* ── TOP BAR: icon + action buttons ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '26px 28px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        zIndex: 4,
      }}>
        {/* Emoji icon */}
        <div style={{ fontSize: '2.2rem', filter: 'grayscale(0.2)', lineHeight: 1 }}>
          {project.icon}
        </div>

        {/* Action buttons — slide down on hover */}
        <div style={{
          display: 'flex',
          gap: 8,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0px)' : 'translateY(-10px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>

          {/* GitHub */}
          {project.githubUrl && (
            <button
              className="proj-btn"
              onClick={(e) => openUrl(project.githubUrl, e)}
              title="View source on GitHub"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.56rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--cream)',
                background: 'rgba(12,11,10,0.88)',
                border: '1px solid rgba(237,232,223,0.18)',
                padding: '8px 14px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'border-color 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(237,232,223,0.55)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(237,232,223,0.18)';
                e.currentTarget.style.color = 'var(--cream)';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577
                  0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756
                  -1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835
                  2.809 1.305 3.495.998.108-.776.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93
                  0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23
                  a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23
                  3.297-1.23.653 1.653.242 2.874.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807
                  5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0
                  .322.216.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          )}

          {/* Live Demo */}
          {project.liveUrl ? (
            <button
              className="proj-btn"
              onClick={(e) => openUrl(project.liveUrl, e)}
              title="Open live demo"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.56rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--bg)',
                background: project.accentColor,
                border: `1px solid ${project.accentColor}`,
                padding: '8px 14px',
                cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.88';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 10L10 2M10 2H5M10 2v5"/>
              </svg>
              Live Demo
            </button>
          ) : (
            /* No live demo pill */
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.52rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              background: 'rgba(12,11,10,0.7)',
              border: '1px solid var(--border-2)',
              padding: '8px 12px',
              backdropFilter: 'blur(10px)',
              whiteSpace: 'nowrap',
            }}>
              Backend / API
            </span>
          )}
        </div>
      </div>

      {/* ── Centre hover hint — "Click to open" ── */}
      {project.liveUrl && (
        <div style={{
          position: 'absolute',
          top: '42%', left: '50%',
          transform: hovered
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.75)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          pointerEvents: 'none',
          zIndex: 3,
        }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '50%',
            border: `1.5px solid ${project.accentColor}`,
            background: `${project.accentColor}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: project.accentColor,
            fontSize: '1.3rem',
          }}>
            ↗
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.54rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(237,232,223,0.45)',
          }}>
            Click to open
          </span>
        </div>
      )}

      {/* ── BOTTOM CONTENT ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '40px',
        zIndex: 2,
      }}>
        {/* Number + year */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: 10,
        }}>
          {project.id} — {project.year}
        </p>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 2.8vw, 3rem)',
          fontWeight: 300,
          lineHeight: 1,
          marginBottom: 14,
          color: 'var(--cream)',
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          lineHeight: 1.75,
          color: 'var(--muted)',
          marginBottom: 20,
        }}>
          {project.description}
        </p>

        {/* Feature highlights */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {project.highlights.map((h) => (
            <span key={h} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.52rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: project.accentColor,
              border: `1px solid ${project.accentColor}33`,
              padding: '3px 9px',
              background: `${project.accentColor}0d`,
            }}>
              {h}
            </span>
          ))}
        </div>

        {/* Tech stack tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              border: '1px solid rgba(107,101,96,0.3)',
              padding: '4px 10px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}