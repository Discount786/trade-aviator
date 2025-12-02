"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CandleData {
  isBullish: boolean;
  height: number;
  bodyHeight: number;
  bodyWidth: number;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [candles] = useState<CandleData[]>(() => {
    // Generate 3 candles: middle one red (bearish), outer two green (bullish)
    return Array.from({ length: 3 }, (_, index) => {
      const isBullish = index !== 1; // Middle candle (index 1) is bearish (red)
      const height = (20 + Math.random() * 10) * 0.75; // 25% smaller: 15-22.5px
      const bodyHeight = height * 0.6;
      const bodyWidth = (4 + Math.random() * 2) * 0.75; // 25% smaller: 3-4.5px
      return { isBullish, height, bodyHeight, bodyWidth };
    });
  });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Smooth interpolation for cursor following
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;

      if (cursor) {
        // Offset cursor so it doesn't block text/clicking
        cursor.style.left = `${currentX + 15}px`;
        cursor.style.top = `${currentY + 15}px`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const spacing = 8 * 0.75; // Space between candles (25% smaller)
  const totalWidth = candles.reduce((sum, c) => sum + c.bodyWidth, 0) + spacing * (candles.length - 1);
  const maxHeight = Math.max(...candles.map(c => c.height));

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        transform: "translate(-50%, -50%)",
        willChange: "transform",
      }}
    >
      <svg
        width={totalWidth}
        height={maxHeight + 8}
        viewBox={`0 0 ${totalWidth} ${maxHeight + 8}`}
        style={{
          filter: "drop-shadow(0 0 6px rgba(0, 255, 136, 0.6)) drop-shadow(0 0 6px rgba(255, 51, 85, 0.6))",
          transform: "scale(0.75)", // 25% smaller
        }}
      >
        {candles.map((candle, index) => {
          const x = candles.slice(0, index).reduce((sum, c) => sum + c.bodyWidth + spacing, 0) + candle.bodyWidth / 2;
          const bodyY = (maxHeight - candle.bodyHeight) / 2;
          const wickTop = 2;
          const wickBottom = maxHeight - 2;
          const bodyColor = candle.isBullish ? "#00ff88" : "#ff3355";
          const wickColor = "#ffffff";

          return (
            <g key={index}>
              {/* Top wick */}
              <motion.line
                x1={x}
                y1={wickTop}
                x2={x}
                y2={bodyY}
                stroke={wickColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  pathLength: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              />

              {/* Candle body */}
              <motion.rect
                x={x - candle.bodyWidth / 2}
                y={bodyY}
                width={candle.bodyWidth}
                height={candle.bodyHeight}
                fill={bodyColor}
                stroke={bodyColor}
                strokeWidth="0.5"
                rx="1"
                initial={{ opacity: 0.9 }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.2 + Math.random() * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
              />

              {/* Glow effect */}
              <motion.rect
                x={x - candle.bodyWidth / 2}
                y={bodyY}
                width={candle.bodyWidth}
                height={candle.bodyHeight}
                fill="none"
                stroke={bodyColor}
                strokeWidth="1"
                rx="1"
                opacity={0.4}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.8 + Math.random() * 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.25,
                }}
              />

              {/* Bottom wick */}
              <motion.line
                x1={x}
                y1={bodyY + candle.bodyHeight}
                x2={x}
                y2={wickBottom}
                stroke={wickColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  pathLength: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2 + 0.1,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

