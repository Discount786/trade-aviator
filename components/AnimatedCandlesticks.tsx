"use client";

import { motion } from "framer-motion";

interface CandlestickProps {
  height: number;
  bodyHeight: number;
  bodyWidth: number;
  isBullish: boolean;
  delay: number;
  x: number;
}

function Candlestick({ height, bodyHeight, bodyWidth, isBullish, delay, x }: CandlestickProps) {
  const bodyY = height / 2 - bodyHeight / 2;
  const bodyTop = bodyY;
  const bodyBottom = bodyY + bodyHeight;
  // Short wicks - only small segments at top and bottom
  const wickTop = height * 0.05;
  const wickBottom = height * 0.95;
  const wickCenterX = x;
  const wickSegmentLength = height * 0.08; // Short wick segments
  
  // More subtle colors that blend with background
  const bodyColor = isBullish ? "rgba(86, 224, 255, 0.3)" : "rgba(58, 139, 255, 0.3)";
  const wickColor = "rgba(167, 139, 250, 0.25)";

  return (
    <g>
      {/* Top wick segment (short, above body) */}
      <motion.line
        x1={wickCenterX}
        y1={bodyTop - wickSegmentLength}
        x2={wickCenterX}
        y2={bodyTop}
        stroke={wickColor}
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: delay, ease: "easeOut" }}
      />
      
      {/* Bottom wick segment (short, below body) */}
      <motion.line
        x1={wickCenterX}
        y1={bodyBottom}
        x2={wickCenterX}
        y2={bodyBottom + wickSegmentLength}
        stroke={wickColor}
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: delay, ease: "easeOut" }}
      />
      
      {/* Body outline - longer/taller rectangle */}
      <motion.rect
        x={x - bodyWidth / 2}
        y={bodyY}
        width={bodyWidth}
        height={bodyHeight}
        fill="none"
        stroke={bodyColor}
        strokeWidth="4"
        rx="3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.5, ease: "easeOut" }}
      />
      
      {/* Glow effect */}
      <motion.rect
        x={x - bodyWidth / 2}
        y={bodyY}
        width={bodyWidth}
        height={bodyHeight}
        fill="none"
        stroke={bodyColor}
        strokeWidth="2"
        rx="3"
        opacity={0.15}
        initial={{ scale: 1, opacity: 0 }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ 
          duration: 2,
          delay: delay + 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </g>
  );
}

export default function AnimatedCandlesticks() {
  // Longer body heights, shorter wicks - significantly different delays and durations for asynchronous movement
  const candlesticks = [
    { height: 400, bodyHeight: 320, bodyWidth: 38, isBullish: true, delay: 0, duration: 2.5 }, // Starts immediately, faster
    { height: 450, bodyHeight: 360, bodyWidth: 46, isBullish: false, delay: 1.2, duration: 3.8 }, // Starts later, slower
    { height: 420, bodyHeight: 340, bodyWidth: 42, isBullish: true, delay: 2.1, duration: 2.9 }, // Starts even later, medium speed
  ];

  const spacing = 45; // Reduced spacing by 75% (from 180px to 45px)
  const maxHeight = Math.max(...candlesticks.map(c => c.height));
  
  // Calculate total width: sum of all body widths + spacing between them
  const totalBodyWidth = candlesticks.reduce((sum, c) => sum + c.bodyWidth, 0);
  const totalSpacing = spacing * (candlesticks.length - 1);
  const svgWidth = totalBodyWidth + totalSpacing + 120; // Extra padding on sides
  const svgHeight = maxHeight + 120; // Extra padding top/bottom

  // Position candles consecutively side by side
  let currentX = 60; // Start position from left edge
  const candlePositions = candlesticks.map(candle => {
    const x = currentX + candle.bodyWidth / 2; // Center X of this candle
    currentX += candle.bodyWidth + spacing; // Move to start of next candle
    return { ...candle, x };
  });

  const centerY = svgHeight / 2;

  return (
    <div 
      className="fixed left-0 top-1/2 pointer-events-none overflow-visible"
      style={{ 
        zIndex: 1,
        willChange: 'transform',
        transform: 'translateY(-50%) translateX(2%)',
        width: `${svgWidth}px`,
        height: `${svgHeight}px`,
      }}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{
          filter: 'drop-shadow(0 0 15px rgba(167, 139, 250, 0.2))',
          opacity: 0.35,
        }}
      >
        {candlePositions.map((candle, index) => {
          const baseY = centerY - candle.height / 2;
          const centerX = candle.x; // Center X position of this candle
          const amplitude = 50 + (index * 15);
          const duration = candle.duration || (3 + (index * 0.5));
          
          // Calculate the left edge of the candle for positioning
          const candleLeftX = centerX - candle.bodyWidth / 2;
          
          return (
            <motion.g
              key={index}
              initial={{ transform: `translate(${candleLeftX}, ${baseY})` }}
              animate={{
                transform: [
                  `translate(${candleLeftX}, ${baseY - amplitude})`,
                  `translate(${candleLeftX}, ${baseY + amplitude})`,
                  `translate(${candleLeftX}, ${baseY - amplitude})`
                ]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                delay: candle.delay,
                repeatDelay: 0
              }}
            >
              <Candlestick
                height={candle.height}
                bodyHeight={candle.bodyHeight}
                bodyWidth={candle.bodyWidth}
                isBullish={candle.isBullish}
                delay={0}
                x={candle.bodyWidth / 2}
              />
            </motion.g>
          );
        })}
      </svg>
      
      {/* Animated glow behind candlesticks - more subtle */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)',
          width: '600px',
          height: '600px',
          left: '8%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

