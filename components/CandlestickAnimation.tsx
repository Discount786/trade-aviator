"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CandleData {
  isBullish: boolean;
  height: number;
  bodyHeight: number;
  bodyWidth: number;
}

export default function CandlestickAnimation() {
  const [candles] = useState<CandleData[]>(() => {
    // Generate 3 random candles once on mount
    return Array.from({ length: 3 }, () => {
      const isBullish = Math.random() > 0.5;
      const height = 25 + Math.random() * 5; // 25-30px
      const bodyHeight = height * 0.65;
      const bodyWidth = 5 + Math.random() * 2; // 5-7px
      return { isBullish, height, bodyHeight, bodyWidth };
    });
  });

  const spacing = 10; // Space between candles
  const totalWidth = candles.reduce((sum, c) => sum + c.bodyWidth, 0) + spacing * (candles.length - 1);
  const maxHeight = Math.max(...candles.map(c => c.height));

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
      style={{
        willChange: "transform",
      }}
    >
      <svg
        width={totalWidth}
        height={maxHeight + 8}
        viewBox={`0 0 ${totalWidth} ${maxHeight + 8}`}
        style={{
          filter: "drop-shadow(0 0 6px rgba(0, 255, 136, 0.5)) drop-shadow(0 0 6px rgba(255, 51, 85, 0.5))",
        }}
      >
        {candles.map((candle, index) => {
          const x = candles.slice(0, index).reduce((sum, c) => sum + c.bodyWidth + spacing, 0) + candle.bodyWidth / 2;
          const bodyY = (maxHeight - candle.bodyHeight) / 2 + 4;
          const wickTop = 4;
          const wickBottom = maxHeight - 4;
          const bodyColor = candle.isBullish ? "#00ff88" : "#ff3355";
          const wickColor = "#ffffff";

          // Varying animation delays for each candle
          const delay1 = index * 0.3;
          const delay2 = index * 0.4;
          const delay3 = index * 0.35;

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
                  opacity: [0.7, 1, 0.7],
                  pathLength: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2 + Math.random() * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay1,
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
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay2,
                }}
              />

              {/* Neon glow effect */}
              <motion.rect
                x={x - candle.bodyWidth / 2}
                y={bodyY}
                width={candle.bodyWidth}
                height={candle.bodyHeight}
                fill="none"
                stroke={bodyColor}
                strokeWidth="1.5"
                rx="1"
                opacity={0.5}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.12, 1],
                }}
                transition={{
                  duration: 2.2 + Math.random() * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay3,
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
                  opacity: [0.7, 1, 0.7],
                  pathLength: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2 + Math.random() * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay1 + 0.2,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}





