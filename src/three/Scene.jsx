/**
 * Scene.jsx
 * Background WebGL canvas: ambient particle field + cinematic vignette lines
 * Sits behind all content as a fixed, full-screen canvas.
 */
import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export default function Scene() {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  const init = useCallback(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 50;

    /* ── Star Field (distant particles) ── */
    const starCount = 800;
    const starPos   = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 100;
      starSizes[i]       = Math.random() * 1.5 + 0.3;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color('#c8a45a') },
      },
      vertexShader: /* glsl */`
        attribute float size;
        uniform float uTime;
        varying float vAlpha;
        void main(){
          vAlpha = 0.3 + 0.5 * abs(sin(uTime * 0.3 + position.x));
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mv.z);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3 uColor;
        varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float circle = 1.0 - smoothstep(0.6, 1.0, d);
          gl_FragColor = vec4(uColor, circle * vAlpha);
        }
      `,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── Grid Lines (subtle cinematic ground grid) ── */
    const gridGeo = new THREE.BufferGeometry();
    const lineVerts = [];
    const count = 20;
    const spread = 60;
    for (let i = -count; i <= count; i++) {
      const t = (i / count) * spread;
      // horizontal
      lineVerts.push(-spread, -20, t, spread, -20, t);
      // vertical
      lineVerts.push(t, -20, -spread, t, -20, spread);
    }
    gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
    const gridMat = new THREE.LineBasicMaterial({
      color: 0xc8a45a,
      transparent: true,
      opacity: 0.04,
    });
    const grid = new THREE.LineSegments(gridGeo, gridMat);
    scene.add(grid);

    /* ── Mouse + Scroll ── */
    const mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.8;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener('mousemove', onMouse);

    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Animation ── */
    let frameId;
    const clock = new THREE.Clock();
    const targetCamera = new THREE.Vector3();

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      starMat.uniforms.uTime.value = t;

      // Camera drift
      targetCamera.x += (mouse.x * 6 - targetCamera.x) * 0.04;
      targetCamera.y += (-mouse.y * 3 - targetCamera.y) * 0.04;
      camera.position.x = targetCamera.x;
      camera.position.y = targetCamera.y;
      camera.lookAt(0, 0, 0);

      // Scroll parallax
      stars.position.y = -scrollY * 0.015;
      grid.position.y  = -20 - scrollY * 0.005;

      stars.rotation.z = t * 0.008;

      renderer.render(scene, camera);
    };
    tick();

    /* ── Resize ── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    cleanupRef.current = () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      starGeo.dispose(); starMat.dispose();
      gridGeo.dispose(); gridMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    init();
    return () => cleanupRef.current?.();
  }, [init]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
