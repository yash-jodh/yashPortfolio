import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'About',  href: '#about'  },
  { label: 'Skills', href: '#skills' },
  { label: 'Work',   href: '#work'   },
  { label: 'Contact',href: '#contact'},
];

export default function Navbar() {
  const navRef      = useRef(null);
  const progressRef = useRef(null);
  const [active, setActive]   = useState('');
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      const pct      = total > 0 ? scrolled / total : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${pct})`;

      const goingDown = scrolled > lastScrollY.current && scrolled > 80;
      setVisible(!goingDown);
      lastScrollY.current = scrolled;

      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
      setActive(current);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.fromTo(nav, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 1.6 });
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div ref={progressRef} id="scroll-progress" style={{ transform: 'scaleX(0)' }} />

      <nav ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 400,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px var(--pad-x)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)',
      }}>
        {/* Logo */}
        <a href="#" onClick={(e) => handleNav(e, '#hero')} style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem', fontWeight: 300,
          color: 'var(--cream)', textDecoration: 'none',
          letterSpacing: '0.03em',
        }}>
          Yash<span style={{ color: 'var(--gold)' }}>.</span>
        </a>

        {/* Links */}
        <ul style={{ display: 'flex', gap: '40px', listStyle: 'none' }}>
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = active === href.replace('#', '');
            return (
              <li key={label}>
                <a href={href} onClick={(e) => handleNav(e, href)} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: isActive ? 'var(--gold)' : 'var(--muted)',
                  textDecoration: 'none', position: 'relative', paddingBottom: '3px',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--cream)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--muted)'; }}
                >
                  {label}
                  <span style={{
                    position: 'absolute', bottom: 0, left: 0,
                    height: '1px', background: 'var(--gold)',
                    width: isActive ? '100%' : '0%',
                    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} />
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <a href="#contact" onClick={(e) => handleNav(e, '#contact')} style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--gold)', textDecoration: 'none',
          border: '1px solid var(--border)', padding: '10px 20px',
          transition: 'background 0.3s, border-color 0.3s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200,164,90,0.1)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; }}
        >
          Hire Me
        </a>
      </nav>
    </>
  );
}
