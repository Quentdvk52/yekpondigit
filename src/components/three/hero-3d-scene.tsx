"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Smartphone, Laptop, ShieldCheck } from "lucide-react";

export function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Détection prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
    }

    // 2. Détection de support WebGL
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebglSupported(Boolean(gl));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !webglSupported || reducedMotion) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scène, Caméra, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Éclairage cinématique
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const accentLight = new THREE.PointLight(0x818cf8, 3.0, 15);
    accentLight.position.set(-4, -2, 3);
    scene.add(accentLight);

    const group = new THREE.Group();
    scene.add(group);

    // 3. Texture procédurale pour l'écran de l'ordinateur portable / fenêtre SaaS
    const createScreenTexture = (title: string, color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 340;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Fond sombre luxe
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, 512, 340);

        // Barre de titre avec 3 points macOS
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 0, 512, 40);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(24, 20, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#eab308";
        ctx.beginPath();
        ctx.arc(44, 20, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(64, 20, 6, 0, Math.PI * 2);
        ctx.fill();

        // Titre
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 16px Inter, sans-serif";
        ctx.fillText(title, 90, 26);

        // Dashboard graphique simule
        ctx.fillStyle = color;
        ctx.font = "bold 26px Inter, sans-serif";
        ctx.fillText("+1 845 000 FCFA", 30, 95);
        ctx.fillStyle = "#64748b";
        ctx.font = "14px Inter, sans-serif";
        ctx.fillText("Ventes en direct • Mobile Money & Cartes", 30, 122);

        // Courbe stylisée
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(30, 240);
        ctx.bezierCurveTo(120, 200, 180, 270, 260, 180);
        ctx.bezierCurveTo(340, 110, 400, 190, 480, 140);
        ctx.stroke();

        // 3 cartes métriques
        ctx.fillStyle = "#111827";
        ctx.fillRect(30, 260, 130, 60);
        ctx.fillRect(190, 260, 130, 60);
        ctx.fillRect(350, 260, 130, 60);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 16px Inter, sans-serif";
        ctx.fillText("12 Ventes", 45, 296);
        ctx.fillText("99.9% Uptime", 200, 296);
        ctx.fillText("100% Code", 365, 296);
      }
      return new THREE.CanvasTexture(canvas);
    };

    // 4. Objet 1 : Fenêtre SaaS / Laptop (au centre-droit)
    const laptopGeo = new THREE.BoxGeometry(3.2, 2.1, 0.08);
    const screenTexture = createScreenTexture("YekponStore — Multi-Vendor SaaS", "#38bdf8");
    const laptopMats = [
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ map: screenTexture, roughness: 0.1 }), // Face avant
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 }),
    ];
    const laptopMesh = new THREE.Mesh(laptopGeo, laptopMats);
    laptopMesh.position.set(1.1, 0.2, 0);
    laptopMesh.rotation.set(-0.05, -0.22, 0.04);
    group.add(laptopMesh);

    // 5. Objet 2 : Smartphone Moderne (au premier plan gauche)
    const phoneGeo = new THREE.BoxGeometry(1.3, 2.6, 0.09);
    const phoneTexture = createScreenTexture("SchoolDesk Mobile", "#818cf8");
    const phoneMats = [
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.1 }),
      new THREE.MeshStandardMaterial({ map: phoneTexture, roughness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 }),
    ];
    const phoneMesh = new THREE.Mesh(phoneGeo, phoneMats);
    phoneMesh.position.set(-1.8, -0.4, 1.2);
    phoneMesh.rotation.set(0.12, 0.35, -0.08);
    group.add(phoneMesh);

    // 6. Objet 3 : Carte de Licence Cryptographique Flottante (en haut à gauche)
    const cardGeo = new THREE.BoxGeometry(1.6, 1.0, 0.04);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e17,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.set(-1.5, 1.3, 0.5);
    cardMesh.rotation.set(0.2, 0.15, -0.15);
    group.add(cardMesh);

    // 7. Particules légères d'ambiance
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // 8. Interaction Parallaxe Curseur & Gyroscope
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetRotationY = x * 0.25;
      targetRotationX = -y * 0.15;
    };

    window.addEventListener("mousemove", onMouseMove);

    // 9. Boucle d'animation avec lerp et lévitation fluide
    let animId: number;
    let clock = new THREE.Clock();
    let isVisible = true;

    // Pause hors écran via IntersectionObserver
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = Boolean(entry?.isIntersecting);
    });
    observer.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Damping fluide
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.06;
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.06;

      // Lévitation sinusoïdale
      laptopMesh.position.y = 0.2 + Math.sin(elapsedTime * 1.2) * 0.08;
      laptopMesh.rotation.z = 0.04 + Math.cos(elapsedTime * 0.9) * 0.02;

      phoneMesh.position.y = -0.4 + Math.sin(elapsedTime * 1.5 + 1) * 0.1;
      phoneMesh.rotation.y = 0.35 + Math.sin(elapsedTime * 1.1) * 0.05;

      cardMesh.position.y = 1.3 + Math.sin(elapsedTime * 1.8 + 2) * 0.06;
      cardMesh.rotation.x = 0.2 + Math.cos(elapsedTime * 1.4) * 0.04;

      particleField.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Redimensionnement
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 420;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", onResize);

    // 11. Nettoyage mémoire rigoureux (Three.js Best Practices)
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      // Disposal géométries & matériaux
      laptopGeo.dispose();
      phoneGeo.dispose();
      cardGeo.dispose();
      particleGeo.dispose();
      screenTexture.dispose();
      phoneTexture.dispose();
      particleMat.dispose();
      cardMat.dispose();

      laptopMats.forEach((m) => m.dispose());
      phoneMats.forEach((m) => m.dispose());

      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported, reducedMotion]);

  // Fallback CSS 3D si WebGL indisponible ou reduced-motion actif
  if (webglSupported === false || reducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="w-full h-80 sm:h-96 flex items-center justify-center relative select-none"
      >
        <div className="relative w-full max-w-lg aspect-video rounded-3xl border border-sky-500/30 bg-card/80 backdrop-blur-xl p-6 shadow-2xl shadow-sky-500/10 flex flex-col justify-between transform -rotate-1 hover:rotate-0 transition-transform duration-500">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-muted-foreground ml-2">YekponStore SaaS v1.2</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
              LIVE DEMO
            </span>
          </div>

          <div className="space-y-2 py-4">
            <div className="font-mono font-black text-2xl text-foreground">
              Plateforme E-Commerce Clé en Main
            </div>
            <div className="text-xs text-muted-foreground">
              Passerelle FedaPay + KKiaPay intégrée • Multi-devises XOF/EUR/USD
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Licence HMAC &amp; Code Source Inclus</span>
            </span>
            <span className="font-mono font-bold text-sky-400">125 000 FCFA</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="w-full h-[380px] sm:h-[450px] relative select-none cursor-grab active:cursor-grabbing"
    />
  );
}
