"use client";

import { motion } from "framer-motion";
import React from "react";

interface Path {
  id: number;
  d: string;
  width: number;
  opacity: number;
}

interface FloatingPathsProps {
  position: number;
}

function FloatingPaths({ position }: FloatingPathsProps) {
  const viewWidth = 1200;
  const viewHeight = 1000;

  const paths: Path[] = Array.from({ length: 36 }, (_, i) => {
    const progress = i / 35;

    const sx = viewWidth / 2 + position * i * 4;
    const sy = -100 + i * 2;

    const c1x = viewWidth * 0.3 - i * 5;
    const c1y = viewHeight * 0.25 + position * i * 3 + progress * progress * 50;
    const c2x = viewWidth * 0.1 - position * i * 2;
    const c2y = viewHeight * 0.6 + i * 5;
    const midX = viewWidth * 0.2 + position * i * 5;
    const midY = viewHeight * 0.85 - progress * progress * 100;

    const c3x = viewWidth * 0.45 + position * i * 4;
    const c3y = viewHeight + 100 - i * 8;
    const c4x = viewWidth * 0.8 + i * 4;
    const c4y = viewHeight * 0.3 - i * 10 - position * progress * 150;
    const endX = viewWidth + 100;
    const endY = viewHeight * 0.6 - i * 4;

    const d = `M ${sx},${sy} C ${c1x},${c1y} ${c2x},${c2y} ${midX},${midY} C ${c3x},${c3y} ${c4x},${c4y} ${endX},${endY}`;

    return {
      id: i,
      d,
      width: 0.5 + i * 0.03,
      opacity: 0.1 + i * 0.03,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-muted-foreground"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <title>Background Beams</title>
        {paths.map(path => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundBeams() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
    </div>
  );
}
