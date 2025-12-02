"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LoadingGlobe({ size = 120 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const width = size;
      const height = size;

      // Scene
      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 0, 8);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.sortObjects = false;
      rendererRef.current = renderer;

      // Globe group
      const globeGroup = new THREE.Group();
      scene.add(globeGroup);
      globeGroupRef.current = globeGroup;

      // Colors
      const neonBlue = new THREE.Color(0x3bc7ff);
      const neonPurple = new THREE.Color(0xb43cff);

      // Create wireframe globe (simplified for smaller size)
      const wireframeRadius = 2.5;
      const wireframeGeometry = new THREE.SphereGeometry(wireframeRadius, 24, 24);
      
      // Latitude lines (fewer for performance)
      for (let lat = -80; lat <= 80; lat += 30) {
        const latGeometry = new THREE.BufferGeometry();
        const latPoints: number[] = [];
        const segments = 32;

        for (let i = 0; i <= segments; i++) {
          const lng = (i / segments) * Math.PI * 2;
          const x = Math.cos(lng) * Math.cos((lat * Math.PI) / 180) * wireframeRadius;
          const y = Math.sin((lat * Math.PI) / 180) * wireframeRadius;
          const z = Math.sin(lng) * Math.cos((lat * Math.PI) / 180) * wireframeRadius;
          latPoints.push(x, y, z);
        }

        latGeometry.setAttribute("position", new THREE.Float32BufferAttribute(latPoints, 3));
        const latLine = new THREE.Line(latGeometry, new THREE.LineBasicMaterial({ color: neonBlue, transparent: true, opacity: 0.6 }));
        globeGroup.add(latLine);
      }

      // Longitude lines (fewer for performance)
      for (let lng = 0; lng < 360; lng += 30) {
        const lngGeometry = new THREE.BufferGeometry();
        const lngPoints: number[] = [];
        const segments = 16;

        for (let i = 0; i <= segments; i++) {
          const lat = ((i / segments) - 0.5) * Math.PI;
          const x = Math.cos((lng * Math.PI) / 180) * Math.cos(lat) * wireframeRadius;
          const y = Math.sin(lat) * wireframeRadius;
          const z = Math.sin((lng * Math.PI) / 180) * Math.cos(lat) * wireframeRadius;
          lngPoints.push(x, y, z);
        }

        lngGeometry.setAttribute("position", new THREE.Float32BufferAttribute(lngPoints, 3));
        const lngLine = new THREE.Line(lngGeometry, new THREE.LineBasicMaterial({ color: neonPurple, transparent: true, opacity: 0.5 }));
        globeGroup.add(lngLine);
      }

      // Data points (fewer for performance)
      const pointCount = 150;
      const pointGeometry = new THREE.BufferGeometry();
      const pointPositions = new Float32Array(pointCount * 3);
      const pointColors = new Float32Array(pointCount * 3);
      const pointSizes = new Float32Array(pointCount);

      for (let i = 0; i < pointCount; i++) {
        const lat = (Math.random() - 0.5) * Math.PI;
        const lng = Math.random() * Math.PI * 2;
        const radius = wireframeRadius + (Math.random() - 0.5) * 0.1;

        const x = Math.cos(lng) * Math.cos(lat) * radius;
        const y = Math.sin(lat) * radius;
        const z = Math.sin(lng) * Math.cos(lat) * radius;

        pointPositions[i * 3] = x;
        pointPositions[i * 3 + 1] = y;
        pointPositions[i * 3 + 2] = z;

        const colorMix = Math.random();
        const color = colorMix > 0.5 ? neonBlue : neonPurple;
        pointColors[i * 3] = color.r;
        pointColors[i * 3 + 1] = color.g;
        pointColors[i * 3 + 2] = color.b;

        pointSizes[i] = 1 + Math.random() * 2;
      }

      pointGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
      pointGeometry.setAttribute("color", new THREE.BufferAttribute(pointColors, 3));
      pointGeometry.setAttribute("size", new THREE.BufferAttribute(pointSizes, 1));

      const pointMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(pointGeometry, pointMaterial);
      globeGroup.add(points);

      // Orbiting particles (fewer for performance)
      const orbitParticleCount = 4;
      const orbitParticles: THREE.Mesh[] = [];
      for (let i = 0; i < orbitParticleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? neonBlue : neonPurple,
          transparent: true,
          opacity: 0.6,
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const orbitRadius = 3 + Math.random() * 0.5;
        const orbitSpeed = 0.5 + Math.random() * 0.3;
        const orbitAngle = (i / orbitParticleCount) * Math.PI * 2;
        
        (particle as any).orbitRadius = orbitRadius;
        (particle as any).orbitSpeed = orbitSpeed;
        (particle as any).orbitAngle = orbitAngle;
        (particle as any).orbitHeight = (Math.random() - 0.5) * 0.5;
        
        globeGroup.add(particle);
        orbitParticles.push(particle);
      }

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Animation
      let time = 0;
      const clock = new THREE.Clock();

      const animate = () => {
        const delta = clock.getDelta();
        time += delta;

        // Constant rotation
        globeGroup.rotation.y += 0.01;
        globeGroup.rotation.x = Math.sin(time * 0.5) * 0.2;

        // Pulse points (simplified)
        if (Math.floor(time * 10) % 3 === 0) {
          const sizes = pointGeometry.attributes.size.array as Float32Array;
          for (let i = 0; i < pointCount; i += 3) {
            const pulse = Math.sin(time * 2 + i * 0.1) * 0.5 + 1;
            pointSizes[i] = sizes[i] * pulse;
          }
          pointGeometry.attributes.size.needsUpdate = true;
        }

        // Animate orbiting particles
        orbitParticles.forEach((particle) => {
          const orbit = particle as any;
          orbit.orbitAngle += orbit.orbitSpeed * delta;
          const x = Math.cos(orbit.orbitAngle) * orbit.orbitRadius;
          const z = Math.sin(orbit.orbitAngle) * orbit.orbitRadius;
          const y = Math.sin(orbit.orbitAngle * 2) * orbit.orbitHeight;
          particle.position.set(x, y, z);
        });

        renderer.render(scene, camera);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();

      // Cleanup
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        });

        renderer.dispose();
      };
    } catch (error) {
      console.error("Error initializing Loading Globe:", error);
    }
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
      }}
    />
  );
}

