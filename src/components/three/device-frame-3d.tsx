"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCcw, Smartphone, Laptop, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeviceFrame3DProps {
  deviceType?: "mobile" | "laptop";
  title?: string;
  className?: string;
}

export function DeviceFrame3D({
  deviceType = "laptop",
  title = "YEKPON DIGIT Solution",
  className = "",
}: DeviceFrame3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentType, setCurrentType] = useState<"mobile" | "laptop">(deviceType);
  const resetTriggerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 340;

    // 1. Scène, Caméra, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    container.appendChild(renderer.domElement);

    // 2. Lumière
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dir.position.set(4, 5, 4);
    scene.add(dir);

    const deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // 3. Texture d'écran
    const makeTexture = () => {
      const cvs = document.createElement("canvas");
      cvs.width = 512;
      cvs.height = currentType === "laptop" ? 340 : 680;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        // Header
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 0, cvs.width, 36);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(title, 20, 24);

        // Mock UI
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("Production Ready", 24, 80);

        ctx.fillStyle = "#64748b";
        ctx.font = "12px sans-serif";
        ctx.fillText("Code Source & Déploiement Vercel / Docker", 24, 105);

        ctx.fillStyle = "#111827";
        ctx.fillRect(24, 130, cvs.width - 48, currentType === "laptop" ? 160 : 350);

        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.strokeRect(24, 130, cvs.width - 48, currentType === "laptop" ? 160 : 350);
      }
      return new THREE.CanvasTexture(cvs);
    };

    const screenTex = makeTexture();

    // 4. Géométrie du device selon le type
    let geo: THREE.BufferGeometry;
    if (currentType === "laptop") {
      geo = new THREE.BoxGeometry(2.8, 1.8, 0.08);
    } else {
      geo = new THREE.BoxGeometry(1.2, 2.4, 0.08);
    }

    const mats = [
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ map: screenTex, roughness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 }),
    ];

    const mesh = new THREE.Mesh(geo, mats);
    deviceGroup.add(mesh);

    // 5. Drag interactif 360°
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      deviceGroup.rotation.y += deltaX * 0.01;
      deviceGroup.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Fonction de reset
    resetTriggerRef.current = () => {
      deviceGroup.rotation.set(0, 0, 0);
    };

    // 6. Boucle de rendu
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        deviceGroup.rotation.y += 0.003; // Rotation subtile automatique
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);

      geo.dispose();
      screenTex.dispose();
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [currentType, title]);

  return (
    <div className={`relative rounded-2xl border border-border/80 bg-card p-4 overflow-hidden shadow-lg ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={currentType === "laptop" ? "primary" : "ghost"}
            onClick={() => setCurrentType("laptop")}
            className="h-8 text-xs gap-1.5"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Laptop</span>
          </Button>

          <Button
            size="sm"
            variant={currentType === "mobile" ? "primary" : "ghost"}
            onClick={() => setCurrentType("mobile")}
            className="h-8 text-xs gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smartphone</span>
          </Button>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => resetTriggerRef.current?.()}
          className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
          title="Réinitialiser l'angle"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Recentrer</span>
        </Button>
      </div>

      <div
        ref={mountRef}
        className="w-full h-72 sm:h-80 cursor-grab active:cursor-grabbing select-none"
      />
      <div className="text-[10px] text-center text-muted-foreground italic mt-1">
        Faites glisser pour faire pivoter en 3D à 360°
      </div>
    </div>
  );
}
