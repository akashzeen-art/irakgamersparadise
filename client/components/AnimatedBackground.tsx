import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function AnimatedBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // --- Floating particles ---
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorOptions = [
      new THREE.Color('#06b6d4'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#ec4899'),
    ];
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      const c = colorOptions[i % 3];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Floating wireframe icosahedrons ---
    const icoMeshes: THREE.Mesh[] = [];
    const icoData = [
      { pos: [-5, 2, -3], size: 1.2, color: '#a855f7', speed: 0.003 },
      { pos: [5, -2, -4], size: 0.9, color: '#06b6d4', speed: 0.004 },
      { pos: [0, 3, -5], size: 0.7, color: '#ec4899', speed: 0.005 },
      { pos: [-3, -3, -2], size: 0.5, color: '#a855f7', speed: 0.006 },
      { pos: [4, 3, -3], size: 0.6, color: '#06b6d4', speed: 0.004 },
    ];
    icoData.forEach(({ pos, size, color, speed }) => {
      const geo = new THREE.IcosahedronGeometry(size, 0);
      const mat = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.userData.speed = speed;
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      scene.add(mesh);
      icoMeshes.push(mesh);
    });

    // --- Torus rings ---
    const torusMeshes: THREE.Mesh[] = [];
    const torusData = [
      { pos: [-4, 1, -4], r: 1.5, tube: 0.03, color: '#a855f7' },
      { pos: [4, -1, -5], r: 1.2, tube: 0.03, color: '#06b6d4' },
      { pos: [0, -3, -3], r: 1.0, tube: 0.02, color: '#ec4899' },
    ];
    torusData.forEach(({ pos, r, tube, color }) => {
      const geo = new THREE.TorusGeometry(r, tube, 16, 100);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      scene.add(mesh);
      torusMeshes.push(mesh);
    });

    // --- Grid ---
    const gridHelper = new THREE.GridHelper(40, 30, '#a855f7', '#1e1b4b');
    gridHelper.position.y = -6;
    gridHelper.rotation.x = 0;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.08;
    scene.add(gridHelper);

    // --- Animate ---
    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.008;

      particles.rotation.y = time * 0.04;
      particles.rotation.x = time * 0.02;

      icoMeshes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.speed;
        mesh.rotation.y += mesh.userData.speed * 1.3;
        mesh.position.y += Math.sin(time + mesh.userData.floatOffset) * 0.003;
      });

      torusMeshes.forEach((mesh, i) => {
        mesh.rotation.z += 0.003 + i * 0.001;
        mesh.rotation.x += 0.002;
        mesh.position.y += Math.sin(time * 0.5 + mesh.userData.floatOffset) * 0.002;
      });

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
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
