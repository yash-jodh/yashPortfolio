/**
 * scrollAnimations.js
 * GSAP + ScrollTrigger animation utilities for the portfolio
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ── CONFIG ── */
const DEFAULTS = {
  ease: 'expo.out',
  duration: 1.2,
  stagger: 0.08,
};

/* ─────────────────────────────────────────
   TEXT SPLIT + REVEAL
   Each word wraps in a .word div and slides up
───────────────────────────────────────── */
export function animateSplitText(selector, options = {}) {
  const elements = gsap.utils.toArray(selector);
  if (!elements.length) return;

  elements.forEach((el) => {
    // Use CSS split approach (no SplitText plugin needed in free GSAP)
    const text = el.textContent;
    const words = text.split(' ');
    el.innerHTML = words
      .map(
        (word) =>
          `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.25em"><span class="word-inner" style="display:inline-block;transform:translateY(110%) rotate(2deg)">${word}</span></span>`
      )
      .join('');

    const inners = el.querySelectorAll('.word-inner');

    ScrollTrigger.create({
      trigger: el,
      start: options.start || 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(inners, {
          y: 0,
          rotation: 0,
          duration: options.duration || 1.1,
          ease: options.ease || 'expo.out',
          stagger: options.stagger || 0.05,
        });
      },
    });
  });
}

/* ─────────────────────────────────────────
   FADE UP REVEAL
───────────────────────────────────────── */
export function animateFadeUp(selector, options = {}) {
  const elements = gsap.utils.toArray(selector);
  if (!elements.length) return;

  elements.forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: options.y || 50 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration || DEFAULTS.duration,
        ease: options.ease || DEFAULTS.ease,
        delay: options.delay || 0,
        scrollTrigger: {
          trigger: el,
          start: options.start || 'top 88%',
          once: true,
        },
      }
    );
  });
}

/* ─────────────────────────────────────────
   STAGGER GROUP REVEAL
───────────────────────────────────────── */
export function animateStagger(trigger, children, options = {}) {
  const trig = typeof trigger === 'string' ? document.querySelector(trigger) : trigger;
  if (!trig || !children) return;                          // ← null-guard before Array.from
  const items = typeof children === 'string'
    ? gsap.utils.toArray(children)
    : Array.from(children);
  if (!trig || !items.length) return;

  gsap.fromTo(
    items,
    { opacity: 0, y: options.y || 40 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.9,
      ease: options.ease || 'expo.out',
      stagger: options.stagger || DEFAULTS.stagger,
      scrollTrigger: {
        trigger: trig,
        start: options.start || 'top 82%',
        once: true,
      },
    }
  );
}

/* ─────────────────────────────────────────
   PARALLAX ELEMENT
───────────────────────────────────────── */
export function animateParallax(selector, strength = 0.2) {
  const elements = gsap.utils.toArray(selector);
  elements.forEach((el) => {
    gsap.to(el, {
      yPercent: strength * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ─────────────────────────────────────────
   HORIZONTAL SCROLL SECTION
───────────────────────────────────────── */
export function createHorizontalScroll(containerSelector, trackSelector) {
  const container = document.querySelector(containerSelector);
  const track = document.querySelector(trackSelector);
  if (!container || !track) return;

  const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

  let st = ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: () => `+=${Math.abs(getScrollAmount())}`,
    pin: true,
    scrub: 1.2,
    anticipatePin: 1,
    animation: gsap.to(track, {
      x: () => getScrollAmount(),
      ease: 'none',
    }),
    invalidateOnRefresh: true,
  });

  return st;
}

/* ─────────────────────────────────────────
   LINE DRAWING REVEAL
───────────────────────────────────────── */
export function animateLineReveal(selector) {
  const elements = gsap.utils.toArray(selector);
  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      }
    );
  });
}

/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────── */
export function animateCounter(selector) {
  const elements = gsap.utils.toArray(selector);
  elements.forEach((el) => {
    const target = parseFloat(el.getAttribute('data-count') || el.textContent);
    const suffix = el.getAttribute('data-suffix') || '';
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = (Number.isInteger(target)
              ? Math.round(obj.val)
              : obj.val.toFixed(1)) + suffix;
          },
        });
      },
    });
  });
}

/* ─────────────────────────────────────────
   CLIP PATH REVEAL (image wipe)
───────────────────────────────────────── */
export function animateClipReveal(selector, direction = 'bottom') {
  const map = {
    bottom: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    right:  ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    left:   ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  };
  const [from, to] = map[direction] || map.bottom;

  const elements = gsap.utils.toArray(selector);
  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: from },
      {
        clipPath: to,
        duration: 1.3,
        ease: 'expo.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });
}

/* ─────────────────────────────────────────
   GSAP PAGE TRANSITION HELPER
───────────────────────────────────────── */
export function pageEnter(onComplete) {
  const tl = gsap.timeline({ onComplete });
  tl.set('body', { overflow: 'hidden' })
    .fromTo(
      '.page-curtain',
      { yPercent: 0 },
      { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }
    )
    .set('body', { overflow: '' });
  return tl;
}

export function pageExit(onComplete) {
  const tl = gsap.timeline({ onComplete });
  tl.set('body', { overflow: 'hidden' })
    .fromTo(
      '.page-curtain',
      { yPercent: 100 },
      { yPercent: 0, duration: 0.8, ease: 'expo.in' });
  return tl;
}

/* ─────────────────────────────────────────
   REFRESH ALL SCROLL TRIGGERS
───────────────────────────────────────── */
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };