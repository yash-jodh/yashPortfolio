/**
 * SkillsCar.jsx
 * ─────────────────────────────────────────────────────────
 * Scroll-driven Three.js scene:
 *  - Low-poly cinematic car drives down a gold-marked road
 *  - 8 skill sign-posts spaced along the road
 *  - As the car passes each sign, an HTML skill card pops up
 *  - Camera follows the car from behind (cinematic chase cam)
 *  - Entire section is GSAP ScrollTrigger-pinned
 * ─────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── SKILLS DATA ── */
const SKILLS = [
  { label: 'React.js',    sub: 'UI Framework',    icon: '⚛',  color: '#61dafb', glow: 'rgba(97,218,251,0.35)' },
  { label: 'Node.js',     sub: 'Runtime',          icon: '⬢',  color: '#68a063', glow: 'rgba(104,160,99,0.35)'  },
  { label: 'Express.js',  sub: 'Web Framework',    icon: '▸',  color: '#c8a45a', glow: 'rgba(200,164,90,0.35)'  },
  { label: 'JavaScript',  sub: 'ES6+',             icon: 'JS', color: '#f7df1e', glow: 'rgba(247,223,30,0.35)'  },
  { label: 'HTML / CSS',  sub: 'Foundation',       icon: '◈',  color: '#e44d26', glow: 'rgba(228,77,38,0.35)'   },
  { label: 'MySQL',       sub: 'SQL Database',     icon: '🗄', color: '#4479a1', glow: 'rgba(68,121,161,0.35)'  },
  { label: 'MongoDB',     sub: 'NoSQL Database',   icon: '🍃', color: '#47a248', glow: 'rgba(71,162,72,0.35)'   },
  { label: 'REST APIs',   sub: 'Backend Design',   icon: '⇌',  color: '#c8a45a', glow: 'rgba(200,164,90,0.35)'  },
];

/* ── ROAD CONFIG ── */
const ROAD_LENGTH    = 160;
const SIGN_SPACING   = ROAD_LENGTH / (SKILLS.length + 1);
const ROAD_WIDTH     = 12;
const CAR_START_Z    = ROAD_LENGTH * 0.5 - 4;
const CAR_END_Z      = -ROAD_LENGTH * 0.5 + 16;
const TRIGGER_OFFSET = 5; // how far past sign before card pops

/* ────────────────────────────────── */

function buildCar(scene) {
  const group = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({ color: 0xc8a45a, metalness: 0.8, roughness: 0.3 });
  const body = new THREE.MeshStandardMaterial({ color: 0x1a1614, metalness: 0.9, roughness: 0.2 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x0d1f2d, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.85 });
  const wheel = new THREE.MeshStandardMaterial({ color: 0x0c0b0a, metalness: 0.3, roughness: 0.8 });
  const rim   = new THREE.MeshStandardMaterial({ color: 0xc8a45a, metalness: 1.0, roughness: 0.1 });
  const light = new THREE.MeshStandardMaterial({ color: 0xfff4cc, emissive: new THREE.Color(0xfff4cc), emissiveIntensity: 2 });

  // ── Car body ──
  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 4.8), body);
  bodyMesh.position.y = 0.5;
  group.add(bodyMesh);

  // ── Cabin (top) ──
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.52, 2.6), body);
  cabin.position.set(0, 1.04, 0.15);
  group.add(cabin);

  // ── Windshields ──
  const windshieldF = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), glass);
  windshieldF.position.set(0, 1.0, 1.52);
  windshieldF.rotation.x = -0.22;
  group.add(windshieldF);

  const windshieldR = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), glass);
  windshieldR.position.set(0, 1.0, -1.22);
  windshieldR.rotation.x = 0.22;
  group.add(windshieldR);

  // ── Side windows ──
  [-0.92, 0.92].forEach((x) => {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.38), glass);
    win.position.set(x, 1.04, 0.2);
    win.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
    group.add(win);
  });

  // ── Gold accent strip ──
  const strip = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.04, 4.82), gold);
  strip.position.y = 0.72;
  group.add(strip);

  // ── Spoiler ──
  const spoilerBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 0.5), gold);
  spoilerBase.position.set(0, 1.14, -2.0);
  group.add(spoilerBase);

  // ── Hood detail ──
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.07, 1.4), gold);
  hood.position.set(0, 0.785, 1.5);
  group.add(hood);

  // ── Headlights ──
  [-0.65, 0.65].forEach((x) => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.05), light);
    hl.position.set(x, 0.62, 2.43);
    group.add(hl);
  });

  // ── Tail lights ──
  [-0.65, 0.65].forEach((x) => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: new THREE.Color(0xff2200), emissiveIntensity: 1.5 }));
    tl.position.set(x, 0.62, -2.43);
    group.add(tl);
  });

  // ── Wheels ──
  const wheelPositions = [
    [-1.14, 0.28, 1.55], [1.14, 0.28, 1.55],
    [-1.14, 0.28, -1.55], [1.14, 0.28, -1.55],
  ];
  wheelPositions.forEach(([wx, wy, wz]) => {
    const wheelGroup = new THREE.Group();
    const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.22, 14), wheel);
    tyre.rotation.z = Math.PI / 2;
    wheelGroup.add(tyre);
    const rimMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.24, 6), rim);
    rimMesh.rotation.z = Math.PI / 2;
    wheelGroup.add(rimMesh);
    // Spokes
    for (let s = 0; s < 3; s++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 0.05), rim);
      spoke.rotation.x = (s / 3) * Math.PI;
      spoke.rotation.z = Math.PI / 2;
      wheelGroup.add(spoke);
    }
    wheelGroup.position.set(wx, wy, wz);
    group.add(wheelGroup);
  });

  // ── Car headlight beams (PointLights) ──
  const headlightL = new THREE.PointLight(0xfff4cc, 3.5, 18);
  headlightL.position.set(-0.6, 0.6, 3.0);
  group.add(headlightL);
  const headlightR = new THREE.PointLight(0xfff4cc, 3.5, 18);
  headlightR.position.set(0.6, 0.6, 3.0);
  group.add(headlightR);

  group.userData.wheels = wheelPositions.map((_, i) => group.children[11 + i]);
  group.userData.headlightL = headlightL;
  group.userData.headlightR = headlightR;

  scene.add(group);
  return group;
}

function buildRoad(scene) {
  const group = new THREE.Group();

  // ── Asphalt ──
  const asphalt = new THREE.Mesh(
    new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_LENGTH, 1, 60),
    new THREE.MeshStandardMaterial({ color: 0x0e0d0b, metalness: 0.1, roughness: 0.95 })
  );
  asphalt.rotation.x = -Math.PI / 2;
  group.add(asphalt);

  // ── Road edges (gold) ──
  [-ROAD_WIDTH / 2, ROAD_WIDTH / 2].forEach((x) => {
    const edge = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.04, ROAD_LENGTH),
      new THREE.MeshStandardMaterial({ color: 0xc8a45a, metalness: 0.6, roughness: 0.4 })
    );
    edge.position.set(x, 0.02, 0);
    group.add(edge);
  });

  // ── Center dashes ──
  const dashCount = 40;
  const dashLen   = 2.2;
  const dashGap   = ROAD_LENGTH / dashCount;
  for (let i = 0; i < dashCount; i++) {
    const dash = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.03, dashLen),
      new THREE.MeshStandardMaterial({ color: 0xc8a45a, metalness: 0.3, roughness: 0.6, transparent: true, opacity: 0.5 })
    );
    dash.position.set(0, 0.015, -ROAD_LENGTH / 2 + i * dashGap + dashGap / 2);
    group.add(dash);
  }

  // ── Ground plane (dark earth either side) ──
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, ROAD_LENGTH),
    new THREE.MeshStandardMaterial({ color: 0x080706, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  group.add(ground);

  scene.add(group);
  return group;
}

function buildSignPost(scene, zPos, color) {
  const group = new THREE.Group();

  // ── Post ──
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 2.4, 6),
    new THREE.MeshStandardMaterial({ color: 0x333028, metalness: 0.7, roughness: 0.4 })
  );
  post.position.y = 1.2;
  group.add(post);

  // ── Sign board ──
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.6, 0.06),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.4, roughness: 0.5,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.15,
    })
  );
  sign.position.y = 2.7;
  group.add(sign);

  // ── Sign glow border ──
  const border = new THREE.Mesh(
    new THREE.BoxGeometry(1.52, 0.72, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x0c0b0a, metalness: 0.1, roughness: 0.9 })
  );
  border.position.set(0, 2.7, -0.05);
  group.add(border);

  // ── Point light on sign ──
  const glow = new THREE.PointLight(new THREE.Color(color), 0, 6);
  glow.position.set(0, 2.7, 0.5);
  group.add(glow);
  group.userData.glow = glow;

  group.position.set(ROAD_WIDTH / 2 + 1.2, 0, zPos);
  scene.add(group);
  return group;
}

/* ─────────────────────────────────────────── */

