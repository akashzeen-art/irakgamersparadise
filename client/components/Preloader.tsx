import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useI18n } from '../lib/i18n';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050a1a);
    scene.fog = new THREE.FogExp2(0x050a1a, 0.008);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(3, 2, 5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x221c42));
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 3, 4);
    scene.add(mainLight);
    const backLight = new THREE.PointLight(0x4422cc, 0.6);
    backLight.position.set(-2, 1, -3);
    scene.add(backLight);
    const fillLight = new THREE.PointLight(0xffaa66, 0.5);
    fillLight.position.set(1.5, 1, 2);
    scene.add(fillLight);
    const colorLight = new THREE.PointLight(0xff6699, 0.8);
    colorLight.position.set(1, 1, 2);
    scene.add(colorLight);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      starPos[i * 3] = 200 * (Math.random() - 0.5);
      starPos[i * 3 + 1] = 100 * (Math.random() - 0.5);
      starPos[i * 3 + 2] = 80 * (Math.random() - 0.5) - 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.08, transparent: true, opacity: 0.6 }));
    scene.add(stars);

    // Core icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1.1, 0);
    const coreMesh = new THREE.Mesh(icoGeo, new THREE.MeshStandardMaterial({
      color: 0x4a4adc, emissive: 0x112233, roughness: 0.28, metalness: 0.75, transparent: true, opacity: 0.92,
    }));
    scene.add(coreMesh);

    // Wireframe
    const wireframeIco = new THREE.Mesh(icoGeo, new THREE.MeshBasicMaterial({ color: 0x6677ff, wireframe: true, transparent: true, opacity: 0.25 }));
    wireframeIco.scale.setScalar(1.08);
    scene.add(wireframeIco);

    // Ring particles
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(1200 * 3);
    const ringCol = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      const t = (i / 1200) * Math.PI * 2;
      const r = 1.55;
      ringPos[i * 3] = Math.cos(t) * r;
      ringPos[i * 3 + 1] = 0.35 * Math.sin(3 * t);
      ringPos[i * 3 + 2] = Math.sin(t) * r;
      ringCol[i * 3] = 0.4 + 0.6 * Math.sin(t);
      ringCol[i * 3 + 1] = 0.3 + 0.7 * Math.cos(1.7 * t);
      ringCol[i * 3 + 2] = 0.8 + 0.2 * Math.sin(2.3 * t);
    }
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    ringGeo.setAttribute('color', new THREE.BufferAttribute(ringCol, 3));
    const ringParticles = new THREE.Points(ringGeo, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending }));
    scene.add(ringParticles);

    // Torus rings
    const torusMat = new THREE.MeshStandardMaterial({ color: 0x8877ff, emissive: 0x2266aa, roughness: 0.3, metalness: 0.9 });
    const torusRing = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.045, 64, 200), torusMat);
    scene.add(torusRing);
    const torusRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.68, 0.03, 64, 200),
      new THREE.MeshStandardMaterial({ color: 0xffaa88, emissive: 0x443300, roughness: 0.5, metalness: 0.7 }));
    scene.add(torusRing2);

    // Cloud particles
    const cloudGeo = new THREE.BufferGeometry();
    const cloudPos = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      cloudPos[i * 3] = 5 * (Math.random() - 0.5);
      cloudPos[i * 3 + 1] = 3 * (Math.random() - 0.5);
      cloudPos[i * 3 + 2] = 4 * (Math.random() - 0.5) - 1;
    }
    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3));
    const cloudPoints = new THREE.Points(cloudGeo, new THREE.PointsMaterial({ color: 0x7777ff, size: 0.025, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }));
    scene.add(cloudPoints);

    // Grid
    const grid = new THREE.GridHelper(12, 24, 0x886677, 0x334488);
    grid.position.y = -1.8;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.2;
    scene.add(grid);

    // Auto rotate camera
    let time = 0;
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.012;

      coreMesh.rotation.y = 0.25 * time;
      coreMesh.rotation.x = 0.2 * Math.sin(0.37 * time);
      coreMesh.rotation.z = 0.15 * Math.cos(0.23 * time);
      wireframeIco.rotation.copy(coreMesh.rotation);

      ringParticles.rotation.y = 0.35 * time;
      ringParticles.rotation.x = 0.2 * Math.sin(0.28 * time);

      torusRing.rotation.x = Math.PI / 2;
      torusRing.rotation.z = 0.5 * time;
      torusRing2.rotation.x = Math.PI / 2 + 0.3;
      torusRing2.rotation.z = 0.65 * time;

      colorLight.color.setHSL(0.55 + 0.1 * Math.sin(0.2 * time % (2 * Math.PI)), 1, 0.6);
      stars.rotation.y += 0.0005;
      stars.rotation.x += 0.0003;
      cloudPoints.rotation.y = 0.05 * time;
      cloudPoints.rotation.x = 0.1 * Math.sin(0.1 * time);

      // Slow orbit camera
      camera.position.x = 5 * Math.sin(time * 0.08);
      camera.position.z = 5 * Math.cos(time * 0.08);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        >
          {/* Three.js canvas */}
          <div ref={mountRef} className="absolute inset-0" />

          {/* Overlay UI */}
          <div className="relative z-10 flex flex-col items-center gap-4 pointer-events-none">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl font-black tracking-widest text-center"
              style={{
                background: 'linear-gradient(90deg, #06b6d4, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.8))',
              }}
            >
              {t('preloaderTitle') as string}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm tracking-[0.4em] text-cyan-400"
            >
              {t('preloaderSub') as string}
            </motion.p>

            {/* Progress bar */}
            <div className="w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5.8, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                style={{ boxShadow: '0 0 12px rgba(168,85,247,0.8)' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
