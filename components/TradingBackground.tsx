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
  const wickTop = height * 0.05;
  const wickBottom = height * 0.95;
  const wickCenterX = x;
  const wickSegmentLength = height * 0.08;
  
  const bodyColor = isBullish ? "rgba(86, 224, 255, 0.2)" : "rgba(58, 139, 255, 0.2)";
  const wickColor = "rgba(167, 139, 250, 0.15)";

  return (
    <g>
      <motion.line
        x1={wickCenterX}
        y1={bodyTop - wickSegmentLength}
        x2={wickCenterX}
        y2={bodyTop}
        stroke={wickColor}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: delay, ease: "easeOut" }}
      />
      
      <motion.line
        x1={wickCenterX}
        y1={bodyBottom}
        x2={wickCenterX}
        y2={bodyBottom + wickSegmentLength}
        stroke={wickColor}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: delay, ease: "easeOut" }}
      />
      
      <motion.rect
        x={x - bodyWidth / 2}
        y={bodyY}
        width={bodyWidth}
        height={bodyHeight}
        fill="none"
        stroke={bodyColor}
        strokeWidth="3"
        rx="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.5, ease: "easeOut" }}
      />
      
      <motion.rect
        x={x - bodyWidth / 2}
        y={bodyY}
        width={bodyWidth}
        height={bodyHeight}
        fill={bodyColor}
        rx="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 2 + delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.8
        }}
      />
    </g>
  );
}

export default function TradingBackground() {
  const candlesticks = [
    { height: 200, bodyHeight: 160, bodyWidth: 25, isBullish: true, delay: 0, duration: 2.5 },
    { height: 250, bodyHeight: 200, bodyWidth: 30, isBullish: false, delay: 0.8, duration: 3.2 },
    { height: 220, bodyHeight: 180, bodyWidth: 28, isBullish: true, delay: 1.5, duration: 2.8 },
    { height: 240, bodyHeight: 190, bodyWidth: 32, isBullish: false, delay: 2.2, duration: 3.5 },
    { height: 210, bodyHeight: 170, bodyWidth: 27, isBullish: true, delay: 2.8, duration: 2.6 },
  ];

  const spacing = 60;
  const maxHeight = Math.max(...candlesticks.map(c => c.height));
  const totalBodyWidth = candlesticks.reduce((sum, c) => sum + c.bodyWidth, 0);
  const totalSpacing = spacing * (candlesticks.length - 1);
  const svgWidth = totalBodyWidth + totalSpacing + 100;
  const svgHeight = maxHeight + 80;

  let currentX = 50;
  const candlePositions = candlesticks.map(candle => {
    const x = currentX + candle.bodyWidth / 2;
    currentX += candle.bodyWidth + spacing;
    return { ...candle, x };
  });

  const centerY = svgHeight / 2;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid slice"
        style={{
          opacity: 0.12,
        }}
      >
        {candlePositions.map((candle, index) => {
          const baseY = centerY - candle.height / 2;
          const centerX = candle.x;
          const amplitude = 30 + (index * 10);
          const duration = candle.duration || (3 + (index * 0.5));
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
                ease: "easeInOut",
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
      
      {/* Additional background elements */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(86, 224, 255, 0.08) 0%, transparent 70%)',
          width: '800px',
          height: '800px',
          left: '10%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(58, 139, 255, 0.08) 0%, transparent 70%)',
          width: '600px',
          height: '600px',
          right: '10%',
          top: '30%',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}

