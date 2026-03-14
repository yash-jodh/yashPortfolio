import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './styles/global.css';

// Three.js
import Scene          from './three/Scene';

// Components
import Loader         from './components/Loader';
import Navbar         from './components/Navbar';
import Hero           from './components/Hero';
import About          from './components/About';
import Projects       from './components/Projects';
import Testimonials   from './components/Testimonials';
import Contact        from './components/Contact';
import SkillsCar      from './three/SkillsCar';
import CursorPreview  from './components/CursorPreview';

// Hooks
import { useScrollVelocity } from './animations/useScrollVelocity';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   AMBIENT SOUND ENGINE (Web Audio API synthesis)
───────────────────────────────────────────── */
function createAmbientEngine() {
  let ctx, masterGain, isPlaying = false;
  const nodes = [];

  function start() {
    if (isPlaying) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.065, ctx.currentTime + 3);
    masterGain.connect(ctx.destination);

    // Layered drone oscillators (A1 tuning, perfect fifths)
    [55, 82.407, 110, 164.814, 220].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo  = ctx.createOscillator();
      const lfoG = ctx.createGain();

      osc.type = ['sine', 'sine', 'triangle', 'sine', 'triangle'][i];
      osc.frequency.value = freq;

      lfo.frequency.value = 0.03 + i * 0.018;
      lfoG.gain.value = freq * 0.004;
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);

      gain.gain.value = [0.5, 0.28, 0.14, 0.07, 0.04][i];
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(); lfo.start();
      nodes.push(osc, lfo);
    });

    // High shimmer overtone
    const shimmer = ctx.createOscillator();
    const shimGain = ctx.createGain();
    shimmer.frequency.value = 3520;
    shimGain.gain.value = 0.002;
    shimmer.connect(shimGain);
    shimGain.connect(masterGain);
    shimmer.start();
    nodes.push(shimmer);

    // Reverb via noise convolver
    const bufLen = ctx.sampleRate * 3;
    const revBuf = ctx.createBuffer(2, bufLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = revBuf.getChannelData(ch);
      for (let i = 0; i < bufLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 1.8);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = revBuf;
    masterGain.connect(conv);
    const revGain = ctx.createGain();
    revGain.gain.value = 0.35;
    conv.connect(revGain);
    revGain.connect(ctx.destination);
    isPlaying = true;
  }

  function stop() {
    if (!ctx || !isPlaying) return;
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    setTimeout(() => {
      nodes.forEach(n => { try { n.stop(); } catch (_) {} });
      nodes.length = 0;
      ctx.close();
      isPlaying = false;
    }, 2100);
  }

  function toggle() { isPlaying ? stop() : start(); return !isPlaying; }
  return { start, stop, toggle, isPlaying: () => isPlaying };
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [loaded, setLoaded]   = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const lenisRef              = useRef(null);
  const soundRef              = useRef(null);
  const { velocityRef }       = useScrollVelocity({ damping: 0.88, scale: 0.5 });

  /* ── Loader done ── */
  const handleLoaderDone = useCallback(() => {
    setLoaded(true);
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }, []);

  /* ── Lenis Smooth Scroll ── */
  useEffect(() => {
    if (!loaded) return;
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    const rafId = requestAnimationFrame(raf);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, [loaded]);

  /* ── Custom Cursor ── */
  useEffect(() => {
    if (!loaded) return;
    const dot   = document.getElementById('cursor-dot');
    const ring  = document.getElementById('cursor-ring');
    const label = document.getElementById('cursor-label');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    };
    window.addEventListener('mousemove', onMove);

    let frame;
    const lerp = (a, b, n) => a + (b - a) * n;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      rx = lerp(rx, mx, 0.1); ry = lerp(ry, my, 0.1);
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      if (label) { label.style.left = (rx + 26) + 'px'; label.style.top = (ry + 26) + 'px'; }
      // Velocity squish on ring
      const vel    = velocityRef.current;
      const squish = Math.min(Math.abs(vel) * 0.04, 0.28);
      ring.style.transform = `translate(-50%, -50%) scaleY(${1 - squish}) scaleX(${1 + squish * 0.4})`;
    };
    tick();

    // Hover states
    const add    = (cls) => () => document.body.classList.add(cls);
    const remove = (cls) => () => document.body.classList.remove(cls);
    document.querySelectorAll('a, button, .btn, .skill-item, .award-item')
      .forEach((el) => { el.addEventListener('mouseenter', add('cursor-link')); el.addEventListener('mouseleave', remove('cursor-link')); });
    document.querySelectorAll('[data-preview]')
      .forEach((el) => { el.addEventListener('mouseenter', add('cursor-drag')); el.addEventListener('mouseleave', remove('cursor-drag')); });

    return () => { cancelAnimationFrame(frame); window.removeEventListener('mousemove', onMove); };
  }, [loaded, velocityRef]);

  /* ── Keyboard nav ── */
  useEffect(() => {
    if (!loaded) return;
    const secs = ['#hero', '#about', '#work', '#testimonials', '#contact'];
    let idx = 0;
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'j')      idx = Math.min(idx + 1, secs.length - 1);
      else if (e.key === 'ArrowUp' || e.key === 'k')   idx = Math.max(idx - 1, 0);
      else return;
      document.querySelector(secs[idx])?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loaded]);

  /* ── Sound ── */
  useEffect(() => {
    soundRef.current = createAmbientEngine();
    return () => soundRef.current?.stop();
  }, []);
  const toggleSound = useCallback(() => { setSoundOn(soundRef.current?.toggle() ?? false); }, []);

  /* ── fade-up observer ── */
  useEffect(() => {
    if (!loaded) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade-up').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loaded]);

  return (
    <>
      {!loaded && <Loader onComplete={handleLoaderDone} />}

      <Scene />

      <div id="cursor-dot" />
      <div id="cursor-ring" />
      <div id="cursor-label" />

      {loaded && <CursorPreview />}

      <button
        id="sound-toggle"
        className={soundOn ? '' : 'muted'}
        aria-label="Toggle ambient sound"
        onClick={toggleSound}
      >
        <div className="sound-wave" aria-hidden="true">
          {[...Array(4)].map((_, i) => <span key={i} className="bar" />)}
        </div>
        <span>{soundOn ? 'Sound On' : 'Sound Off'}</span>
      </button>

      {loaded && <Navbar />}

      <div className="page-curtain" aria-hidden="true" />

      {loaded && (
        <main style={{ position: 'relative', zIndex: 10 }}>
          <Hero />
          <ReelBar />
          <About />
          <SkillsCar />
          <Projects />
          <Testimonials />
          <Contact />
          <Footer />
        </main>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   REEL BAR
───────────────────────────────────────────── */
function ReelBar() {
  const items = ['React.js', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'JavaScript', 'HTML / CSS', 'REST APIs'];
  const rep   = [...items, ...items, ...items];
  return (
    <div style={{ borderTop: '1px solid var(--border-2)', borderBottom: '1px solid var(--border-2)', overflow: 'hidden', padding: '14px 0', background: 'var(--surface)', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 36s linear infinite' }}>
        {rep.map((item, i) => (
          <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--muted)', padding: '0 52px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 52 }}>
            {item}<span style={{ color: 'var(--gold)', fontSize: '0.44rem' }}>✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  const socials = ['GitHub', 'LinkedIn', 'Twitter', 'Dev.to'];
  return (
    <footer style={{ borderTop: '1px solid var(--border-2)', padding: '40px var(--pad-x)', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 20 }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        © {new Date().getFullYear()} Yash Jodh — All rights reserved
      </p>
      <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--cream)', textDecoration: 'none', textAlign: 'center' }}>
        Yash<span style={{ color: 'var(--gold)' }}>.</span>
      </a>
      <ul style={{ display: 'flex', justifyContent: 'flex-end', gap: 32, listStyle: 'none' }}>
        {socials.map((s) => (
          <li key={s}>
            <a href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}>{s}</a>
          </li>
        ))}
      </ul>
      <style>{`@media(max-width:768px){footer{grid-template-columns:1fr!important;text-align:center}footer ul{justify-content:center!important;flex-wrap:wrap;gap:20px}}`}</style>
    </footer>
  );
}
