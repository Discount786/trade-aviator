"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function DigitalGlobe3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      // Ensure canvas has dimensions - responsive for mobile
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? Math.min(400, window.innerWidth * 0.9) : 650;
      const height = isMobile ? Math.min(400, window.innerWidth * 0.9) : 650;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile, // Disable antialiasing on mobile for better performance
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2)); // Lower pixel ratio on mobile
    renderer.setClearColor(0x000000, 0); // Transparent
    renderer.sortObjects = false; // Disable sorting for better performance
    rendererRef.current = renderer;

    // Globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Colors
    const neonBlue = new THREE.Color(0x3bc7ff);
    const neonPurple = new THREE.Color(0xb43cff);
    const white = new THREE.Color(0xffffff);

    // Create wireframe globe
    const wireframeRadius = 2.5;
    const wireframeGeometry = new THREE.SphereGeometry(wireframeRadius, 32, 32);
    
    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      const latGeometry = new THREE.BufferGeometry();
      const latPoints: number[] = [];
      const segments = 64;

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

    // Longitude lines
    for (let lng = 0; lng < 360; lng += 20) {
      const lngGeometry = new THREE.BufferGeometry();
      const lngPoints: number[] = [];
      const segments = 32;

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

    // Data points (dots) - reduce on mobile for performance
    const pointCount = isMobile ? 150 : 300;
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

      // Random color between blue and purple
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

    // Connection lines between some points (trading routes) - reduce on mobile
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions: number[] = [];
    const connectionCount = isMobile ? 25 : 50;

    for (let i = 0; i < connectionCount; i++) {
      const index1 = Math.floor(Math.random() * pointCount);
      const index2 = Math.floor(Math.random() * pointCount);
      if (index1 === index2) continue;

      const x1 = pointPositions[index1 * 3];
      const y1 = pointPositions[index1 * 3 + 1];
      const z1 = pointPositions[index1 * 3 + 2];

      const x2 = pointPositions[index2 * 3];
      const y2 = pointPositions[index2 * 3 + 1];
      const z2 = pointPositions[index2 * 3 + 2];

      // Create arc
      const segments = 8;
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const midLat = (Math.atan2(y1, Math.sqrt(x1 * x1 + z1 * z1)) + Math.atan2(y2, Math.sqrt(x2 * x2 + z2 * z2))) / 2;
        const radius = wireframeRadius * (1 + Math.sin(t * Math.PI) * 0.1);
        
        const x = THREE.MathUtils.lerp(x1, x2, t) * (radius / wireframeRadius);
        const y = THREE.MathUtils.lerp(y1, y2, t) * (radius / wireframeRadius);
        const z = THREE.MathUtils.lerp(z1, z2, t) * (radius / wireframeRadius);
        
        connectionPositions.push(x, y, z);
      }
    }

    connectionGeometry.setAttribute("position", new THREE.Float32BufferAttribute(connectionPositions, 3));
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: neonPurple,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    globeGroup.add(connections);

    // Orbiting particles - reduce on mobile
    const orbitParticleCount = isMobile ? 4 : 8;
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

    // Removed mouse parallax - globe will rotate constantly on its own

    // Animation
    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      // Always continue animation, even if tab is not visible (just don't render)
      const delta = clock.getDelta();
      time += delta;

      if (isVisible) {
        // Constant rotation - globe rotates continuously on its own
        globeGroup.rotation.y += 0.008; // Slightly slower for better performance
        
        // Optional: Add slight vertical rotation for more dynamic movement
        globeGroup.rotation.x = Math.sin(time * 0.5) * 0.2;

        // Pulse points - only update every few frames for performance
        if (Math.floor(time * 10) % 2 === 0) {
          const positions = pointGeometry.attributes.position.array as Float32Array;
          const sizes = pointGeometry.attributes.size.array as Float32Array;
          for (let i = 0; i < pointCount; i += 2) { // Update every other point
            const pulse = Math.sin(time * 2 + i * 0.1) * 0.5 + 1;
            pointSizes[i] = sizes[i] * pulse;
            if (i + 1 < pointCount) {
              pointSizes[i + 1] = sizes[i + 1] * pulse; // Copy to next point
            }
          }
          pointGeometry.attributes.size.needsUpdate = true;
        }

        // Animate orbiting particles
        orbitParticles.forEach((particle, i) => {
          const orbit = particle as any;
          orbit.orbitAngle += orbit.orbitSpeed * delta;
          const x = Math.cos(orbit.orbitAngle) * orbit.orbitRadius;
          const z = Math.sin(orbit.orbitAngle) * orbit.orbitRadius;
          const y = Math.sin(orbit.orbitAngle * 2) * orbit.orbitHeight;
          particle.position.set(x, y, z);
        });

        renderer.render(scene, camera);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle visibility
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvas || !camera || !renderer) return;
      
      const isMobile = window.innerWidth < 768;
      const newWidth = isMobile ? Math.min(400, window.innerWidth * 0.9) : (canvas.clientWidth || 650);
      const newHeight = isMobile ? Math.min(400, window.innerWidth * 0.9) : (canvas.clientHeight || 650);

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Dispose of Three.js resources
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
      console.error("Error initializing 3D Globe:", error);
      // Return empty cleanup if initialization failed
      return () => {};
    }
  }, [isVisible]);

  return (
    <div 
      className="digital-globe-position pointer-events-none"
      style={{
        zIndex: 1, // Below video and content, above background
        width: "650px",
        height: "650px",
        maxWidth: "90vw",
        maxHeight: "90vh",
        position: "fixed", // Ensure fixed positioning
        right: 0, // Always at right edge
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          opacity: 0.5, // Increased visibility
          transform: "translateX(5%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