export default function SkillsCar() {
  const mountRef       = useRef(null);
  const wrapRef        = useRef(null);
  const cleanupRef     = useRef(null);
  const [activeSkills, setActiveSkills] = useState([]);
  const cardRefs       = useRef([]);

  const triggerSkill = useCallback((index) => {
    setActiveSkills((prev) => {
      if (prev.includes(index)) return prev;
      return [...prev, index];
    });
    // GSAP card pop-up animation (after React renders it)
    setTimeout(() => {
      const card = cardRefs.current[index];
      if (!card) return;
      gsap.fromTo(card,
        { y: 60, opacity: 0, scale: 0.7, rotation: -4 },
        { y: 0,  opacity: 1, scale: 1,   rotation: 0,
          duration: 0.7, ease: 'back.out(1.8)' }
      );
    }, 20);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    const wrap  = wrapRef.current;
    if (!mount || !wrap) return;

    /* ── Renderer ── */
    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene ── */
    const scene  = new THREE.Scene();
    scene.fog    = new THREE.FogExp2(0x080706, 0.022);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 300);
    camera.position.set(0, 5.5, 14);
    camera.lookAt(0, 1, 0);

    /* ── Lighting ── */
    const ambient = new THREE.AmbientLight(0x1a1610, 1.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfff0cc, 2.0);
    dirLight.position.set(8, 16, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Subtle blue fill from above
    const fillLight = new THREE.DirectionalLight(0x1a2840, 0.8);
    fillLight.position.set(-6, 10, -10);
    scene.add(fillLight);

    /* ── Build scene objects ── */
    buildRoad(scene);
    const car = buildCar(scene);
    car.position.set(0, 0, CAR_START_Z);
    car.rotation.y = Math.PI; // face direction of travel

    /* ── Sign posts ── */
    const signPosts = SKILLS.map((skill, i) => {
      const zPos = ROAD_LENGTH / 2 - SIGN_SPACING * (i + 1);
      return buildSignPost(scene, zPos, skill.color);
    });

    /* ── Ambient particles ── */
    const particleCount = 120;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 30;
      pPositions[i * 3 + 1] = Math.random() * 6;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * ROAD_LENGTH;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xc8a45a, size: 0.06, transparent: true, opacity: 0.4, sizeAttenuation: true });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ── Scroll progress tracker ── */
    const state = { progress: 0 };
    const triggeredSigns = new Set();

    /* ── GSAP ScrollTrigger pin + scrub ── */
    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: '+=3000',
      pin: true,
      scrub: 1.2,
      onUpdate: (self) => { state.progress = self.progress; },
    });

    /* ── Animation loop ── */
    let frameId;
    const clock = new THREE.Clock();
    const camTarget = new THREE.Vector3();
    const camPos    = new THREE.Vector3();

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const t   = clock.getElapsedTime();
      const p   = state.progress;

      /* Car position along road */
      const carZ = THREE.MathUtils.lerp(CAR_START_Z, CAR_END_Z, p);
      car.position.z = carZ;

      /* Subtle body bob */
      car.position.y = Math.sin(t * 8 + carZ * 0.5) * 0.018;

      /* Wheel spin */
      const speed = (CAR_START_Z - CAR_END_Z) * p;
      car.children.forEach((child, i) => {
        if (i >= 11 && i <= 14) { // wheel groups
          child.rotation.x = -(speed * 0.5);
        }
      });

      /* ── Chase camera ── */
      const camBehind = 12 + Math.sin(t * 0.3) * 0.4;
      const camHeight  = 5.2 + Math.sin(t * 0.2) * 0.15;
      camPos.set(Math.sin(t * 0.12) * 0.8, camHeight, carZ + camBehind);
      camera.position.lerp(camPos, 0.05);
      camTarget.set(0, 1.2, carZ - 4);
      camera.lookAt(camTarget);

      /* ── Check sign triggers ── */
      signPosts.forEach((sign, i) => {
        const signZ = sign.position.z;
        if (carZ < signZ + TRIGGER_OFFSET && !triggeredSigns.has(i)) {
          triggeredSigns.add(i);
          // Light up sign
          gsap.to(sign.userData.glow, { intensity: 2.5, duration: 0.4, ease: 'expo.out',
            onComplete: () => gsap.to(sign.userData.glow, { intensity: 0.8, duration: 1.5 }) });
          // Bounce sign board
          gsap.fromTo(sign.children[1].position, { y: 4.0 }, { y: 2.7, duration: 0.6, ease: 'back.out(2)' });
          // HTML card
          triggerSkill(i);
        }
      });

      /* Particle drift */
      particles.rotation.y = t * 0.01;

      /* Headlight pulse */
      const pulse = 3.5 + Math.sin(t * 2) * 0.3;
      car.userData.headlightL && (car.userData.headlightL.intensity = pulse);
      car.userData.headlightR && (car.userData.headlightR.intensity = pulse);

      renderer.render(scene, camera);
    };
    tick();

    /* ── Resize ── */
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    cleanupRef.current = () => {
      cancelAnimationFrame(frameId);
      st.kill();
      window.removeEventListener('resize', onResize);
      pGeo.dispose(); pMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };

    return () => cleanupRef.current?.();
  }, [triggerSkill]);

  return (
    <section
      id="skills"
      ref={wrapRef}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border-2)',
        borderBottom: '1px solid var(--border-2)',
      }}
    >
      {/* Section label */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 10,
        padding: '32px var(--pad-x)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, rgba(8,7,6,0.9) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 6 }}>
            <span className="eyebrow-num">03</span>
            Skills Drive
          </p>
          <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
            Scroll to <em>unlock</em> the stack
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {activeSkills.length} / {SKILLS.length} unlocked
          </p>
          {/* Progress bar */}
          <div style={{ marginTop: 8, width: 140, height: 2, background: 'var(--border-2)' }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
              width: `${(activeSkills.length / SKILLS.length) * 100}%`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Three.js Canvas */}
      <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* Skill cards HTML overlay — scattered across the scene */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        {SKILLS.map((skill, i) => {
          const isActive = activeSkills.includes(i);
          /* Arrange cards in two rows, alternating sides */
          const col = i % 4;
          const row = Math.floor(i / 4);
          const leftPct = 8 + col * 22;
          const topPct  = row === 0 ? 20 : 58;

          return (
            <div
              key={skill.label}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{
                position: 'absolute',
                left: `${leftPct}%`,
                top: `${topPct}%`,
                opacity: 0,
                transform: 'translateY(60px) scale(0.7)',
                display: isActive ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0,
              }}
            >
              <SkillCard skill={skill} index={i} />
            </div>
          );
        })}
      </div>

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 100, zIndex: 6,
        background: 'linear-gradient(to top, var(--bg), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 7,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        opacity: activeSkills.length === SKILLS.length ? 0 : 1,
        transition: 'opacity 0.6s',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Keep scrolling
        </span>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, var(--gold), transparent)', animation: 'skillPulse 1.8s ease-in-out infinite' }} />
      </div>

      <style>{`
        @keyframes skillPulse {
          0%,100%{transform:scaleY(1);opacity:1}
          50%{transform:scaleY(0.5);opacity:0.4}
        }
        @media(max-width:768px){
          #skills .skill-card-label { font-size: 0.55rem !important; }
        }
      `}</style>
    </section>
  );
}

