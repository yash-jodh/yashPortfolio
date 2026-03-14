import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const loaderRef   = useRef(null);
  const curtain1Ref = useRef(null);
  const curtain2Ref = useRef(null);
  const counterRef  = useRef(null);
  const logoRef     = useRef(null);
  const taglineRef  = useRef(null);
  const lineRef     = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const obj = { val: 0 };
    const countTween = gsap.to(obj, {
      val: 100, duration: 2.6, ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(obj.val)),
    });

    const logoTl = gsap.timeline({ delay: 0.4 });
    const logoWords = logoRef.current?.querySelectorAll('.logo-word');
    if (logoWords?.length) {
      logoTl.fromTo(logoWords, { y: '110%', rotation: 4 }, { y: 0, rotation: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out' });
    }
    logoTl
      .fromTo(taglineRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.6')
      .fromTo(lineRef.current, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut' }, '-=0.8');

    const exitTl = gsap.timeline({ delay: 3.0 });
    exitTl
      .to(counterRef.current, { opacity: 0, duration: 0.4 })
      .to(logoRef.current, { opacity: 0, y: -20, duration: 0.5, ease: 'expo.in' }, '<')
      .to(taglineRef.current, { opacity: 0, duration: 0.3 }, '<+0.1')
      .to(curtain2Ref.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.1')
      .to(curtain1Ref.current, {
        yPercent: -100, duration: 1.0, ease: 'expo.inOut',
        onComplete: () => { document.body.style.overflow = ''; onComplete?.(); },
      }, '-=0.65');

    return () => { countTween.kill(); logoTl.kill(); exitTl.kill(); };
  }, [onComplete]);

  return (
    <div ref={loaderRef} style={{ position: 'fixed', inset: 0, zIndex: 9000, pointerEvents: 'none' }}>
      <div ref={curtain1Ref} style={{ position: 'absolute', inset: 0, background: 'var(--surface)', zIndex: 1 }} />
      <div ref={curtain2Ref} style={{ position: 'absolute', inset: 0, background: 'var(--bg)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.04, pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Corner brackets */}
          {[{top:-48,left:-48,borderTop:'1px solid',borderLeft:'1px solid'},{top:-48,right:-48,borderTop:'1px solid',borderRight:'1px solid'},{bottom:-48,left:-48,borderBottom:'1px solid',borderLeft:'1px solid'},{bottom:-48,right:-48,borderBottom:'1px solid',borderRight:'1px solid'}].map((s,i) => (
            <div key={i} style={{ position:'absolute', width:28, height:28, borderColor:'var(--border)', ...s }} />
          ))}

          <div ref={logoRef} style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(3.5rem,8vw,6rem)', fontWeight:300, letterSpacing:'-0.02em', lineHeight:1, display:'flex', justifyContent:'center', gap:'0.25em', overflow:'hidden' }}>
              {['Yash', 'Jodh'].map((word, i) => (
                <span key={word} className="logo-word" style={{ display:'inline-block', color: i === 1 ? 'var(--gold)' : 'var(--cream)' }}>{word}</span>
              ))}
            </div>
          </div>

          <div ref={lineRef} style={{ height:1, background:'var(--border)', margin:'20px auto', width:'100%' }} />

          <p ref={taglineRef} style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.28em', textTransform:'uppercase', color:'var(--muted)', opacity:0 }}>
            Full Stack Developer
          </p>
        </div>

        <div ref={counterRef} style={{ position:'absolute', bottom:48, right:'var(--pad-x)', display:'flex', alignItems:'flex-end', gap:6 }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'4.5rem', fontWeight:300, color:'var(--cream)', lineHeight:1, minWidth:'3ch', textAlign:'right' }}>
            {String(count).padStart(2, '0')}
          </span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.16em', color:'var(--muted)', paddingBottom:10 }}>/ 100</span>
        </div>

        <div style={{ position:'absolute', bottom:48, left:'var(--pad-x)', fontFamily:'var(--font-mono)', fontSize:'0.58rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>
          Loading Portfolio
        </div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:'var(--border-2)' }}>
          <div style={{ height:'100%', background:'var(--gold)', width:`${count}%`, transition:'width 0.1s linear' }} />
        </div>
      </div>
    </div>
  );
}
