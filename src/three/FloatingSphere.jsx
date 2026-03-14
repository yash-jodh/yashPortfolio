/**
 * FloatingSphere.jsx
 * WebGL floating sphere with custom noise-displacement vertex shader
 * and iridescent fragment shader, rendered to a Three.js canvas.
 */
import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

/* ── GLSL: Simplex Noise (used in vertex shader) ── */
const NOISE_GLSL = /* glsl */`
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

/* ── VERTEX SHADER ── */
const VERTEX = /* glsl */`
  ${NOISE_GLSL}

  uniform float uTime;
  uniform float uDistort;
  uniform float uSpeed;
  varying vec3  vNormal;
  varying vec3  vPosition;
  varying float vNoise;

  void main(){
    vNormal   = normal;
    vPosition = position;

    float n = snoise(vec3(position * 1.4 + uTime * uSpeed));
    float n2= snoise(vec3(position * 2.8 - uTime * uSpeed * 0.7));
    float displacement = (n + n2 * 0.5) * uDistort;

    vNoise = n;

    vec3 newPos = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

/* ── FRAGMENT SHADER ── */
const FRAGMENT = /* glsl */`
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorAccent;
  varying vec3  vNormal;
  varying vec3  vPosition;
  varying float vNoise;

  void main(){
    vec3 lightDir = normalize(vec3(1.0, 1.2, 2.0));
    float diff = max(dot(normalize(vNormal), lightDir), 0.0);

    // Iridescent shift
    float angle = dot(normalize(vNormal), normalize(vec3(0.0, 0.0, 1.0)));
    float iri   = pow(1.0 - abs(angle), 3.0);

    // Base gradient from noise
    vec3 color = mix(uColorA, uColorB, vNoise * 0.5 + 0.5);

    // Add iridescent gold shimmer
    color = mix(color, uColorAccent, iri * 0.6);

    // Rim light (cinematic edge glow)
    float rim = 1.0 - clamp(angle, 0.0, 1.0);
    rim = pow(rim, 2.5);
    color += uColorAccent * rim * 0.35;

    // Diffuse lighting
    color = color * (0.4 + diff * 0.6);

    // Subtle pulse on alpha
    float alpha = 0.88 + sin(uTime * 0.6) * 0.06;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function FloatingSphere({ className = '' }) {
  const mountRef   = useRef(null);
  const stateRef   = useRef({});

  const init = useCallback(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 3.5;

    /* ── Sphere ── */
    const geo = new THREE.SphereGeometry(1, 128, 128);
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      uniforms: {
        uTime:        { value: 0 },
        uDistort:     { value: 0.28 },
        uSpeed:       { value: 0.22 },
        uColorA:      { value: new THREE.Color('#1a1510') },
        uColorB:      { value: new THREE.Color('#2c2218') },
        uColorAccent: { value: new THREE.Color('#c8a45a') },
      },
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    /* ── Ambient Particles ── */
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.8 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc8a45a,
      size: 0.012,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ── Mouse Tracking ── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      mouse.tx = ((e.clientX / window.innerWidth)  - 0.5) * 2;
      mouse.ty = -((e.clientY / window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    /* ── Scroll Distortion ── */
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Animation Loop ── */
    let frameId;
    const clock = new THREE.Clock();

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      mat.uniforms.uTime.value = t;

      // Lerp mouse
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mesh.rotation.y = mouse.x * 0.4 + t * 0.06;
      mesh.rotation.x = mouse.y * 0.25;

      // Scroll displacement
      const scrollFactor = Math.min(scrollY / 600, 1);
      mat.uniforms.uDistort.value = 0.28 + scrollFactor * 0.22;

      // Pulse scale
      const pulse = 1 + Math.sin(t * 0.7) * 0.025;
      mesh.scale.setScalar(pulse);

      // Rotate particles
      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.015;
      particleMat.opacity   = 0.3 + Math.sin(t * 0.4) * 0.15;

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

    /* ── Store for cleanup ── */
    stateRef.current = {
      renderer, scene, camera, mesh, geo, mat, particles, particleGeo, particleMat,
      frameId,
      cleanup: () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        geo.dispose();
        mat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      },
    };
  }, []);

  useEffect(() => {
    init();
    return () => stateRef.current.cleanup?.();
  }, [init]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    />
  );
}
