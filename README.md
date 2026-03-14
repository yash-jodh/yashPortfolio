# Storytelling Portfolio — Alex Noir

A cinematic visual storytelling portfolio built with React + Three.js + GSAP + Lenis.

## ⚡ Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build
```

---

## 🗂️ Complete File Structure

```
portfolio/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx                          ← Root: Lenis, cursor, sound, loader
    ├── styles/
    │   └── global.css                   ← Full design system + keyframes
    ├── animations/
    │   ├── scrollAnimations.js          ← GSAP ScrollTrigger utilities
    │   └── useScrollVelocity.js         ← Velocity/progress/direction hooks
    ├── three/
    │   ├── Scene.jsx                    ← Background star field + grid WebGL
    │   └── FloatingSphere.jsx           ← Noise-displaced iridescent sphere
    └── components/
        ├── Loader.jsx                   ← Cinematic preloader with counter
        ├── Navbar.jsx                   ← Fixed nav + scroll progress bar
        ├── MagneticButton.jsx           ← Reusable magnetic hover component
        ├── CursorPreview.jsx            ← Project card cursor preview panel
        ├── Hero.jsx                     ← Full-screen hero + WebGL sphere
        ├── About.jsx                    ← About + GSAP clip/split reveals
        ├── Projects.jsx                 ← Horizontal scroll + 3D tilt cards
        ├── Testimonials.jsx             ← Awards grid + testimonials + press marquee
        └── Contact.jsx                  ← Process steps + contact form
```

---

## ✨ Features

| Feature | Implementation |
|---|---|
| Cinematic Preloader | GSAP timeline, count-up, double-curtain wipe |
| WebGL Sphere | Three.js + custom GLSL noise displacement + iridescent shader |
| Background Scene | Star particles + grid, shader-animated |
| Smooth Scroll | Lenis (v1) with GSAP ticker integration |
| Split Text Reveals | Word-by-word masked slide-up via GSAP ScrollTrigger |
| Clip Path Wipe | `animateClipReveal()` for image entrance |
| Horizontal Scroll | Pinned GSAP scroll with scrub, 5 project cards |
| 3D Card Tilt | mousemove perspective transform on project cards |
| Cursor Preview | Floating card that follows mouse over project tiles |
| Custom Cursor | Dot + lagging ring + velocity-driven squish deformation |
| Magnetic Buttons | `MagneticButton.jsx` reusable component |
| Scroll Velocity | `useScrollVelocity` hook drives cursor + sphere distortion |
| Ambient Sound | Web Audio API — 5 drone oscillators + LFO + noise reverb |
| Awards Section | Grid with hover gold underline animation |
| Testimonials | Cards with masonry-style responsive grid |
| Press Marquee | Auto-scroll press logos with hover gold highlight |
| Keyboard Nav | ↑↓ / j/k keys jump between sections |
| Scroll Progress | Gold scaleX progress bar at top |
| Hide-on-scroll Nav | Nav hides going down, appears going up |
| Form | Animated focus states, success state with GSAP |

---

## 🎨 Design System

```css
--bg:          #080706   /* deep charcoal */
--gold:        #c8a45a   /* warm amber    */
--cream:       #ede8df   /* off-white     */
--font-display: Cormorant Garamond (serif, editorial)
--font-body:    DM Sans  (clean, modern)
--font-mono:    DM Mono  (labels, tags)
```

---

## 🛠️ Customization

```bash
# Change name throughout:
grep -r "Alex Noir" src/ --include="*.jsx"

# Add real project images (in Projects.jsx):
# Replace gradient divs with <img src="/your-image.jpg" ... />

# Tune the WebGL sphere (FloatingSphere.jsx):
uDistort: 0.28   # 0 = smooth sphere, 0.5 = extreme blob
uSpeed:   0.22   # animation speed

# Adjust scroll smoothness (App.jsx Lenis):
duration: 1.6    # higher = smoother/slower
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18 | UI framework |
| `three` | ^0.167 | WebGL / 3D |
| `gsap` | ^3.12 | Animation engine |
| `lenis` | ^1.1 | Smooth scroll |
| `howler` | ^2.2 | (Available for audio files) |
| `vite` | ^5 | Build tool |
