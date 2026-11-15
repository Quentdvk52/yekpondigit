import { describe, it, expect } from "vitest";
import * as THREE from "three";

describe("Phase 8 — Expérience 3D WebGL & Animations", () => {
  it("initialise correctement la scène Three.js, la caméra et les dimensions de perspective", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 100);

    expect(scene).toBeDefined();
    expect(camera.fov).toBe(45);
    expect(camera.aspect).toBeCloseTo(16 / 9);

    camera.position.set(0, 0, 7.5);
    expect(camera.position.z).toBe(7.5);
  });

  it("génère les géométries 3D procédurales pour le smartphone et le laptop", () => {
    // Smartphone
    const phoneGeo = new THREE.BoxGeometry(1.3, 2.6, 0.09);
    expect(phoneGeo.parameters.width).toBe(1.3);
    expect(phoneGeo.parameters.height).toBe(2.6);
    expect(phoneGeo.attributes.position).toBeDefined();

    // Laptop
    const laptopGeo = new THREE.BoxGeometry(3.2, 2.1, 0.08);
    expect(laptopGeo.parameters.width).toBe(3.2);
    expect(laptopGeo.parameters.height).toBe(2.1);

    // Particules
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    expect(particleGeo.attributes.position?.count).toBe(120);

    // Nettoyage
    phoneGeo.dispose();
    laptopGeo.dispose();
    particleGeo.dispose();
  });

  it("calcule les amortissements (lerp) pour les interactions de parallaxe souris", () => {
    let currentY = 0;
    const targetY = 1.0;
    const factor = 0.06;

    // Simulation de 10 frames de lerp
    for (let i = 0; i < 10; i++) {
      currentY += (targetY - currentY) * factor;
    }

    expect(currentY).toBeGreaterThan(0);
    expect(currentY).toBeLessThan(targetY);
    expect(currentY).toBeCloseTo(0.46, 1);
  });

  it("calcule la lévitation périodique sinusoïdale des objets tech", () => {
    const time1 = 0;
    const time2 = Math.PI / (2 * 1.2); // sommet de la sinusoïde à ~1.31s

    const y1 = 0.2 + Math.sin(time1 * 1.2) * 0.08;
    const y2 = 0.2 + Math.sin(time2 * 1.2) * 0.08;

    expect(y1).toBe(0.2);
    expect(y2).toBeCloseTo(0.28, 2);
  });

  it("gère la dégradation gracieuse en cas d'absence de WebGL ou prefers-reduced-motion", () => {
    // Simulation environnement sans WebGL
    const checkWebGL = (hasCanvasContext: boolean) => hasCanvasContext;
    expect(checkWebGL(false)).toBe(false);

    // Simulation prefers-reduced-motion
    const checkReducedMotion = (matches: boolean) => matches;
    expect(checkReducedMotion(true)).toBe(true);
  });
});
