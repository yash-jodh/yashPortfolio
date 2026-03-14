import { useEffect, useRef, useState } from 'react';
import { animateSplitText, animateFadeUp, animateStagger } from '../animations/scrollAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  { num: '01', title: 'Understand the Problem', body: 'Every good build starts with asking the right questions. I invest time understanding requirements, edge cases, and the user journey before writing a single line.' },
  { num: '02', title: 'Design the Architecture', body: 'Schema first. I design the database structure, define the API contract, and plan the component tree before touching the keyboard — saving hours of refactoring.' },
  { num: '03', title: 'Build & Iterate', body: 'I develop in focused sprints — backend first, then integrate the frontend. Continuous testing and iteration until the feature is solid and the UI feels right.' },
  { num: '04', title: 'Optimize & Deploy', body: 'Performance, security, and clean code reviews before shipping. I care about bundle size, query optimization, and making sure the final product is production-ready.' },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const processRef = useRef(null);
  const formRef    = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused]     = useState(null);

  useEffect(() => {
    animateSplitText(headingRef.current, { stagger: 0.04, duration: 1.2 });
    animateFadeUp(sectionRef.current?.querySelectorAll('.contact-info-item'));
    animateStagger(processRef.current, processRef.current?.querySelectorAll('.process-step'), { stagger: 0.12, y: 30 });
    animateFadeUp(formRef.current?.querySelectorAll('.form-group'), { stagger: 0.08 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const btn = formRef.current?.querySelector('.submit-btn');
    gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    setTimeout(() => setSubmitted(true), 200);
  };

  const inputStyle = (name) => ({
    background: 'transparent', border: 'none',
    borderBottom: `1px solid ${focused === name ? 'var(--gold)' : 'var(--border-2)'}`,
    color: 'var(--cream)', fontFamily: 'var(--font-body)',
    fontSize: '0.9rem', padding: '12px 0', outline: 'none',
    width: '100%', resize: 'none', transition: 'border-color 0.3s',
  });

  return (
    <section id="contact" ref={sectionRef} style={{ paddingTop: 0 }}>

      {/* ── PROCESS ── */}
      <div id="process" style={{ paddingBottom: 'var(--pad-section)' }}>
        <p className="eyebrow" style={{ marginBottom: 20 }}>
          <span className="eyebrow-num">07</span>
          My Workflow
        </p>
        <h2 className="display" style={{ fontSize: 'clamp(2.8rem, 4.5vw, 5rem)', marginBottom: 72, textAlign: 'center' }}>
          How I <em>Build</em><br/>Things
        </h2>

        <div ref={processRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
          <div style={{ gridColumn: 2, gridRow: '1 / -1', background: 'var(--border-2)', width: 1 }} />
          {PROCESS_STEPS.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={step.num} className="process-step"
                style={{ gridColumn: isLeft ? 1 : 3, padding: '52px 60px', borderBottom: '1px solid var(--border-2)', textAlign: isLeft ? 'right' : 'left' }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 300, color: 'rgba(200,164,90,0.1)', lineHeight: 1, marginBottom: 8 }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 300, marginBottom: 14 }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--muted)', maxWidth: 300, marginLeft: isLeft ? 'auto' : 0 }}>
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── QUOTE ── */}
      <div style={{
        borderTop: '1px solid var(--border-2)', borderBottom: '1px solid var(--border-2)',
        padding: '100px var(--pad-x)', textAlign: 'center',
        background: 'var(--surface)',
        margin: '0 calc(-1 * var(--pad-x))',
        paddingLeft: 'var(--pad-x)', paddingRight: 'var(--pad-x)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', color: 'var(--gold)', opacity: 0.12, lineHeight: 0, marginBottom: 44, userSelect: 'none' }}>"</div>
        <blockquote className="display fade-up" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.8rem)', fontStyle: 'italic', lineHeight: 1.3, maxWidth: 800, margin: '0 auto' }}>
          Engineering taught me to think in systems. Development taught me to think in <em>experiences</em>. I build at the intersection of both.
        </blockquote>
        <p className="fade-up" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 44 }}>
          — Yash Jodh <span style={{ color: 'var(--gold)' }}>/ On Engineering &amp; Code</span>
        </p>
      </div>

      {/* ── CONTACT FORM ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '80px', paddingTop: 'var(--pad-section)', alignItems: 'start' }}>

        {/* LEFT */}
        <div>
          <p className="eyebrow">
            <span className="eyebrow-num">08</span>
            Let's Connect
          </p>
          <h2 ref={headingRef} className="display" style={{ fontSize: 'clamp(2.8rem, 4.5vw, 4.8rem)', marginBottom: 24 }}>
            Got a Project<br/>in <em>Mind?</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.9, color: 'var(--muted)', maxWidth: 400, marginBottom: 52 }}>
            I'm currently open to full-time roles, internships, and freelance 
            projects. Whether you need a full-stack app, a polished frontend, 
            or a solid backend API — let's build something great together.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {[
              { label: 'Email',      value: 'yashjodh@gmail.com',     href: 'mailto:yashjodh82@gmail.com' },
              { label: 'GitHub',     value: 'github.com/yash-jodh',    href: 'https://github.com/yash-jodh' },
              { label: 'LinkedIn',   value: 'linkedin.com/in/yashjodh', href: 'https://www.linkedin.com/in/yash-jodh-8a9721327' },
              { label: 'Status',     value: 'Open to Opportunities',  href: null, gold: true },
            ].map(({ label, value, href, gold }) => (
              <div key={label} className="contact-info-item">
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
                  {label}
                </p>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300, color: gold ? 'var(--gold)' : 'var(--cream)', textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = gold ? 'var(--gold)' : 'var(--cream)'}
                  >
                    {value}
                  </a>
                ) : (
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300, color: gold ? 'var(--gold)' : 'var(--cream)' }}>
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Form */}
        <div>
          {submitted ? (
            <div style={{ border: '1px solid var(--border)', padding: '60px', textAlign: 'center', background: 'var(--surface)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--gold)', marginBottom: 16 }}>✦</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: 12 }}>Message Received</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Thanks for reaching out! I'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[['first', 'First Name', 'text', 'Rahul'], ['last', 'Last Name', 'text', 'Sharma']].map(([name, label, type, ph]) => (
                  <div key={name} className="form-group">
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>{label}</label>
                    <input required type={type} placeholder={ph} style={inputStyle(name)} onFocus={() => setFocused(name)} onBlur={() => setFocused(null)} />
                  </div>
                ))}
              </div>

              {[
                ['email', 'Email Address', 'email', 'you@company.com'],
                ['role',  'Role / Opportunity', 'text', 'Frontend Dev, Full Stack, Internship…'],
              ].map(([name, label, type, ph]) => (
                <div key={name} className="form-group">
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>{label}</label>
                  <input required type={type} placeholder={ph} style={inputStyle(name)} onFocus={() => setFocused(name)} onBlur={() => setFocused(null)} />
                </div>
              ))}

              <div className="form-group">
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Your Message</label>
                <textarea required rows={5} placeholder="Tell me about your project or opportunity…" style={{ ...inputStyle('message'), resize: 'vertical' }} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} />
              </div>

              <button type="submit" className="submit-btn btn btn-gold" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                <span>
                  Send Message
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4 }}>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(107,101,96,0.35); }
        input, textarea { -webkit-appearance: none; }
        @media(max-width:768px){
          #contact > div:last-child { grid-template-columns: 1fr !important; }
          #process > div { grid-template-columns: 1fr !important; }
          #process > div > div:nth-child(2) { display: none; }
        }
      `}</style>
    </section>
  );
}
