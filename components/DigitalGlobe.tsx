"use client";

import { motion } from "framer-motion";

export default function DigitalGlobe() {
  return (
    <div 
      className="fixed right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-30 hidden lg:block"
      style={{ 
        zIndex: 1,
        transform: 'translateX(5%) translateY(-50%)',
        willChange: 'transform',
      }}
    >
      <motion.div
        animate={{ 
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: "center center",
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
        }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          style={{
            filter: "drop-shadow(0 0 50px rgba(58, 139, 255, 0.5))",
          }}
        >
          <defs>
            <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(58, 139, 255, 0.8)" />
              <stop offset="50%" stopColor="rgba(86, 224, 255, 1)" />
              <stop offset="100%" stopColor="rgba(58, 139, 255, 0.8)" />
            </linearGradient>
            <radialGradient id="glowGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(86, 224, 255, 0.4)" />
              <stop offset="70%" stopColor="rgba(58, 139, 255, 0.2)" />
              <stop offset="100%" stopColor="rgba(58, 139, 255, 0)" />
            </radialGradient>
            <pattern id="pixelGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="rgba(58, 139, 255, 0.05)" />
              <circle cx="5" cy="5" r="0.8" fill="rgba(86, 224, 255, 0.4)" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer glow layers */}
          <circle cx="250" cy="250" r="220" fill="url(#glowGradient)" opacity="0.6" />
          <circle cx="250" cy="250" r="200" fill="url(#glowGradient)" opacity="0.4" />

          {/* Pixel grid overlay */}
          <circle cx="250" cy="250" r="200" fill="url(#pixelGrid)" opacity="0.5" />

          {/* Latitude rings - full circles */}
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((lat, i) => {
            const progress = lat / 180;
            const radius = 200 * Math.sin(progress * Math.PI);
            const y = 250 + (lat - 90) * 2.2;
            const opacity = Math.sin(progress * Math.PI) * 0.8;
            const strokeWidth = progress === 0.5 ? 3 : progress === 0.25 || progress === 0.75 ? 2 : 1;
            const isEquator = progress === 0.5;
            
            if (radius <= 0) return null;
            
            return (
              <circle
                key={`lat-${i}`}
                cx="250"
                cy={y}
                r={radius}
                fill="none"
                stroke={isEquator ? "rgba(86, 224, 255, 1)" : "url(#globeGradient)"}
                strokeWidth={strokeWidth}
                opacity={opacity}
                filter={isEquator ? "url(#glow)" : undefined}
              />
            );
          })}

          {/* Longitude lines - full circles from center */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15) * (Math.PI / 180);
            const x1 = 250 + 200 * Math.cos(angle);
            const y1 = 250 + 200 * Math.sin(angle);
            const x2 = 250 - 200 * Math.cos(angle);
            const y2 = 250 - 200 * Math.sin(angle);
            
            return (
              <line
                key={`long-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(86, 224, 255, 0.7)"
                strokeWidth="1.5"
                opacity="0.6"
              />
            );
          })}

          {/* Secondary detail rings */}
          {[7, 22, 37, 52, 67, 82, 97, 112, 127, 142, 157, 172].map((lat, i) => {
            const progress = lat / 180;
            const radius = 200 * Math.sin(progress * Math.PI);
            const y = 250 + (lat - 90) * 2.2;
            const opacity = Math.sin(progress * Math.PI) * 0.25;
            
            if (radius <= 0) return null;
            
            return (
              <circle
                key={`detail-${i}`}
                cx="250"
                cy={y}
                r={radius}
                fill="none"
                stroke="rgba(58, 139, 255, 0.5)"
                strokeWidth="0.8"
                strokeDasharray="3 3"
                opacity={opacity}
              />
            );
          })}

          {/* Pixel dots - reduced for performance */}
          {Array.from({ length: 100 }).map((_, i) => {
            const angle = (i * 3.6) * (Math.PI / 180);
            const radius = 120 + (i % 3) * 25;
            const x = 250 + radius * Math.cos(angle);
            const y = 250 + radius * Math.sin(angle);
            const size = 1 + (i % 2) * 0.5;
            const opacity = 0.5 + (i % 3) * 0.15;
            
            return (
              <circle
                key={`pixel-${i}`}
                cx={x}
                cy={y}
                r={size}
                fill="rgba(86, 224, 255, 0.8)"
                opacity={opacity}
              />
            );
          })}

          {/* Main equator ring (thickest, glowing) */}
          <circle
            cx="250"
            cy="250"
            r="200"
            fill="none"
            stroke="rgba(86, 224, 255, 1)"
            strokeWidth="4"
            opacity="1"
            filter="url(#glow)"
          />

          {/* Secondary equator highlight */}
          <circle
            cx="250"
            cy="250"
            r="200"
            fill="none"
            stroke="rgba(58, 139, 255, 0.6)"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* Outer border with glow */}
          <circle
            cx="250"
            cy="250"
            r="200"
            fill="none"
            stroke="rgba(58, 139, 255, 1)"
            strokeWidth="2.5"
            filter="url(#glow)"
          />

          {/* Animated data streams - reduced for performance */}
          {Array.from({ length: 6 }).map((_, i) => {
            const startAngle = (i * 60) * (Math.PI / 180);
            return (
              <motion.circle
                key={`stream-${i}`}
                r="2.5"
                fill="rgba(86, 224, 255, 0.9)"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
                animate={{
                  cx: [
                    250 + 180 * Math.cos(startAngle),
                    250 + 180 * Math.cos(startAngle + Math.PI * 2),
                  ],
                  cy: [
                    250 + 180 * Math.sin(startAngle),
                    250 + 180 * Math.sin(startAngle + Math.PI * 2),
                  ],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  cx: {
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  cy: {
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  },
                }}
              />
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