/* ── SKILL CARD COMPONENT ── */
function SkillCard({ skill, index }) {
  return (
    <div
      style={{
        background: 'rgba(8,7,6,0.88)',
        border: `1px solid ${skill.color}55`,
        backdropFilter: 'blur(12px)',
        padding: '14px 18px',
        minWidth: 130,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 8px 32px ${skill.glow}, 0 0 0 1px ${skill.color}22`,
      }}
    >
      {/* Glow corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 40, height: 40,
        background: `radial-gradient(circle at top right, ${skill.color}30, transparent 70%)`,
      }} />

      {/* Index */}
      <span style={{
        position: 'absolute', top: 8, right: 10,
        fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
        letterSpacing: '0.12em', color: `${skill.color}88`,
      }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icon */}
      <div style={{
        fontFamily: skill.icon.length <= 2 ? 'var(--font-mono)' : 'inherit',
        fontSize: skill.icon.length <= 2 ? '1.0rem' : '1.3rem',
        color: skill.color,
        fontWeight: 600,
        marginBottom: 8,
        lineHeight: 1,
      }}>
        {skill.icon}
      </div>

      {/* Label */}
      <div className="skill-card-label" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.0rem',
        fontWeight: 300,
        color: 'var(--cream)',
        lineHeight: 1.1,
        marginBottom: 4,
      }}>
        {skill.label}
      </div>

      {/* Sub */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.52rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: skill.color,
        opacity: 0.8,
      }}>
        {skill.sub}
      </div>

      {/* Bottom line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 2, width: '100%',
        background: `linear-gradient(90deg, ${skill.color}, transparent)`,
        opacity: 0.6,
      }} />
    </div>
  );
}
